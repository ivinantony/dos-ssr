import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";
import { CartcountService } from "src/app/services/cartcount.service";
import { AddressModalPage } from "../address-modal/address-modal.page";
import { IonSlides } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import {QuantityUnavailablePage  } from "../quantity-unavailable/quantity-unavailable.page";

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
  @ViewChild("mySlider") slides: IonSlides;
  swipeNext() {
    this.slides.slideNext();
  }
  swipePrev() {
    this.slides.slidePrev();
  }
  address_selected: any;
  address_index: any;
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
  delivery_location_id:any
  delivery_locations: Array<any>;
  current_selection: any;
  data: any;
  valid_address: boolean = false;
  isOut: boolean = false;
  name: any;
  qty: any;
  current_url: boolean = false;
  constructor(
    public modalController: ModalController,
    private toastController: ToastController,
    private cartService: CartService,
    private utils: UtilsService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private cartCountService: CartcountService,
    private authService: AuthenticationService
  ) {
    this.s3url = this.utils.getS3url();
  }

  ionViewWillEnter() {
    let current_url = window.location.href.includes("/tabs");
    if (current_url) {
      this.current_url = true;
    } else {
      this.current_url = false;
    }
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((val) => {
        if (val) {
          this.cartService.getCart(val).subscribe(
            (data) => this.handleResponse(data, GET_CART),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  add(index: number, id: number) {
    this.presentLoading();
    this.name = this.cart[index].name;
    this.qty = this.cart[index].count + 1;
    this.authService.isAuthenticated().then((val) => {
      if (val) {
        let data = {
          product_id: id,
          client_id: val,
        };

        this.cartService.addProductToCart(data).subscribe(
          (data) => this.handleResponse(data, ADD),
          (error) => this.handleError(error)
        );
      } else {
        let data = {
          product_id: id,
          client_id: null,
        };

        this.cartService.addProductToCart(data).subscribe(
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
      this.presentLoading();
      this.authService.isAuthenticated().then((val) => {
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
    }
  }

  continue() {
    this.checkOutofStock();

    if (this.isOut) {
      this.presentToast("Some items in your cart is currently out of stock.");
    } 

    else if(!this.address_id){
      this.presentToast("Please select a delivery address.");

    }
    
    else {
    
      this.router.navigate(["/checkout", this.address_id,this.delivery_location_id]);
    }
  }

  continueShopping() {
    this.router.navigate(["/tabs/offers"]);
  }

  checkOutofStock() {
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].in_stock == 0 || this.cart[i].stock_quantity <= 0) {
        this.isOut = true;

        break;
      } else {
        this.isOut = false;
      }
    }
  }

  navigateToProduct(index: number) {
    let id = this.cart[index].id;
    this.router.navigate(["product", id]);
  }

  handle(url: any) {
    this.router.navigate(["paytabs"]);
  }

  handleResponse(data, type) {
    if (type == GET_CART) {
      this.loadingController.dismiss();
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
      this.presentToast(
        "You've changed " + this.name + " quantity to " + this.qty
      );
      this.getData();
    } else if (type == REMOVE) {
      this.loadingController.dismiss();
      this.presentToast("You've removed " + this.name + " from cart.");
      this.authService.setCartCount(data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.getData();
    } else if (type == DEL_DATA) {
      this.loadingController.dismiss();
      this.presentToast(
        "You've changed " + this.name + " quantity to " + this.qty
      );
      this.getData();
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
    if (error.status == 400) {
      // this.presentAlert(error.error.message);
      this.presentMessage()
    }
    else{
      this.presentToast(error.error.message)
    }
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async remove(index: number, id: number) {
    this.name = this.cart[index].name;
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Delete",
      message: "Do you want to remove " + this.name + " from cart",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Confirm",
          cssClass: "secondary",
          handler: () => {
            this.presentLoading().then(() => {
              this.authService.isAuthenticated().then((val) => {
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

  async changeAddress() {
    const modal = await this.modalController.create({
      component: AddressModalPage,
      cssClass: "cartmodal",
      swipeToClose: true,
    });

    await modal.present();

    await modal.onDidDismiss().then((data) => {
      if (data.data) {
    
        
        // this.address_index = data.data
        this.address_selected = data.data
     
        this.address_id =  this.address_selected.id
        this.delivery_location_id = this.address_selected.delivery_location_id


        // this.current_selection = data.role;
        // this.getDistance(
        //   this.address_selected.latitude,
        //   this.address_selected.longitude
        // );
      }
    });
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "alert-class",
      header: "Required Quantity Unavailable",

      message:'Sorry we are unable to process with your required quantity, please contact via <img src = "../../../assets/imgs/icons/whatsapp.svg">  or  <img src = "../../../assets/imgs/icons/gmail.svg">.',
      buttons: [
      {
        text: "Whatsapp",
      
        handler: () => {
          window.open(
            "https://api.whatsapp.com/send?phone=447417344825&amp;"  
          );
        }
      },
      {
        text: "E-Mail",
  
        handler: () => {
          window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=info@dealonstore.com"
          ); 
          
        },
      },
      {
        text: "Cancel",
        role:"cancel"
      },
    ],
    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      duration: 1500,
      color: "dark",
    });
    toast.present();
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


  async presentMessage() {
    const modal = await this.modalController.create({
      component: QuantityUnavailablePage,
      cssClass: "custom_alert",
      swipeToClose: true,
      mode:"ios"
    });

    await modal.present();
  }


}
