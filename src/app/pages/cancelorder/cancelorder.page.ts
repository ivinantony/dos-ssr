import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-cancelorder',
  templateUrl: './cancelorder.page.html',
  styleUrls: ['./cancelorder.page.scss'],
})
export class CancelorderPage implements OnInit {
  @Input() order_id: any;
  desc:any
  constructor(private modalController:ModalController,private orderService:OrderService) { }

  ngOnInit() {
  }

  close()
  {
    this.modalController.dismiss()
  }
  cancelOrder()
  {
    let data = {
      description:this.desc,
      client_id:localStorage.getItem("client_id"),
      order_id:this.order_id
    }
    this.orderService.cancelOrder(data).subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error))
    this.modalController.dismiss()
  }

  handleResponse(data)
  {
    // console.log(data)
  }
  handleError(error)
  {
    // console.log(error)
  }
}

