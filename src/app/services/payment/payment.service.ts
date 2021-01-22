
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map, retry, tap, } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public getPaymentOptions(client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "payment-option?client_id="+client_id,{ headers }).pipe(map(res=>{return res}));
   }
   public capturePayment(data:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "capture-payment",data,{ headers }).pipe(map(res=>{return res}));
   }

   hostedPay(data:any) {
    const headers = this.headerservice.getHttpHeaders()
    return this.httpclient.post(this.url + 'hosted-pay', data, { headers: headers })
      .pipe(
        retry(3),
        tap( // Log the result or error
          data => {
            return data
          },
          error => {
            return error
          }
        ),
      )
    }
}
