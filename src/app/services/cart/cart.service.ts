import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeadersService } from '../headers.service';
import { UtilsService } from '../utils.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  url:string
  constructor(private utils:UtilsService,private httpclient:HttpClient,private headerservice:HeadersService) 
  {
    this.url = utils.getApiPath()
   }
   public addToCart (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "cart",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public addProductToCart (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "product-cart",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
   public addToCartQty (data)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.post(
      this.url + "add-to-cart",data,{ headers }
     ).pipe(map(res=>{
       return res}));
   }

   public getCart (client_id)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.get(
      this.url + "cart?client_id="+client_id,{ headers }
     ).pipe(map(res=>{
       return res}));
   }



   public removeFromCart (client_id,product_id)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.delete(
      this.url + "cart?client_id="+client_id+"&product_id="+product_id,{ headers }
     ).pipe(map(res=>{
       return res}));
   }

   public deleteFromCart (client_id,product_id)
   {
     const headers = this.headerservice.getHttpHeaders()
     return this.httpclient.delete(
      this.url + "cart-product?product_id="+product_id+"&client_id="+client_id,{ headers }
     ).pipe(map(res=>{
       return res}));
   }
}
