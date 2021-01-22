import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartcountService } from 'src/app/cartcount.service';
import { defineCustomElements } from '@teamhive/lottie-player/loader';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.page.html',
  styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {
client_id:any
ref:any
  constructor(public router:Router,
    private cartCountService:CartcountService,
    private paymentService:PaymentService,
    private storage:Storage
    ) 
  { 
    this.client_id = localStorage.getItem("client_id")
    this.storage.get('tran_ref').then((val) => {
       this.ref = val
       paymentService.confirmPayment(this.ref,this.client_id).subscribe(
        (data)=>this.handleResponse(data),
        (error)=>this.handleError(error)
      )
    })
    
    
    
    localStorage.removeItem('cart_count')
    cartCountService.setCartCount(0)
    defineCustomElements(window);
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
