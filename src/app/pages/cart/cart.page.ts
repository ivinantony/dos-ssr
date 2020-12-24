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
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { Console } from 'console';
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
  url:any;
  client_id:any
  delivery_locations:Array<any>
  current_selection:any
  data:any
  valid_address:boolean=false
  isOut:boolean=false
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
    private zone:NgZone,
    private loadingController:LoadingController,
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.client_id=localStorage.getItem("client_id")
    // this.getData();
    // this.getAddress();
    this.s3url = utils.getS3url();
    
  }

  ngOnInit() {}
  ionViewWillEnter()
  {
    this.getData()
  }

  onChangeAddress($event) {
    this.current_selection= $event.detail.value;
    console.log(this.current_selection,"current selected address")
    this.getDistance(this.data.address[this.current_selection].latitude,this.data.address[this.current_selection].longitude)
    // this.selectedAddress = $event.detail.value;
    // console.log("selectedAddress", this.selectedAddress);
    // this.address_id = this.addresses[this.selectedAddress].id;
    // console.log(this.address_id);
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

  // async openPromo() {
  //   this.amountDetails.payable_amount += this.discount_amount;
  //   this.amountDetails.saved_amount -= this.discount_amount;
  //   const modal = await this.modalController.create({
  //     component: CouponPage,
  //     swipeToClose: true,
  //     presentingElement: this.routerOutlet.nativeEl,
  //     cssClass: "my-custom-class",
  //   });
  //   modal.onDidDismiss().then((data) => {
  //     const promo_Details = data["data"];
  //     if (promo_Details) {
  //       console.log(promo_Details);
  //       this.amountDetails.payable_amount -= promo_Details.discount_amount;
  //       this.amountDetails.saved_amount = promo_Details.discount_amount;
  //       this.discount_amount = promo_Details.discount_amount;
  //       this.promo_id = promo_Details.promo_Id;
  //     }
  //   });
  //   return await modal.present();
  // }

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
    this.checkOutofStock()

    if(this.isOut)
    {
      this.presentToastDanger("Some items in your cart is currently out of stock.")
    }
    
    else if(!this.valid_address)
    {
      this.presentToastDanger("Please select aservicable delivery Location.")
    }
   
    // else if(!this.payment_id){
    //   this.presentToastDanger("Please select a Payment Method.")
    // }
    else{
      let address_id = this.address_id
      this.router.navigate(['checkout',{address_id}])
      console.log(this.selectedAddress)
    //   let data={
    //   client_id:localStorage.getItem("client_id"),
    //   promo_code_id:this.promo_id,
    //   address_id:this.address_id,
      
    //   payment_option_id:this.payment_id,
    //   product_total:this.amountDetails.total_amount,
    //   payable_amount:this.amountDetails.payable_amount
    // }
   
    // this.orderService.captureOrder(data).subscribe(
    //   (data)=> this.handleResponse(data,ORDER_RESPONSE),
    //   (error)=>this.handleError(error)
    // )
    }
  }
  checkOutofStock()
  {
    for(let i=0;i<this.cart.length;i++)
    {
      if(this.cart[i].in_stock == 0)
      {
        this.isOut = true
        console.log(i,"value of index")
        break
      }
      else{
        this.isOut = false
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
      cssClass: "custom-toast",
      color: "danger",
      position: "middle",
      duration: 2000,
    });
    toast.present();
  }

  getData() {
    this.presentLoading().then(()=>{
      this.cartService.getCart(this.client_id).subscribe(
        (data) => this.handleResponse(data,GET_CART),
        (error) => this.handleError(error)
      )
    }
    )

  }



  getAddress() {
    let client_id = localStorage.getItem("client_id");
    this.addressService.getAddress(client_id).subscribe(
      (data) => this.handleResponse(data, GET_ADDRESS),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data, type) {
    this.loadingController.dismiss()
    if (type == GET_CART) {
      console.log(data);
      this.data = data
      this.cart = data.cart;
      this.amountDetails = data;
      this.addresses = data.address;
      // this.amountDetails.payable_amount =
        // this.amountDetails.payable_amount + this.amountDetails.delivery_charge;
      this.cartLength = this.cart.length;
      console.log(this.cart, "This is cart");
      for (let i = 0; i < this.cart?.length; i++) {
        this.cart[i].images[0].path = this.s3url + this.cart[i].images[0].path;
      }
    } 
    else if (type == GET_PAY)
    {
      console.log(data)
    }
    // else if (type == GET_ADDRESS) {
    //   this.addresses = data.addresses;
    //   console.log(this.addresses, "addresses");
    // } 
    else if (type == ORDER_RESPONSE) {
      console.log(data, "pay response");
      localStorage.setItem("order_id", data.payable_order_id);
      if (this.payment_id == 4) {
        if (this.platform.is("cordova")) {
          console.log("cordova detected");
          this.payPal
            .init({
              PayPalEnvironmentProduction: "YOUR_PRODUCTION_CLIENT_ID",
              PayPalEnvironmentSandbox:
                "AdQ56AEl3TVRxp-oPoMtdptdh-KIbMNCj5TBfv5gJxhQ7JVJJJTWb5T8digw3jpjyLhsJ_WpkXRGZs1G",
            })
            .then(
              () => {
                // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
                this.payPal
                  .prepareToRender(
                    "PayPalEnvironmentSandbox",
                    new PayPalConfiguration({
                      // Only needed if you get an "Internal Service Error" after PayPal login!
                      //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
                    })
                  )
                  .then(
                    () => {
                      console.log("heyyyyy");
                      let payment = new PayPalPayment(
                        this.amountDetails.payable_amount,
                        "AED",
                        "Description",
                        "sale"
                      );
                      this.payPal.renderSinglePaymentUI(payment).then(
                        (paymentDetails) => {
                          console.log(paymentDetails);
                          // Successfully paid

                          // Example sandbox response
                          //
                          // {
                          //   "client": {
                          //     "environment": "sandbox",
                          //     "product_name": "PayPal iOS SDK",
                          //     "paypal_sdk_version": "2.16.0",
                          //     "platform": "iOS"
                          //   },
                          //   "response_type": "payment",
                          //   "response": {
                          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
                          //     "state": "approved",
                          //     "create_time": "2016-10-03T13:33:33Z",
                          //     "intent": "sale"
                          //   }
                          // }
                        },
                        (error) => {
                          console.log(error, "hai");

                          // Error or render dialog closed without being successful
                        }
                      );
                    },
                    (error) => {
                      console.log(error, "hello");
                      // Error in configuration
                    }
                  );
              },
              (error) => {
                console.log(error, "how");
                // Error in initialization, maybe PayPal isn't supported or something else
              }
            );
        }
        localStorage.setItem("total_amount", this.amountDetails.payable_amount);
        console.log("cordova not supported");
        this.router.navigate(["paypal"]);
      } 
      else if(this.payment_id == 5)
      {
        let data=
          {
            
          }
        
        this.paytabService.getPaymentUi(data).subscribe(
          (data)=>this.handleResponse(data,GET_PAY),
          (error)=>this.handleError(error)

        )
      }
      else {
        this.presentToastSuccess("Order placed Successfully");

        this.router.navigate(["home"]);
      }
    } else {
      console.log(data);
    }
  }
  handleError(error) {
    this.loadingController.dismiss()
    console.log(error);
  }

  add(index: number, id: number) {
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
  }

  subtract(index: number, id: number) {
    let client_id = localStorage.getItem("client_id");
    this.cartService.removeFromCart(client_id, id).subscribe(
      (data) => this.handleResponse(data, DEL_DATA),
      (error) => this.handleError(error)
    );
    // this.cart[index].count = this.cart[index].count-1
    this.getData();
  }

  onQuantityChange() {
    // let data={
    //   product_id :this.productDetails.id,
    //   client_id :localStorage.getItem('client_id')
    //    }
    //    this.cartService.addToCart(data).subscribe(
    //      (data)=>this.handleResponse(data,POST_DATA),
    //      (error)=>this.handleError(error)
    //    )
  }

  remove(index: number, id: number) {
    let client_id = localStorage.getItem("client_id");
    this.cartService.deleteFromCart(client_id, id).subscribe(
      (data) => this.handleResponse(data, REMOVE),
      (error) => this.handleError(error)
    );
    this.cart.splice(index, 1);
    this.getData();
  }

  continueShopping() {
    this.router.navigate(["home"]);
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "middle",
      color: "success",
      duration: 2000,
    });
    toast.present();
  }

  handle(url:any)
  {
    this.router.navigate(['paytabs'])
  }
  

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }





  getDistance(latitude,longitude) {
    console.log("GEt Distance started",latitude,longitude)
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(latitude,longitude);
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
    console.log("current_coords", latitude,longitude);
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
          this.valid_address=true
        } else {
          // this.locationAvailability = false;
          var msg = "Sorry, this location is currently not serviceable";
          // this.addressForm.patchValue({ latitude: null });
          // this.addressForm.patchValue({ longitude: null });
          this.showToast(msg);
          this.valid_address=false

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
}



