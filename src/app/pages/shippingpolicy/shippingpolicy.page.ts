import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingPolicyService } from 'src/app/services/shippingPolicy/shipping-policy.service';

@Component({
  selector: 'app-shippingpolicy',
  templateUrl: './shippingpolicy.page.html',
  styleUrls: ['./shippingpolicy.page.scss'],
})
export class ShippingpolicyPage implements OnInit {
  data: any
  constructor(private deliverypolicy: ShippingPolicyService,
    public router:Router) {
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
    window.open(
      "https://apps.apple.com/in/app/deal-on-store/id1550282870"
    );
    
  }

  android_App(){
    // if(this.platform.is('cordova')){
    //   this.market.open('com.mermerapps.premier');
    // }else{
    //   window.open(
    //     "https://play.google.com/store/apps/details?id=com.ludo.king"
        
    //   );
    // }
    
  }

}
