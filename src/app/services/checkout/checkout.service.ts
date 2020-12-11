import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public addressDetails (data:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "addressDetails",data,{ headers }).pipe(map(res=>{return res}));
   }
   public getAmountDetails (client_id:any,address_id)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "checkout?client_id="+client_id+"&address_id="+address_id,{ headers }).pipe(map(res=>{return res}));
   }
}