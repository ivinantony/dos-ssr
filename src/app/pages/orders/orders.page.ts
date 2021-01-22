import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
const GET_DATA = 200;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  data:any
  constructor(private orderService:OrderService,public router:Router,private loadingController:LoadingController) 
  {
    // this.getData()
  }

  ngOnInit() {
  }
  ionViewWillEnter()
  {
    this.getData()
  }

  getData()
  {
    this.presentLoading().then(()=>{
    let client_id = Number(localStorage.getItem('client_id'))
    this.orderService.getOrderDetails(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
    }
    )
  }

  handleResponse(data,type)
  {
    this.loadingController.dismiss()
    if(type == GET_DATA)
    {
      this.data = data
      // console.log(data)
    }
    
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
  }

  continueShopping()
  {
    this.router.navigate(['home'])
  }
  details(index:number)
  {
    let order_id = this.data.orders[index].id
    this.router.navigate(['order-details',{order_id}])
  }

  doRefresh(event) {
   
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
