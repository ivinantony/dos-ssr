
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentService } from 'src/app/services/payment/payment.service';



const GET_DATA=210;
const POST_DATA=220;
@Component({
  selector: 'app-modeofpayment',
  templateUrl: './modeofpayment.page.html',
  styleUrls: ['./modeofpayment.page.scss'],
})
export class ModeofpaymentPage implements OnInit {
  paymentAmount: string = '3.33';
    currency: string = 'INR';
    currencyIcon: string = '₹';
  paymentOptions:any
  constructor(public router:Router,private paymentservice:PaymentService,private loadingController:LoadingController,
    private platform:Platform,private orderService:OrderService,private modalController:ModalController) 
  { 
    this.getData()

  }
  ngOnInit() {
  }


  getData()
  {
    let client_id = localStorage.getItem('client_id')
    this.paymentservice.getPaymentOptions(client_id).subscribe(
      (data) => this.handleResponseData(data, GET_DATA),
      (error) => this.handleError(error)
    );
  }
  handleResponseData(data,type)
  {
    if(type == GET_DATA)
    {
      
    this.paymentOptions = data
    console.log(this.paymentOptions)
    // this.loadingController.dismiss()
    }
    else if(type == POST_DATA)
    {
      console.log(data)
    }
    
  }
  handleError(error)
  {
    console.log(error)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  selectPaymentMethod(i)
  {
    // if(i == 2)
    // {
    //   this.router.navigate(['paypal'])
    // }
    let data={
      modeOfPayment_Id :this.paymentOptions.payment_options[i].id 
    }
    this.modalController.dismiss(data)
  }
  
  close()
  {
    let data={
      modeOfPayment_Id :null
    }
    this.modalController.dismiss()
  }

}




// let orderData={
//   client_id:localStorage.getItem("client_id"),
//   address_id:"ddasc",
//   payment_option_id:"",
//   payable_amount:"",
//   product_total:""

// }
// orderService.captureOrder(orderData).subscribe(
//   (data) => this.handleResponseData(data, POST_DATA),
//   (error) => this.handleError(error)
// )