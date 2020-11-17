import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeadersService {

  constructor() { }
  getHttpHeaders() {
    // const tokenService = new TokenService();

    var headers = new HttpHeaders()
      .set("Accept", "application/json")
      .set("client-id", "1")
      .set("client-secret", "1-oyzZ2brWK7VwbR1T");

    // headers.append("token", tokenService.get());
    return headers;
  }
}

