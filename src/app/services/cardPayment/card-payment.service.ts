

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CardPaymentService {
  url="https://api.sandbox.checkout.com/payments"
  constructor(private httpclient:HttpClient,private headerservice:HeadersService) 
  { }
  
   public createPayment(data)
   {
     const headers = this.headerservice.getCheckOutHeaders()
     return this.httpclient.post(
      this.url,data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
}
