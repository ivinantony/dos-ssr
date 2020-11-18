import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VerifyOtpService {

  url:string
  constructor(private utils:UtilsService,private httpClient:HttpClient,private headerService:HeadersService) 
  { 
    this.url=utils.getApiPath()
  }

  verifyOtp(data:any)
  {
    const headers = this.headerService.getHttpHeaders()
    return this.httpClient
    .post(this.url+"verify-otp",data,{headers}).pipe(map(res=>{return res}));
  }
}
