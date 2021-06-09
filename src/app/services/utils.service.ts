import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private apiPath: string;
  private s3url: string;
  private appUrl: string;
  public token: any;
  constructor() {
    this.apiPath = "https://dev.sparepartsapi.mermerapps.com/api/mobile-app/";
    this.appUrl = "https://arba.mermerapps.com/";
    this.s3url = "https://s3.ap-south-1.amazonaws.com/dev-fashionstoremermer/";

  //  this.apiPath = "https://api.dealonstore.com/api/mobile-app/";
  //   this.appUrl = "https://dealonstore.com/";
  //   this.s3url = "https://s3.me-south-1.amazonaws.com/dealonstore/";


  }
  public getApiPath() {
    return this.apiPath;
  }
  public getS3url() {
    return this.s3url;
  }
  public getAppUrl() {
    return this.appUrl;
  }
}