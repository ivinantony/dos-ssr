import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
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
import { PaytabsService } from "src/app/services/paytabs.service";
import { Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CartcountService } from "src/app/cartcount.service";
import { AddressModalPage } from "../address-modal/address-modal.page";

declare var google;

const POST_DATA = 210;
const POST_ADDRESS_DETAILS = 250;
const ORDER_RESPONSE = 260;
const GET_PAY = 270;
const paytabs = require("paytabs_api");
const GET_CART = 200;
const ADD = 210;
const DEL_DATA = 220;
const REMOVE = 230;
const GET_ADDRESS = 240;

@Component({
  selector: "app-cartmodal",
  templateUrl: "./cartmodal.page.html",
  styleUrls: ["./cartmodal.page.scss"],
})
export class CartmodalPage implements OnInit {
  address_selected: any;
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
  name: any;
  qty: any;
  constructor(
    public modalController: ModalController,
    private toastController: ToastController,
    private platform: Platform,
    private cartService: CartService,
    private utils: UtilsService,
    private addressService: AddressService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router,
    private paytabService: PaytabsService,
    private renderer2: Renderer2,
    private zone: NgZone,
    private cartCountService: CartcountService,
    private loadingController: LoadingController,
    private alertController: AlertController,

    @Inject(DOCUMENT) private _document: Document
  ) {
    this.client_id = localStorage.getItem("client_id");
    this.s3url = utils.getS3url();
  }

  ionViewWillEnter() {
    this.getData();
    console.log(this.selectedAddress);
  }
  ngOnInit() {}

  // async addAddress() {
  //   const modal = await this.modalController.create({
  //     component: AddAddressPage,
  //     swipeToClose: true,
  //     presentingElement: this.routerOutlet.nativeEl,
  //     cssClass: "my-custom-class",
  //   });
  //   modal.onDidDismiss().finally(() => {
  //     this.getAddress();
  //   });
  //   return await modal.present();
  // }

