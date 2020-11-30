import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order/order.service';
const GET_DATA = 200;
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  data:any
  constructor(private orderService:OrderService,public router:Router) 
  {
    this.getData()
  }

  ngOnInit() {
  }

  getData()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.orderService.getOrderDetails(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_DATA)
    {
      console.log(data)
    }
    
  }
  handleError(error)
  {
    console.log(error)
  }
}
