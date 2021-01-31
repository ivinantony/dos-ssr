import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() {
   
   }
  getHttpHeaders() {
    var headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("client-id", "1")
      .set("client-secret", "1-oyzZ2brWK7VwbR1T");

    // headers.append("token", tokenService.get());
    return headers;
  }

  getCheckOutHeaders() {
    // const tokenService = new TokenService();

    var headers = new HttpHeaders()
      .set("Authorization", "sk_test_71d6a2c5-4422-46b8-bbee-ed86fc235a55")
      .set("Content-Type", "application/json");

    // headers.append("token", tokenService.get());
    return headers;
  }
}

