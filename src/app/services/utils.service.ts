import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private apiPath: string;
  private s3url: string;
  public token: any;
  constructor() {
    this.apiPath = "https://dev.sparepartsapi.mermerapps.com/api/mobile-app/";
    // this.apiPath = "https://api.dealonstore.com/api/mobile-app/";
    // this.s3url = "https://s3.ap-south-1.amazonaws.com/fashionstoremermer/";
    this.s3url = "https://s3.ap-south-1.amazonaws.com/dev-fashionstoremermer/";
    // this.s3url = "https://s3.me-south-1.amazonaws.com/dealonstore/";

    
  }
  public getApiPath() {
    return this.apiPath;
  }
  public getS3url() {
    return this.s3url;
  }
}