// paytabs.createPayPage({
//   'merchant_email':'dealonstoreuae@gmail.com',
//   'secret_key':'Wlo2xFHTvSKmALAZpfiFtS74loAAaje7ED9cjQ5OJPakAKkZ0CFuvNzQc9qmsFu7iDjBuppeezyPkSPkvuO0ioRuxiR0Xl8fZrQt',
//   'currency':'AED',//change this to the required currency
//   'amount':'10',//change this to the required amount
//   'site_url':'https://arba.mermerapps.com',//change this to reflect your site
//   'title':'Order for Shoes',//Change this to reflect your order title
//   'quantity':1,//Quantity of the product
//   'unit_price':10, //Quantity * price must be equal to amount
//   'products_per_title':'Shoes | Jeans', //Change this to your products
//   'return_url':'https://arba.mermerapps.com/home',//This should be your callback url
//   'cc_first_name':'Samy',//Customer First Name
//   'cc_last_name':'Saad',//Customer Last Name
//   'cc_phone_number':'00973', //Country code
//   'phone_number':'12332323', //Customer Phone
//   'billing_address':'Address', //Billing Address
//   'city':'Manama',//Billing City
//   'state':'Manama',//Billing State
//   'postal_code':'1234',//Postal Code
//   'country':'ARE',//Iso 3 country code
//   'email':'gautham@gmail.com',//Customer Email
//   'ip_customer':'<CUSTOMER IP>',//Pass customer IP here
//   'ip_merchant':'<MERCHANT IP>',//Change this to your server IP
//   'address_shipping':'Shipping',//Shipping Address
//   'city_shipping':'Manama',//Shipping City
//   'state_shipping':'Manama',//Shipping State
//   'postal_code_shipping':'973',
//   'country_shipping':'ARE',
//   'other_charges':0,//Other chargs can be here
//   'reference_no':1234,//Pass the order id on your system for your reference
//   'msg_lang':'en',//The language for the response
//   'cms_with_version':'Nodejs Lib v1',//Feel free to change this
// },createPayPage);

// function createPayPage(result)
// {
  

//   if(result.response_code == 4012)
//   {
//       //Redirect your merchant to the payment link
//       console.log(result.payment_url)
//       window.open(result.payment_url);
      

//       // this.handle(this.result)
//   }
//   else{
//       //Handle the error
//       console.log(result);
      
//   }
// }
