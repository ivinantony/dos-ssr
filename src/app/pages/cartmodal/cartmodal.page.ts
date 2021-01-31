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
import { PaytabsService } from "src/app/services/paytabs.service";
import { Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CartcountService } from "src/app/cartcount.service";
import { AddressModalPage } from "../address-modal/address-modal.page";
import { AuthenticationService } from "src/app/services/authentication.service";

declare var google;

const GET_CART = 200;
const ADD = 210;
const DEL_DATA = 220;
const REMOVE = 230;

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
    private authservice: AuthenticationService,

    @Inject(DOCUMENT) private _document: Document
  ) {
    this.s3url = utils.getS3url();
  }

  ionViewWillEnter() {
    this.getData();
    console.log(this.selectedAddress);
  }

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
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
      this.modalController.dismiss();
      this.router.navigate(["checkout", address_id]);
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
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.cartService.getCart(val).subscribe(
            (data) => this.handleResponse(data, GET_CART),
            (error) => this.handleError(error)
          );
        } else {
          this.cartService.getCart(null).subscribe(
            (data) => this.handleResponse(data, GET_CART),
            (error) => this.handleError(error)
          );
        }
      });
    });
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
      this.cartCountService.setCartCount(data.cart_count);
    } else if (type == DEL_DATA) {
      this.loadingController.dismiss();
      this.presentToastSuccessQtyChange(
        "You've changed " + this.name + " quantity to " + this.qty
      );
      this.getData();
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

    this.authservice.isAuthenticated().then((val) => {
      if (val) {
        let data = {
          product_id: id,
          client_id: val,
        };
        this.cartService.addToCart(data).subscribe(
          (data) => this.handleResponse(data, ADD),
          (error) => this.handleError(error)
        );
      } else {
        let data = {
          product_id: id,
          client_id: null,
        };
        this.cartService.addToCart(data).subscribe(
          (data) => this.handleResponse(data, ADD),
          (error) => this.handleError(error)
        );
      }
    });
  }

  subtract(index: number, id: number) {
    this.name = this.cart[index].name;
    this.qty = this.cart[index].count;
    if (this.qty == 1) {
      this.remove(index, id);
    } else {
      this.qty = this.cart[index].count - 1;
      this.presentLoading().then(() => {
        this.authservice.isAuthenticated().then((val) => {
          if (val) {
            this.cartService.removeFromCart(val, id).subscribe(
              (data) => this.handleResponse(data, DEL_DATA),
              (error) => this.handleError(error)
            );
          } else {
            this.cartService.removeFromCart(null, id).subscribe(
              (data) => this.handleResponse(data, DEL_DATA),
              (error) => this.handleError(error)
            );
          }
        });
      });
    }
  }

  continueShopping() {
    this.router.navigate(["/tabs/home"]);
  }

  navigateToProduct(index: number) {
    let id = this.cart[index].id;
    this.router.navigate(["product", id]);
  }

  handle(url: any) {
    this.router.navigate(["paytabs"]);
  }

  getDistance(latitude, longitude) {
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(latitude, longitude);

    var lat: string = latitude.toString();
    var long: string = longitude.toString();
    var destination = lat + "," + long;

    var shop_coords = new Array();

    this.data.delivery_location?.forEach((element) => {
      shop_coords.push(element.location);
    });

    const matrixOptions = {
      origins: shop_coords, // shop coords
      destinations: [destination], // customer coords
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };

    service.getDistanceMatrix(matrixOptions, (response, status) => {
      if (status !== "OK") {
        var msg = "Error with distance matrix";
        this.showToast(msg);
      } else {
        var response_data = new Array();
        var distances = new Array();
        let shortest_distance;
        let shop_index: number;
        response_data = response.rows;

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
          this.selectedAddress = this.current_selection;

          this.address_id = this.address_selected.id;

          this.valid_address = true;
        } else {
          var msg = "Sorry, this location is currently not serviceable";
          this.showToast(msg);
          this.valid_address = false;
        }
      }
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
        },
        {
          text: "Confirm",
          cssClass: "secondary",
          handler: () => {
            this.presentLoading().then(() => {
              this.authservice.isAuthenticated().then((val) => {
                if (val) {
                  this.cartService.deleteFromCart(val, id).subscribe(
                    (data) => this.handleResponse(data, REMOVE),
                    (error) => this.handleError(error)
                  );
                } else {
                  this.cartService.deleteFromCart(null, id).subscribe(
                    (data) => this.handleResponse(data, REMOVE),
                    (error) => this.handleError(error)
                  );
                }
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  close() {
    this.modalController.dismiss();
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

  changeAddress()
  {
    this.presentAddressModal()
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

  async presentToastSuccessQtyChange(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Required quantity unavailable",

      message:
      "This item is not available in the volume required by you.<br/><br/>" 
       +msg+
        "<br/> <br/> Please contact via Email or WhatsApp to order in more volume.",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
