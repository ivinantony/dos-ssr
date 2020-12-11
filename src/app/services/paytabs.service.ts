
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PaytabsService {
  url:string
  constructor(private httpclient:HttpClient) 
  {
    this.url = "https://apitest.cybersource.com/pts/v2/payments	"
   }
   public getPaymentUi (data:any)
   {
    
     return this.httpclient.post(this.url,{data}).pipe(map(res=>{
       return res}));
   }
}
