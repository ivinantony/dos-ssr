import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonRouterOutlet,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { AddressService } from "src/app/services/address/address.service";
import { CartService } from "src/app/services/cart/cart.service";
import { CheckoutService } from "src/app/services/checkout/checkout.service";
import { OrderService } from "src/app/services/order/order.service";
import { UtilsService } from "src/app/services/utils.service";
import { AddAddressPage } from "../add-address/add-address.page";
import { AddressPage } from "../address/address.page";
import { CouponPage } from "../coupon/coupon.page";
import { ModeofpaymentPage } from "../modeofpayment/modeofpayment.page";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration,
} from "@ionic-native/paypal/ngx";
import { PaytabsService } from "src/app/services/paytabs.service";
import { Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { hasLifecycleHook } from "@angular/compiler/src/lifecycle_reflector";
import { Console } from "console";
import { CartcountService } from "src/app/cartcount.service";
declare var google;

declare var RazorpayCheckout: any;
declare var Razorpay: any;
const GET_CART = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
const REMOVE = 230;
const GET_ADDRESS = 240;
const POST_ADDRESS_DETAILS = 250;
const ORDER_RESPONSE = 260;
const GET_PAY = 270;
const paytabs = require("paytabs_api");

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  selectedAddress: any;
  selectedPayment: any;
  cart: any[];
  s3url: string;
  count: number = 1;
  cartLength: number;
  amountDetails: any;
  addresses: any;
  discount_amount: number = 0;
  promo_id: any;
  payment_id: any;
  address_id: any;
  url: any;
  client_id: any;
  delivery_locations: Array<any>;
  current_selection: any;
  data: any;
  valid_address: boolean = false;
  isOut: boolean = false;
  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private platform: Platform,
    private cartService: CartService,
    private utils: UtilsService,
    private addressService: AddressService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router,
    private payPal: PayPal,
    private paytabService: PaytabsService,
    private renderer2: Renderer2,
    private zone: NgZone,
    private loadingController: LoadingController,
    private cartCountService: CartcountService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.client_id = localStorage.getItem("client_id");
    // this.getData();
    // this.getAddress();
    this.s3url = utils.getS3url();
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.getData();
  }

  onChangeAddress($event) {
    this.current_selection = $event.detail.value;
    console.log(this.current_selection, "current selected address");
    this.getDistance(
      this.data.address[this.current_selection].latitude,
      this.data.address[this.current_selection].longitude
    );
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().finally(() => {
      this.getAddress();
    });
    return await modal.present();
  }

  async openPaymentModes() {
    const modal = await this.modalController.create({
      component: ModeofpaymentPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: "paymentOptions",
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((data) => {
      const paymentDetails = data["data"];
      console.log(paymentDetails);
      if (paymentDetails) {
        this.payment_id = paymentDetails.modeOfPayment_Id;
        console.log(this.payment_id);
      }
    });
    return await modal.present();
  }

  continue() {
    this.checkOutofStock();

    if (this.isOut) {
      this.presentToastDanger(
        "Some items in your cart is currently out of stock."
      );
    } else if (!this.valid_address) {
      this.presentToastDanger("Please select a serviceable delivery Location.");
    } else {
      let address_id = this.address_id;
      this.router.navigate(["checkout", address_id]);
      console.log(this.selectedAddress);
    }
  }
  checkOutofStock() {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].in_stock == 0) {
        this.isOut = true;
        console.log(i, "value of index");
        break;
      } else {
        this.isOut = false;
      }
    }
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      duration: 2000,
    });
    toast.present();
  }
  async presentToastDanger(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-danger",
      color: "danger",
      position: "middle",
      duration: 2000,
    });
    toast.present();
  }

  getData() {
    this.presentLoading().then(() => {
      this.cartService.getCart(this.client_id).subscribe(
        (data) => this.handleResponse(data, GET_CART),
        (error) => this.handleError(error)
      );
    });
  }

  getAddress() {
    let client_id = localStorage.getItem("client_id");
    this.addressService.getAddress(client_id).subscribe(
      (data) => this.handleResponse(data, GET_ADDRESS),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data, type) {
    this.loadingController.dismiss();
    if (type == GET_CART) {
      console.log(data);
      this.data = data;
      this.cart = data.cart;
      this.amountDetails = data;
      this.addresses = data.address;

      this.cartLength = this.cart.length;
      console.log(this.cart, "This is cart");
      for (let i = 0; i < this.cart?.length; i++) {
        this.cart[i].images[0].path = this.s3url + this.cart[i].images[0].path;
      }
    } else if (type == GET_PAY) {
      console.log(data);
    } else if (type == REMOVE) {
      localStorage.setItem("cart_count", data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      console.log("removed", data);
    } else {
      console.log(data);
    }
  }
  handleError(error) {
    this.loadingController.dismiss();
    console.log(error);
  }

  add(index: number, id: number) {
    let name = this.cart[index].name;
    let qty = this.cart[index].count + 1;
    let data = {
      product_id: id,
      client_id: localStorage.getItem("client_id"),
    };
    this.cartService.addToCart(data).subscribe(
      (data) => this.handleResponse(data, POST_DATA),
      (error) => this.handleError(error)
    );
    //  this.cart[index].count = this.cart[index].count+1
    this.getData();
    this.presentToastSuccessQtyChange(
      "You've changed " + name + " quantity to " + qty
    );
  }

  subtract(index: number, id: number) {
    let name = this.cart[index].name;
    let qty = this.cart[index].count - 1;
    let client_id = localStorage.getItem("client_id");
    this.cartService.removeFromCart(client_id, id).subscribe(
      (data) => this.handleResponse(data, DEL_DATA),
      (error) => this.handleError(error)
    );
    // this.cart[index].count = this.cart[index].count-1
    this.getData();
    if (qty > 0) {
      this.presentToastSuccessQtyChange(
        "You've changed " + name + " quantity to " + qty
      );
    } else {
      let cartCount = Number(localStorage.getItem("cart_count"));
      let count = cartCount - 1;
      let data = count.toString();
      localStorage.setItem("cart_count", data);
      this.cartCountService.setCartCount(data);
      this.presentToastDanger("You've removed " + name + " from cart.");
    }
  }

  remove(index: number, id: number) {
    let name = this.cart[index].name;
    let client_id = localStorage.getItem("client_id");
    this.cartService.deleteFromCart(client_id, id).subscribe(
      (data) => this.handleResponse(data, REMOVE),
      (error) => this.handleError(error)
    );
    this.cart.splice(index, 1);
    this.getData();
    this.presentToastDanger("You've removed " + name + " from cart.");
  }

  continueShopping() {
    this.router.navigate(["home"]);
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "middle",
      color: "tertiary",
      duration: 2000,
    });
    toast.present();
  }

  async presentToastSuccessQtyChange(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",

      duration: 2000,
    });
    toast.present();
  }

  handle(url: any) {
    this.router.navigate(["paytabs"]);
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }

  getDistance(latitude, longitude) {
    console.log("GEt Distance started", latitude, longitude);
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(latitude, longitude);
    console.log("current coords getdistance", current_coords);
    var lat: string = latitude.toString();
    var long: string = longitude.toString();
    var destination = lat + "," + long;
    // var origin = '10.008,76.329'

    var shop_coords = new Array();

    this.data.delivery_location?.forEach((element) => {
      shop_coords.push(element.location);
    });
    console.log("shop", shop_coords);
    console.log("current_coords", latitude, longitude);
    const matrixOptions = {
      origins: shop_coords, // shop coords
      destinations: [destination], // customer coords
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    console.log("matrix", matrixOptions);
    service.getDistanceMatrix(matrixOptions, (response, status) => {
      console.log("GET DISTANCE MATRIX");
      if (status !== "OK") {
        var msg = "Error with distance matrix";
        this.showToast(msg);
      } else {
        var response_data = new Array();
        var distances = new Array();
        let shortest_distance;
        let shop_index: number;
        response_data = response.rows;
        console.log("responsee data", response_data);
        response_data.forEach((ele) => {
          distances.push(ele.elements[0].distance.value);
        });
        shortest_distance = Math.min.apply(null, distances);
        shop_index = distances.findIndex(
          (element) => element == shortest_distance
        );
        if (
          shortest_distance <
          this.data.delivery_location[shop_index].radius * 1000
        ) {
          var msg =
            "Delivery available from " +
            this.data.delivery_location[shop_index].location;
          this.showToastSuccess(msg);
          // this.locationAvailability = true;
          // this.addressForm.patchValue({delivery_location_id:this.delivery_locations[shop_index].id})
          this.selectedAddress = this.current_selection;
          console.log("selectedAddress", this.selectedAddress);
          this.address_id = this.addresses[this.selectedAddress].id;
          console.log(this.address_id);
          this.valid_address = true;
        } else {
          // this.locationAvailability = false;
          var msg = "Sorry, this location is currently not serviceable";
          // this.addressForm.patchValue({ latitude: null });
          // this.addressForm.patchValue({ longitude: null });
          this.showToast(msg);
          this.valid_address = false;
        }
      }
    });
  }

  async showToast(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "danger",
    });
    toast.present();
  }

  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "success",
    });
    toast.present();
  }

  navigateToProduct(index: number) {
    let id = this.cart[index].id;
    this.router.navigate(["product", id]);
  }
}
