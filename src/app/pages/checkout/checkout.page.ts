import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, IonRouterOutlet, LoadingController, ModalController, Platform, ToastController } from "@ionic/angular";
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
import { WalletService } from "src/app/services/wallet/wallet.service";


const GET_AMOUNTDETAILS = 200;
const ORDER_RESPONSE = 210;
const GET_PAY = 220;
const WALLET_RESPONSE = 230;


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
    private walletService:WalletService,
    private alertController:AlertController
    
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
      (error) => this.handleError(error,GET_AMOUNTDETAILS)
    )
  }
  )
}

  handleResponse(data, type) {
this.loadingController.dismiss()
    if (type == GET_AMOUNTDETAILS) 
    {
      // console.log(data);
      this.data = data;
    } 
    else if (type == GET_PAY)
    {
      // console.log(data)
    }
    else if(type == WALLET_RESPONSE)
    {
    // console.log(data)
    this.router.navigate(["order-placed"]);
    }
    else 
    {
      // console.log(data);
    }
  }
  handleError(error,type) {
    this.loadingController.dismiss()
    // console.log(error);
    if(type == WALLET_RESPONSE)
    {
      if(error.status == 400)
      {
        // this.presentToastDanger("Sorry Wallet doesnt have enough amount. ")
        this.presentAlertConfirmWallet()
      }
      if(error.status == 500)
      {
       
        this.qtyNotSufficient(error.error.message)
      }
    }
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
        // console.log(promo_Details);
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
      // console.log(paymentDetails);
      if (paymentDetails) {
        this.payment_id = paymentDetails.modeOfPayment_Id;
        if(this.payment_id == 7)
        {
          // console.log("wallet")
          let data = {
            client_id: localStorage.getItem("client_id"),
            promo_code_id: this.promo_id,
            address_id: this.address_id,
            payment_option_id: this.payment_id,
            product_total: this.data.total_amount,
            payable_amount:Math.round(this.data.payable_amount),
            delivery_charge: this.data.delivery_charge
          };

          this.walletService.captureWallet(data).subscribe(
            (data) => this.handleResponse(data, WALLET_RESPONSE),
            (error) => this.handleError(error,WALLET_RESPONSE)
          );
        }
        else{
          // console.log(this.payment_id);
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
            (error) => this.handleError(error,ORDER_RESPONSE)
          );
        }
        
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
  async presentToastDanger(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "middle",
      color: "danger",
      duration: 2000,
    });
    toast.present();
  }

  async presentAlertConfirmWallet() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Insufficient Wallet Balance',
      message: 'Recharge your Wallet',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okey',
          handler: () => {
            // console.log('Confirm Okey');
            let balance = this.data.payable_amount - this.data.wallet_balance
            this.router.navigate(['recharge',{balance}])
          }
        }
      ]
    });

    await alert.present();
  }
  async qtyNotSufficient(msg) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: msg,
      buttons: [
         {
          text: 'Okey',
          handler: () => {
            this.router.navigate(['cart'])
          }
        }
      ]
    });

    await alert.present();
  }
  // async presentAlertConfirmPayment() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Confirm',
  //     message: 'Pay <strong> 463 AED</strong> from wallet and rest through other payment options',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Okay',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //           this.data.payable_amount = this.data.payable_amount-200
  //           this.openPaymentModes();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }


    
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
