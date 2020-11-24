import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public getProfileDetails (client_id)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "profile-details?client_id="+client_id,
      { headers }
     ).pipe(map(res=>{
       return res}));
   }
   public updatePhone (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "update-phone",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public updateEmail (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "update-email",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public verifyPhone (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "verify-phone",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public verifyEmail (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "verify-email",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public updateName (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "update-profile",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
}
