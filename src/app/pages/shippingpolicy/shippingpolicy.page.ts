import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ShippingPolicyService } from 'src/app/services/shippingPolicy/shipping-policy.service';

@Component({
  selector: 'app-shippingpolicy',
  templateUrl: './shippingpolicy.page.html',
  styleUrls: ['./shippingpolicy.page.scss'],
})
export class ShippingpolicyPage implements OnInit {
  data: any
  constructor(private deliverypolicy: ShippingPolicyService,
    public router:Router,public platform:Platform) {
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.deliverypolicy.getShippingpolicy().subscribe(
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
