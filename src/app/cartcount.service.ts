import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartcountService {
  cartCount = new BehaviorSubject(0);

  constructor() {}

  getCartCount() {
    return this.cartCount.asObservable();
  }

  setCartCount(count) {
    this.cartCount.next(count);
  }
}
