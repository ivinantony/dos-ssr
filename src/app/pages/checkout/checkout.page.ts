import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { OrderService } from 'src/app/services/order/order.service';
import { CouponPage } from "../coupon/coupon.page";
import { ModeofpaymentPage } from "../modeofpayment/modeofpayment.page";
const GET_AMOUNTDETAILS=200;
const ORDER_RESPONSE=210;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

export class CheckoutPage implements OnInit {

  address_id:any
  client_id:any
  data:any
  promo_id:any
  payment_id:any
  discount_amount: number = 0;
  constructor(private checkoutService:CheckoutService,private activatedRoute:ActivatedRoute,private orderService:OrderService,
    private modalController:ModalController,private routerOutlet: IonRouterOutlet,) 
  { 
    this.client_id = Number(localStorage.getItem('client_id'))
    this.address_id = this.activatedRoute.snapshot.params.address_id
    this.getData()
    
  }

  ngOnInit() {
  }

  getData()
  {
    
    this.checkoutService.getAmountDetails(this.client_id,this.address_id).subscribe(
      (data)=>this.handleResponse(data,GET_AMOUNTDETAILS),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_AMOUNTDETAILS)
    {
      console.log(data)
      this.data = data
    }
    console.log(data)

    
  }
  handleError(error)
  {
    console.log(error)
  }

  checkOut()
  {
    this.openPaymentModes()
    
  }

  async openPromo() {
    this.data.payable_amount += this.discount_amount;
    this.data.saved_amount -= this.discount_amount;
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
        let data={
          client_id:localStorage.getItem("client_id"),
          promo_code_id:this.promo_id,
          address_id:this.address_id,
          payment_option_id:this.payment_id,
          product_total:this.data.total_amount,
          payable_amount:this.data.payable_amount
        }
        
        this.orderService.captureOrder(data).subscribe(
          (data)=> this.handleResponse(data,ORDER_RESPONSE),
          (error)=>this.handleError(error)
        )
      }
    });
    return await modal.present();
  }

}


