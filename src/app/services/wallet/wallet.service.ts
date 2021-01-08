
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class WalletService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
 
   public addToWallet(data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "wallet",data,{ headers })
      .pipe(map(res=>{
       return res}));
   }
   public getWalletDetails(client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "wallet-details?client_id="+client_id,{ headers })
      .pipe(map(res=>{
       return res}));
   }
   public captureWallet(data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "capture-wallet-order",data,{ headers })
      .pipe(map(res=>{
       return res}));
   }

   
}




