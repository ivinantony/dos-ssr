
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public captureOrder(data:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "capture-order",data,{ headers }).pipe(map(res=>{ return res}));
   }
   public getOrderDetails(client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "orders?client_id="+client_id,{ headers }).pipe(map(res=>{ return res}));
   }
   public getParticularOrderDetails(order_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "order-details?id="+order_id,{ headers }).pipe(map(res=>{ return res}));
   }
}
