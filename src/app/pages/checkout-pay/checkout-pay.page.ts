import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { CardPaymentService } from '../../services/cardPayment/card-payment.service';
import { CkoFrames } from '../../../utils/CkoFrames';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Router } from '@angular/router';
const CARDPAYMENT=200;
const CAPTURE_PAYMENT= 210;
@Component({
  selector: 'app-checkout-pay',
  templateUrl: './checkout-pay.page.html',
  styleUrls: ['./checkout-pay.page.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CheckoutPayPage implements OnInit {

  token:any
	private Frames = undefined;
	private errors = {};

	constructor(private platform: Platform,private payment:CardPaymentService,private paymentService:PaymentService,
		private router:Router,private toastController:ToastController,private loadingController:LoadingController) {

		this.initializePaymentPage();

		// Set your desired error messages
		this.errors['card-number'] = 'Please enter a valid card number';
		this.errors['expiry-date'] = 'Please enter a valid expiry date';
		this.errors['cvv'] = 'Please enter a valid cvv code';
  }
  
  ngOnInit(): void {
    
  }

  async pay() {
	  this.presentLoading()
		let payload = await this.Frames.getTokenisedCard();
		// alert('This is the card token that you can pass to your server to complete a transaction: \n' + payload.token);
		this.token = payload.token
		this.cardPayment()
	}

	onCardValidationChanged(event) {
		// Enable the Payment Button only when the form is valid
		const button = <HTMLInputElement>document.getElementById('pay-button');
		button.disabled = !this.Frames.getFrames().isCardValid();
	}

	onValidationChanged(event) {
		const errorMessage = document.querySelector('.error-message');
		errorMessage.textContent = this.getErrorMessage(event);
	}

	getErrorMessage(event) {
		if (event.isValid || event.isEmpty) {
			return '';
		}
		return this.errors[event.element];
	}

	async initializePaymentPage() {
		this.platform.ready().then(() => {
			this.Frames = new CkoFrames({
				publicKey: 'pk_test_0aef1a91-04d7-4eb6-80fb-e34ee5e6a600',
				debug: true,
				cardValidationChanged: this.onCardValidationChanged.bind(this),
				frameValidationChanged: this.onValidationChanged.bind(this)
			});
			this.Frames.init();
		});
	}


	cardPayment()
	{
		let data={
			
				"source": {
				  "type": "token",
				  "token": this.token
				},
				"amount": Number(localStorage.getItem('total_amount')),
				"currency": "AED",
				"reference": "ORD-5023-4E89",
				"metadata": {
				  "udf1": "TEST123",
				  "coupon_code": "NY2018",
				  "partner_id": 123989
				}
			  
		}

		this.payment.createPayment(data).subscribe(
			(data)=>this.handleResponse(data,CARDPAYMENT),
			(error)=>this.handleError(error)
		  )
		

	}

	handleResponse(data,type)
	{
		if(type == CARDPAYMENT)
		{
			console.log(data)
			let info={
				payable_order_id:localStorage.getItem("order_id"),
				client_id:localStorage.getItem("client_id")
			  }
	
			  this.paymentService.capturePayment(info).subscribe(
				(data)=>console.log(data,CAPTURE_PAYMENT),
				(error)=>console.log(error)
			  )
			  this.loadingController.dismiss()
			// this.presentToast('Payment Successful')

			this.router.navigate(['order-placed'])
			 
			  
		}
		else if(type == CAPTURE_PAYMENT)

		{ 
			
			console.log(data,"capture_payment")
			
		}
		
		
	}
	handleError(error)
	{
		console.log(error)
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
