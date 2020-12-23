import { Component, NgZone, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment/payment.service';
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
  constructor(private pay:PaymentService,public router:Router,private toastController:ToastController,private zone:NgZone,private loadingController:LoadingController) 
  { 
    this.paymentAmount = localStorage.getItem('total_amount')
    
    this.paypal()
  }

  ngOnInit() {
  }

paypal()
{
  let _this = this;
  setTimeout(() => {
    // Render the PayPal button into #paypal-button-container
    <any>window['paypal'].Buttons({

      // Set up the transaction
      createOrder: function (data, actions) {
        _this.presentLoading()
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: _this.paymentAmount
            }
          }]
        });
      },

      // Finalize the transaction
      onApprove: function (data, actions) {
        return actions.order.capture()
          .then(function (details) {
            console.log(details)
            // Show a success message to the buyer
            if(details.status == "COMPLETED")
            {
              let data={
                payable_order_id:localStorage.getItem("order_id"),
                client_id:localStorage.getItem("client_id")
              }
            
              _this.pay.capturePayment(data).subscribe(
                (data)=>console.log(data),
                (error)=>console.log(error)    
              )
              _this.loadingController.dismiss()
              _this.zone.run(() => {
               _this.router.navigate(['order-placed'])
              })
            }
            // alert('Transaction completed by ' + details.payer.name.given_name + '!');

          })
          .catch(err => {
            console.log(err);
          })
      }
    }).render('#paypal-button-container');
  }, 500)
}


  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'custom-toast',
      position: 'middle',
      color:'success',
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
