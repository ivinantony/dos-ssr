import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HeadersService } from "../headers.service";
import { UtilsService } from "../utils.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WishlistService {
  url: string;
  constructor(
    private utils: UtilsService,
    private httpclient: HttpClient,
    private headerservice: HeadersService
  ) {
    this.url = utils.getApiPath();
  }
  public wishlist(data) {
    const headers = this.headerservice.getHttpHeaders();
    return this.httpclient.post(this.url + "wishlist", data, { headers }).pipe(
      map((res) => {
        return res;
      })
    );
  }
  

  public getWishlist(client_id) {
    const headers = this.headerservice.getHttpHeaders();
    return this.httpclient
      .get(this.url + "wishlist?client_id=" + client_id, { headers })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

//   public removeFromCart(client_id, product_id) {
//     const headers = this.headerservice.getHttpHeaders();
//     return this.httpclient
//       .delete(
//         this.url + "cart?client_id=" + client_id + "&product_id=" + product_id,
//         { headers }
//       )
//       .pipe(
//         map((res) => {
//           return res;
//         })
//       );
//   }

//   public deleteFromCart(client_id, product_id) {
//     const headers = this.headerservice.getHttpHeaders();
//     return this.httpclient
//       .delete(
//         this.url +
//           "cart-product?product_id=" +
//           product_id +
//           "&client_id=" +
//           client_id,
//         { headers }
//       )
//       .pipe(
//         map((res) => {
//           return res;
//         })
//       );
//   }
}
