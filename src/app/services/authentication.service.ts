import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { CartcountService } from '../cartcount.service';
import { NotcountService } from '../notcount.service';

export const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private plt: Platform,private cartCountService:CartcountService,private notfCountSertvice:NotcountService) {
   
  }

  getToken() {
    var token = localStorage.getItem(TOKEN_KEY);
    // console.log('token')
    if (token) {
      return token
    }
  }

  async login(token) {
    await localStorage.setItem(TOKEN_KEY, token)
    // console.log(token,"this is token")
    // console.log('token saved')
  }

  async logout() {
    await localStorage.removeItem(TOKEN_KEY)
    await localStorage.removeItem('client_id')
    await localStorage.removeItem('cart_count')
    await localStorage.removeItem('notf_count')
    this.cartCountService.setCartCount(0)
    this.notfCountSertvice.setNotCount(0)
    // console.log('token cleared')
  }

  
  isAuthenticated() {
    const token = this.getToken();
    // console.log('token', token)
    if (token != null) {
      return true;
    } else {
      return false;
    }
  }

}