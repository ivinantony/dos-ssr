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
}
