import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";
import { ModeofpaymentPage } from "../modeofpayment/modeofpayment.page";
import { Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { CartcountService } from "src/app/cartcount.service";
import { AddressModalPage } from "../address-modal/address-modal.page";
import { IonSlides} from '@ionic/angular';

declare var google;
const GET_CART = 200;
const ADD = 210;
const DEL_DATA = 220;
const REMOVE = 230;


@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  @ViewChild('mySlider')  slides: IonSlides;
  swipeNext(){
    this.slides.slideNext();
  }
  swipePrev(){
    this.slides.slidePrev();
  }
  address_selected:any;
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
  name:any
  qty:any
  constructor(
    public modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private toastController: ToastController,
    private cartService: CartService,
    private utils: UtilsService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController:AlertController,
    private cartCountService: CartcountService,
    @Inject(DOCUMENT) private _document: Document
  ) {

    this.client_id = localStorage.getItem("client_id");
    this.s3url = this.utils.getS3url();
    
    
  }
  ionViewWillEnter() {
    this.getData();
    console.log(this.selectedAddress)
  }
  ngOnInit() {}


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
      // console.log(paymentDetails);
      if (paymentDetails) {
        this.payment_id = paymentDetails.modeOfPayment_Id;
        // console.log(this.payment_id);
      }
    });
    return await modal.present();
  }

  continue() {
    this.checkOutofStock();

    if (this.isOut) {
      this.presentToast(
        "Some items in your cart is currently out of stock."
      );
    } else if (!this.valid_address) {
      this.presentToast("Please select a serviceable delivery Location.");
    } else {
      let address_id = this.address_id;
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
    } 
    else if(type == ADD)
    {
    this.loadingController.dismiss()
    this.presentToastSuccessQtyChange("You've changed " + this.name + " quantity to " + this.qty);
    this.getData();
    }
     else if (type == REMOVE) {   
      this.loadingController.dismiss()   
      this.presentToast("You've removed " + this.name + " from cart.");
      this.getData();
      localStorage.setItem("cart_count", data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      
    } 
    else if (type == DEL_DATA) {
      this.loadingController.dismiss()
      this.presentToastSuccessQtyChange( "You've changed " + this.name + " quantity to " + this.qty);
      this.getData();
    
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
  }

  add(index: number, id: number) {
    this.presentLoading()
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
    if(this.qty==1)
    {
      this.remove(index,id)
    }
    else{
      this.qty = this.cart[index].count - 1;
      this.presentLoading()
      this.cartService.removeFromCart(this.client_id, id).subscribe(
        (data) => this.handleResponse(data, DEL_DATA),
        (error) => this.handleError(error)
      );
    }
    
  }


  continueShopping() {
    this.router.navigate(["/tabs/home"]);
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
        this.presentToast(msg);
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
          this.presentToast(msg);
          this.selectedAddress = this.current_selection;
          this.address_id = this.address_selected.id;
          this.valid_address = true;
        } else {
          var msg = "Sorry, this location is currently not serviceable";
          this.presentToast(msg);
          this.valid_address = false;
        }
      }
    });
  }

 

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      duration: 2000,
      color: "dark",
    });
    toast.present();
  }

 

  async presentAddressModal() {
    const modal = await this.modalController.create({
      component: AddressModalPage,
      cssClass:'cartmodal',
      componentProps: { value: 123 },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();

    await modal.onDidDismiss().then((data) => {
      //  this.getData()
      console.log("data",data)
      this.address_selected = data.data
      this.current_selection = data.role
      console.log(this.address_selected)
      this.getDistance(
        this.address_selected.latitude,
        this.address_selected.longitude
      );
    }); 
    
  }


  async remove(index:number,id:number) {
   this.name = this.cart[index].name;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: 'Do you want to remove '+this.name+' from cart',
      buttons: [
        {
          text: 'cancel',
          role:'cancel',
          handler: () => {
            // console.log('Confirm Okey');
            // let balance = this.data.payable_amount - this.data.wallet_balance
            // this.router.navigate(['recharge',{balance}])
          }
        },
        {
          text: 'Confirm',
          cssClass: 'secondary',
          handler: () => {
            this.presentLoading()
            this.cartService.deleteFromCart(this.client_id, id).subscribe(
              (data) => this.handleResponse(data, REMOVE),
              (error) => this.handleError(error)
            );
          }
        }
      ]
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


}



