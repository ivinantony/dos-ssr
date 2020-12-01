import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'],
})
export class PaypalPage implements OnInit {
  paymentAmount: string = '3.33';
  currency: string = 'INR';
  currencyIcon: string = '₹';
  order_id:any
  constructor(private paymentService:PaymentService) { 
    let _this = this;
    setTimeout(() => {
      // Render the PayPal button into #paypal-button-container
      <any>window['paypal'].Buttons({

        // Set up the transaction
        createOrder: function (data, actions) {
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
              
              
              let data= {
                payable_order_id:localStorage.getItem("order_id"),
                client_id:localStorage.getItem("client_id")
              }
              paymentService.capturePayment(data).subscribe(
                (data)=>this.handleResponse(data),
                (error)=>this.handleError(error)

              )
              console.log("Capture payment invoked")
              alert('Transaction completed by ' + details.payer.name.given_name + '!');

            })
            .catch(err => {
              console.log(err);
            })
        }
      }).render('#paypal-button-container');
    }, 500)
  }

  ngOnInit() {
  }


handleResponse(data)
{
console.log(data)
}
handleError(error)
{
  console.log(error)
}
  
}
