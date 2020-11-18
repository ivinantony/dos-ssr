import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { map } from 'rxjs/operators';
import { UtilsService } from '../utils.service';



@Injectable({
  providedIn: 'root'
})
export class HomeService {
url:string
  constructor(private httpClient:HttpClient,private utils:UtilsService,private headerService:HeadersService)
  {
    this.url = utils.getApiPath()
  }

  public getHomeDetails() {
    const headers = this.headerService.getHttpHeaders();
    return this.httpClient
      .get(
        this.url + "home-details",{ headers }
      ).pipe(map(res =>{
      return res
      })
      );
  }
}
