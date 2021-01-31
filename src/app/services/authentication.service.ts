import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { CartcountService } from "../cartcount.service";
import { NotcountService } from "../notcount.service";
import { Storage } from "@ionic/storage";

const TOKEN_KEY = "client_id";
const CART_COUNT = "cart_count";
const NOTIFICATION_COUNT = "notf_count";
@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    private storage: Storage,
    private cartCountService: CartcountService,
    private notfCountSertvice: NotcountService
  ) {}


  async setClientId(key) {
    await this.storage.set(TOKEN_KEY, key);
  }

  async logout() {
    await this.storage.clear();
    this.cartCountService.setCartCount(0);
    this.notfCountSertvice.setNotCount(0);
  }

  isAuthenticated() {
    return this.storage.get(TOKEN_KEY);
  }

  async setCartCount(count) {
    return this.storage.set(CART_COUNT, count);
  }
  async getCartCount() {
    return this.storage.get(CART_COUNT);
  }
  async setNotificationCount(count) {
    return this.storage.set(NOTIFICATION_COUNT, count);
  }
  async getNotificationCount() {
    return this.storage.get(NOTIFICATION_COUNT);
  }
}
