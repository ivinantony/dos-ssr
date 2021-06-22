import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TermsandconditionsService } from 'src/app/services/termsandconditions.service';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.page.html',
  styleUrls: ['./termsandconditions.page.scss'],
})
export class TermsandconditionsPage implements OnInit {

  data: any
  constructor(private termsPolicy: TermsandconditionsService,
    public router:Router,public platform:Platform) {
    this.getData()
  }

  ngOnInit() {
  }
  getData() {
    this.termsPolicy.getTerms().subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    )
  }

  handleResponse(data) {
    this.data = data
  }
  handleError(error) {
    // console.log(error)
  }

  facebook() {
    window.open("https://www.facebook.com/deal-on-store-103110191641253", "_self");
  }
  twitter() {
    window.open("https://twitter.com/dealonstore", "_self");
  }
  insta() {
    window.open("https://www.instagram.com/deal_on_store/", "_self");
  }

  whatsapp() {
    window.open(
      "https://api.whatsapp.com/send?phone=447417344825&amp;"
      
    );
  }
  ios_App(){
    if(this.data.app_store_url!=null){
      window.open(this.data.app_store_url);
    }    
  }

  android_App(){
    if(this.data.play_store_url!=null){
      window.open(this.data.play_store_url);
    }
  }
}
