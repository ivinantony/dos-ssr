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
      // .set("client-id", "63")
      // .set("client-secret", "63-kg7Py3uiJDpqFPku");

    // headers.append("token", tokenService.get());
    return headers;
  }
}

