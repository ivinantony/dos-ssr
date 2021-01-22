
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    //  let url = "http://127.0.0.1:8000/api/mobile/"
    let headers = new HttpHeaders()
    .set('Accept', 'application/json')
    return this.httpclient.post(this.url + 'pay', data, { headers: headers })
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


    public confirmPayment(trans_ref:any,client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "payment-details?trans_ref="+trans_ref+"&client_id="+client_id,{ headers }).pipe(map(res=>{return res}));
   }
}
