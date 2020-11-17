import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';

export const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private plt: Platform) {
   
  }

  getToken() {
    var token = localStorage.getItem(TOKEN_KEY);
    console.log('token')
    if (token) {
      return token
    }
  }

  async login() {
    await localStorage.setItem(TOKEN_KEY, 'Bearer 1234567')
    console.log('token saved')
  }

  async logout() {
    await localStorage.removeItem(TOKEN_KEY)
    console.log('token cleared')
  }

  
  isAuthenticated() {
    const token = this.getToken();
    console.log('token', token)
    if (token != null) {
      return true;
    } else {
      return false;
    }
  }

}