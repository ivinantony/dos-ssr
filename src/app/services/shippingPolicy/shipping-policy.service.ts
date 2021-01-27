

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../../services/headers.service';
import { UtilsService } from '../../services/utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ShippingPolicyService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public getShippingpolicy()
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "delivery-policy",
      { headers }
     ).pipe(map(res=>{
       return res}));
   }
}
