
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public getNotifications(client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "notification?client_id="+client_id,
      { headers }
     ).pipe(map(res=>{
       return res}));
   }

   public getNotificationDetails(id:any,client_id:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "notification-detail?notification_id="+id+"&client_id="+client_id,
      { headers }
     ).pipe(map(res=>{
       return res}));
   }

   public postNotification(data:any)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "notification-status",data,
      { headers }
     ).pipe(map(res=>{
       return res}));
   }

}
