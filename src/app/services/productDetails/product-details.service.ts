import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
url:string
  constructor(private utils:UtilsService,private headerService:HeadersService,private httpclient:HttpClient)
  { 
    this.url = utils.getApiPath()
  }
  public getProductDetails(product_id:number)       
  {
    const headers = this.headerService.getHttpHeaders()
    return this.httpclient.get(
      this.url + "product?product_id="+product_id,
      { headers }
    ).pipe(map(res=>{return res}));
  }
}
