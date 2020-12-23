import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CancelorderPage } from '../cancelorder/cancelorder.page';
const GET_DATA = 200;
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage implements OnInit {
  s3url:string
  id:any
  data:any
  constructor(private orderService:OrderService,private activatedRoute:ActivatedRoute,private router:Router,private modalController:ModalController,private utilsService:UtilsService) 
  { this.id = activatedRoute.snapshot.params.order_id
    this.s3url = utilsService.getS3url()
    this.getData()
  }

  ngOnInit() {

  }

  getData()
  {
    this.orderService.getParticularOrderDetails(this.id).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    this.data = data
    console.log(data)
  }
  handleError(error)
  {
    console.log(error)
  }
  navigateToProduct(index) 
  {
    let id=this.data.order_products[index].product_id
    let catId= this.data.order_products[index].category_id
    this.router.navigate(['product',id,{catId}])
  }

  cancelOrder()
  {
    this.presentModal()
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: CancelorderPage,
      cssClass: 'my-custom-class',
      componentProps: { order_id: this.data.order.id }
    });
    return await modal.present();
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
