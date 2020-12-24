import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonRouterOutlet, LoadingController, ModalController, Platform, ToastController } from "@ionic/angular";
import { CheckoutService } from "src/app/services/checkout/checkout.service";
import { OrderService } from "src/app/services/order/order.service";
import { CouponPage } from "../coupon/coupon.page";
import { ModeofpaymentPage } from "../modeofpayment/modeofpayment.page";
import { PaytabsService } from "src/app/services/paytabs.service";

import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration,
} from "@ionic-native/paypal/ngx";


const GET_AMOUNTDETAILS = 200;
const ORDER_RESPONSE = 210;
const GET_PAY = 220;


@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  address_id: any;
  client_id: any;
  data: any;
  promo_id: any;
  payment_id: any;
  discount_amount: number = 0;
  constructor(
    private checkoutService: CheckoutService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private platform: Platform,
    private payPal: PayPal,
    private router:Router,
    private paytabService: PaytabsService,
    private toastController:ToastController,
    private loadingController:LoadingController,
    
  ) {
    this.client_id = Number(localStorage.getItem("client_id"));
    this.address_id = this.activatedRoute.snapshot.params.address_id;
    this.getData();
  }

  ngOnInit() {}

  // getData() {
  //   this.checkoutService
  //     .getAmountDetails(this.client_id, this.address_id)
  //     .subscribe(
  //       (data) => this.handleResponse(data, GET_AMOUNTDETAILS),
  //       (error) => this.handleError(error)
  //     );
  // }

  
getData() {
  this.presentLoading().then(()=>{
    this.checkoutService.getAmountDetails(this.client_id,this.address_id).subscribe(
      (data) => this.handleResponse(data, GET_AMOUNTDETAILS),
      (error) => this.handleError(error)
    )
  }
  )
}

  handleResponse(data, type) {
this.loadingController.dismiss()
    if (type == GET_AMOUNTDETAILS) 
    {
      console.log(data);
      this.data = data;
    } 
    else if (type == GET_PAY)
    {
      console.log(data)
    }
    else if (type == ORDER_RESPONSE) 
    {
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
                        this.data.payable_amount,
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
        localStorage.setItem("total_amount", this.data.payable_amount);
        console.log("cordova not supported");
        this.router.navigate(["paypal"]);
      } 
      else if (this.payment_id == 5) 
      {
        let data = {};

        this.paytabService.getPaymentUi(data).subscribe(
          (data) => this.handleResponse(data, GET_PAY),
          (error) => this.handleError(error)
        );
      } 
      
      else if(this.payment_id == 2) {
        // this.presentToastSuccess("Order placed Successfully");

        this.router.navigate(["order-placed"]);
      }

      else if(this.payment_id == 6)
      {
        localStorage.setItem("total_amount", this.data.payable_amount);
        this.router.navigate(["checkout-pay"]);
      }
    } 
    else 
    {
      console.log(data);
    }
  }
  handleError(error) {
    this.loadingController.dismiss()
    console.log(error);
  }

  checkOut() {
    this.openPaymentModes();
  }

  async openPromo() {
    this.data.payable_amount += this.discount_amount;
    this.data.saved_amount -= this.discount_amount;
    const modal = await this.modalController.create({
      component: CouponPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: "my-custom-class",
      componentProps: { totalAmount: this.data.total_amount }
    });
    modal.onDidDismiss().then((data) => {
      const promo_Details = data["data"];
      if (promo_Details) {
        console.log(promo_Details);
        this.data.payable_amount -= promo_Details.discount_amount;
        this.data.saved_amount = promo_Details.discount_amount;
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
        let data = {
          client_id: localStorage.getItem("client_id"),
          promo_code_id: this.promo_id,
          address_id: this.address_id,
          payment_option_id: this.payment_id,
          product_total: this.data.total_amount,
          payable_amount: this.data.payable_amount,
          delivery_charge: this.data.delivery_charge
        };

        this.orderService.captureOrder(data).subscribe(
          (data) => this.handleResponse(data, ORDER_RESPONSE),
          (error) => this.handleError(error)
        );
      }
    });
    return await modal.present();
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


    
async presentLoading() {
  const loading = await this.loadingController.create({
    spinner: 'crescent',
    cssClass:'custom-spinner',
    message: 'Please wait...',
    showBackdrop: true
  });
  await loading.present();
}

}
