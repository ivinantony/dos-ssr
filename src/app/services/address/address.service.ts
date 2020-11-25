import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AddressService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public getDeliveryLocations()
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "delivery-locations",
      { headers }
     ).pipe(map(res=>{
       return res}));
   }
   public addAddress(data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "address",data,{ headers }).pipe(map(res=>{
       return res}));
   }

   
   public getAddress(client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "all-address?client_id="+client_id,{ headers }).pipe(map(res=>{
       return res}));
   }

   public deleteAddress(address_id:number)
  {
    const headers = this.headerservice.getHttpHeaders()
    return this.httpclient.delete(
      this.url+"address?address_id="+address_id, { headers }).pipe(map(res=>{return res}));
  }
   public getEditAddress(address_id:number)
  {
    const headers = this.headerservice.getHttpHeaders()
    return this.httpclient.get(
      this.url+"address?address_id="+address_id, { headers }).pipe(map(res=>{return res}));
  }


   
}
