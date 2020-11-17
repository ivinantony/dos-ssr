import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url:string
  constructor(private utils:UtilsService,private headerService:HeadersService,private httpclient:HttpClient) 
  {
    this.url=utils.getApiPath()
   }

   public registerUser(data:any){
    const headers= this.headerService.getHttpHeaders();
    return this.httpclient
      .post(
        this.url +"register", 
        data,{ headers }
      )
      .pipe(map(res =>{
        return res
      })
      );
  }
}
