import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
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
  constructor(private orderService:OrderService,private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalController:ModalController,private utilsService:UtilsService,
    private loadingController:LoadingController) 
  { this.id = activatedRoute.snapshot.params.order_id
    this.s3url = utilsService.getS3url()
    this.getData()
  }

  ngOnInit() {

  }

  getData()
  {
    this.presentLoading().then(()=>{
      this.orderService.getParticularOrderDetails(this.id).subscribe(
        (data)=>this.handleResponse(data,GET_DATA),
        (error)=>this.handleError(error)
      )
      }
      )
  }

  handleResponse(data,type)
  {
    this.loadingController.dismiss()
    this.data = data
  }
  handleError(error)
  {
    this.loadingController.dismiss()
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

  track(){
    let id = this.data.order.delivery_id
 
    window.open(
      "https://www.skyexpressinternational.com/Home/Tracking?trackingType=REF&tid="+id
    );
  }


  async presentModal() {
    const modal = await this.modalController.create({
      component: CancelorderPage,
      cssClass: 'my-custom-class',
      componentProps: { order_id: this.data.order.id }
    });
  
    await modal.present();
    await modal.onDidDismiss().then(()=>{this.router.navigate(['orders'])})
    
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

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
