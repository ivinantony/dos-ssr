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

  async login(token) {
    await localStorage.setItem(TOKEN_KEY, token)
    console.log(token,"this is token")
    console.log('token saved')
  }

  async logout() {
    await localStorage.removeItem(TOKEN_KEY)
    await localStorage.removeItem('client_id')
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