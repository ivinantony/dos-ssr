import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  IonRouterOutlet,
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
    @Inject(DOCUMENT) private _document: Document
  ) {
    this.getData();
    this.getAddress();
    this.s3url = utils.getS3url();
  }

  ngOnInit() {}

  onChangeAddress($event) {
    this.selectedAddress = $event.detail.value;
    console.log("selectedAddress", this.selectedAddress);
    this.address_id = this.addresses[this.selectedAddress].id;
    console.log(this.address_id);
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

  async openPromo() {
    this.amountDetails.payable_amount += this.discount_amount;
    this.amountDetails.saved_amount -= this.discount_amount;
    const modal = await this.modalController.create({
      component: CouponPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      const promo_Details = data["data"];
      if (promo_Details) {
        console.log(promo_Details);
        this.amountDetails.payable_amount -= promo_Details.discount_amount;
        this.amountDetails.saved_amount = promo_Details.discount_amount;
        this.discount_amount = promo_Details.discount_amount;
        this.promo_id = promo_Details.promo_Id;
      }
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

  pay() {
    let data = {
      merchant_email: "gautham.krishna@mermerapps.com",
      secret_key:
        "	nY2ClkDOnRgUi7XmVHRvMp3v9NdK6knuiq7DKKs8CI3VP0hLI8hvyk0H8esezQJRgQu1AX9dFc8vdqhWyyr7TsP1Hhgg7Z7oPCpq",
      site_url: "http://localhost:8100",
      return_url: "http://localhost:8100",
      title: "ABC>CO",
      cc_first_name: "Gautham",
      cc_last_name: "G",
      cc_phone_number: "9946166081",
      phone_number: "9946166081",
      email: "gautham.krishna@mermerapps.com",
      products_per_title: "MobilePhone || Charger || Camera",
      unit_price: "12.123 || 21.345 || 35.678 ",
      quantity: "2 || 3 || 1",
      other_charges: "12.123",
      amount: "136.082",
      discount: "10.123",
      currency: "INR",
      reference_no: "ABC-123",
      ip_customer: "1.1.1.0",
      ip_merchant: "1.1.1.0",
      billing_address: "Flat 3021 Manama Bahrain",
      city: "Kottayam",
      state: "Kerala",
      postal_code: "686541",
      country: "INDIA",
      shipping_first_name: "John",
      shipping_last_name: "Doe",
      address_shipping: "Flat 3021 Manama Bahrain",
      state_shipping: "Kerala",
      city_shipping: "Kottyam",
      postal_code_shipping: "686541",
      country_shipping: "India",
      msg_lang: "English",
      cms_with_version: "Nodejs Lib v1",
    };
    this.paytabService.getPaymentUi(data).subscribe(
      (data) => this.handleResponse(data, GET_PAY),
      (error) => this.handleError(error)
    );

    // if(!this.selectedAddress)
    // {
    //   this.presentToastDanger("Please select a Delivery Location.")
    // }
    // else if(!this.payment_id){
    //   this.presentToastDanger("Please select a Payment Method.")
    // }
    // else{
    //   console.log(this.selectedAddress)
    // let data={
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
    // }
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
    let client_id = localStorage.getItem("client_id");
    this.cartService.getCart(client_id).subscribe(
      (data) => this.handleResponse(data, GET_CART),
      (error) => this.handleError(error)
    );
  }

  getAddress() {
    let client_id = localStorage.getItem("client_id");
    this.addressService.getAddress(client_id).subscribe(
      (data) => this.handleResponse(data, GET_ADDRESS),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data, type) {
    if (type == GET_CART) {
      console.log(data);
      this.cart = data.cart;
      this.amountDetails = data;
      this.amountDetails.payable_amount =
        this.amountDetails.payable_amount + this.amountDetails.delivery_charge;
      this.cartLength = this.cart.length;
      console.log(this.cart, "This is cart");
      for (let i = 0; i < this.cart?.length; i++) {
        this.cart[i].images[0].path = this.s3url + this.cart[i].images[0].path;
      }
    } else if (type == GET_ADDRESS) {
      this.addresses = data.addresses;
      console.log(this.addresses, "addresses");
    } else if (type == ORDER_RESPONSE) {
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
      } else {
        this.presentToastSuccess("Order placed Successfully");

        this.router.navigate(["home"]);
      }
    } else {
      console.log(data);
    }
  }
  handleError(error) {
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
}