  // async openPaymentModes() {
  //   const modal = await this.modalController.create({
  //     component: ModeofpaymentPage,
  //     swipeToClose: true,
  //     presentingElement: this.routerOutlet.nativeEl,
  //     cssClass: "paymentOptions",
  //     backdropDismiss: true,
  //   });
  //   modal.onDidDismiss().then((data) => {
  //     const paymentDetails = data["data"];
  //     // console.log(paymentDetails);
  //     if (paymentDetails) {
  //       this.payment_id = paymentDetails.modeOfPayment_Id;
  //       // console.log(this.payment_id);
  //     }
  //   });
  //   return await modal.present();
  // }

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
      this.modalController.dismiss();
      this.router.navigate(["checkout", address_id]);
      // console.log(this.selectedAddress);
    }
  }

  checkOutofStock() {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].in_stock == 0 || this.cart[i].stock_quantity <= 0) {
        this.isOut = true;
        // console.log(i, "value of index");
        break;
      } else {
        this.isOut = false;
      }
    }
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
    this.addressService.getAddress(this.client_id).subscribe(
      (data) => this.handleResponse(data, GET_ADDRESS),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data, type) {
    if (type == GET_CART) {
      this.loadingController.dismiss();
      console.log(data);
      this.data = data;
      this.cart = data.cart;
      this.amountDetails = data;
      this.addresses = data.address;
      this.cartLength = this.cart.length;
      for (let i = 0; i < this.cart?.length; i++) {
        this.cart[i].images[0].path = this.s3url + this.cart[i].images[0].path;
      }
    } else if (type == ADD) {
      this.loadingController.dismiss();
      this.presentToastSuccessQtyChange(
        "You've changed " + this.name + " quantity to " + this.qty
      );
      this.getData();
    } else if (type == REMOVE) {
      this.loadingController.dismiss();
      this.presentToastDanger("You've removed " + this.name + " from cart.");
      this.getData();
      localStorage.setItem("cart_count", data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
    } else if (type == DEL_DATA) {
      this.loadingController.dismiss();
      this.presentToastSuccessQtyChange(
        "You've changed " + this.name + " quantity to " + this.qty
      );
      this.getData();
      // if (this.qty > 0) {

      // }
      // else {
      //   let cartCount = Number(localStorage.getItem("cart_count"));
      //   let count = cartCount - 1;
      //   let data = count.toString();
      //   localStorage.setItem("cart_count", data);
      //   this.cartCountService.setCartCount(data);
      //   this.presentToastDanger("You've removed " + this.name + " from cart.");
      // }
    } else {
      // console.log(data);
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
    // console.log(error);
    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
  }

  add(index: number, id: number) {
    this.presentLoading();
    this.name = this.cart[index].name;
    this.qty = this.cart[index].count + 1;
    let data = {
      product_id: id,
      client_id: this.client_id,
    };
    this.cartService.addToCart(data).subscribe(
      (data) => this.handleResponse(data, ADD),
      (error) => this.handleError(error)
    );
  }

  subtract(index: number, id: number) {
    this.name = this.cart[index].name;
    this.qty = this.cart[index].count;
    if (this.qty == 1) {
      this.remove(index, id);
    } else {
      this.qty = this.cart[index].count - 1;
      this.presentLoading();
      this.cartService.removeFromCart(this.client_id, id).subscribe(
        (data) => this.handleResponse(data, DEL_DATA),
        (error) => this.handleError(error)
      );
    }
  }

  continueShopping() {
    this.router.navigate(["home"]);
  }

  navigateToProduct(index: number) {
    let id = this.cart[index].id;
    this.router.navigate(["product", id]);
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }

  async presentToastSuccessQtyChange(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      color:"dark",
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
    // console.log("GEt Distance started", latitude, longitude);
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(latitude, longitude);
    // console.log("current coords getdistance", current_coords);
    var lat: string = latitude.toString();
    var long: string = longitude.toString();
    var destination = lat + "," + long;
    // var origin = '10.008,76.329'

    var shop_coords = new Array();

    this.data.delivery_location?.forEach((element) => {
      shop_coords.push(element.location);
    });
    // console.log("shop", shop_coords);
    // console.log("current_coords", latitude, longitude);
    const matrixOptions = {
      origins: shop_coords, // shop coords
      destinations: [destination], // customer coords
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    // console.log("matrix", matrixOptions);
    service.getDistanceMatrix(matrixOptions, (response, status) => {
      // console.log("GET DISTANCE MATRIX");
      if (status !== "OK") {
        var msg = "Error with distance matrix";
        this.showToast(msg);
      } else {
        var response_data = new Array();
        var distances = new Array();
        let shortest_distance;
        let shop_index: number;
        response_data = response.rows;
        // console.log("responsee data", response_data);
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
          // console.log("selectedAddress", this.selectedAddress);
          this.address_id = this.address_selected.id;
          // console.log(this.address_id);
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
      color: "dark",
    });
    toast.present();
  }

  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "dark",
    });
    toast.present();
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
      color: "dark",
      position: "top",
      duration: 2000,
    });
    toast.present();
  }

  async presentAddressModal() {
    const modal = await this.modalController.create({
      component: AddressModalPage,
      cssClass: "cartmodal",
      componentProps: { value: 123 },
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    await modal.present();

    await modal.onDidDismiss().then((data) => {
      //  this.getData()
      console.log("data", data);
      this.address_selected = data.data;
      this.current_selection = data.role;
      console.log(this.address_selected);
      this.getDistance(
        this.address_selected.latitude,
        this.address_selected.longitude
      );
    });
  }

  async remove(index: number, id: number) {
    this.name = this.cart[index].name;
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Delete",
      message: "Do you want to remove " + this.name + " from cart",
      buttons: [
        {
          text: "cancel",
          role: "cancel",
          handler: () => {
            // console.log('Confirm Okey');
            // let balance = this.data.payable_amount - this.data.wallet_balance
            // this.router.navigate(['recharge',{balance}])
          },
        },
        {
          text: "Confirm",
          cssClass: "secondary",
          handler: () => {
            this.presentLoading();
            this.cartService.deleteFromCart(this.client_id, id).subscribe(
              (data) => this.handleResponse(data, REMOVE),
              (error) => this.handleError(error)
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Low Stock Alert",

      message:
        msg +
        " For ordering large quantities contact us through email or whatsapp.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  close() {
    this.modalController.dismiss();
  }
}
