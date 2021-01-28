import { Component, NgZone, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';

const POST_DATA=200;
@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'],
})
export class PaypalPage implements OnInit {
  paymentAmount: string;
  currency: string = 'USD';
  currencyIcon: string = '$';
  order_id:any
  details:any
  constructor(private pay:PaymentService,public router:Router,private toastController:ToastController,
    private zone:NgZone,private loadingController:LoadingController,
    private platform:Platform,private iab:InAppBrowser,
    private storage: Storage,) 
  { 
    this.paymentAmount = localStorage.getItem('total_amount')
    
    // this.paypal()
  }

  ngOnInit() {
  }

  hostedSubmit() {
    this.presentLoading().then(() => {

      let data = {
        client_id:Number(localStorage.getItem('client_id')),
        payable_order_id:localStorage.getItem('order_id'),
        payable_amount:localStorage.getItem('total_amount'),
        address_id:localStorage.getItem('address_id')
      }
      this.pay.hostedPay(data)
        .subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error))

    })
  }


  handleResponse(data) {
    this.loadingController.dismiss()
    console.log('data n Tab3', data)
    this.storage.set("tran_ref",data.tran_ref).then(()=>{
    this.openUrl(data.redirect_url)
    })
  }
  handleError(error) {
    // console.log('error in Tab3', error)
    this.loadingController.dismiss()
    }
    openUrl(url) {
    if (!this.platform.is('cordova')) {
    window.open(url, '_self')
    return;
    }
    const browser = this.iab.create(url, '_self');
    
    browser.on('loadstop').subscribe(event => {
    browser.insertCSS({ code: "body{color: red;" });
    });
    
    // browser.close();
  }

//   paypal()
// {
//   let _this = this;
//   setTimeout(() => {
//     // Render the PayPal button into #paypal-button-container
//     <any>window['paypal'].Buttons({

//       // Set up the transaction
//       createOrder: function (data, actions) {
        
//         return actions.order.create({
//           purchase_units: [{
//             amount: {
//               value: _this.paymentAmount
//             }
//           }]
//         });
//       },

//       // Finalize the transaction
//       onApprove: function (data, actions) {
//         _this.presentLoading()
//         return actions.order.capture()
//           .then(function (details) {
            
//             // console.log(details)
//             // Show a success message to the buyer
//             if(details.status == "COMPLETED")
//             {
//               let data={
//                 payable_order_id:localStorage.getItem("order_id"),
//                 client_id:localStorage.getItem("client_id")
//               }
              
//               _this.pay.capturePayment(data).subscribe(
//                 (data)=>console.log(data),
//                 (error)=>console.log(error)    
//               )
//               _this.loadingController.dismiss()
//               _this.zone.run(() => {
//                _this.router.navigate(['order-placed'])
//               })
//             }
//             // alert('Transaction completed by ' + details.payer.name.given_name + '!');

//           })
//           .catch(err => {
//             console.log(err);
//             console.log("payment failed")
//             _this.presentToast("Payment Failed")
//             _this.router.navigate(['cart'])
//           })
//       }
//     }).render('#paypal-button-container');
//   }, 500)
//   }


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'custom-toast',
      position: 'top',
      color:'dark',
      duration: 2000
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
