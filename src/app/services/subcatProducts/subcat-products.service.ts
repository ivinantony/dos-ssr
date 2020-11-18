import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SubcatProductsService {

  url:string
  constructor(private utils:UtilsService,private headerservice:HeadersService,private httpclient:HttpClient) 
  {
    this.url = utils.getApiPath()
   }

   public getSubCatProducts(category_id:number,member_id:any,page:number)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
       this.url+"category-product?category_id="+category_id +"&member_id="+member_id+"&page="+page,{headers}
     ).pipe(map(res=>{return res}));
   }
}
