import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defineCustomElements } from "@teamhive/lottie-player/loader";
import { CartcountService } from 'src/app/services/cartcount.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-successful',
  templateUrl: './successful.page.html',
  styleUrls: ['./successful.page.scss'],
})
export class SuccessfulPage implements OnInit {

  constructor(private router:Router,
    private authService:AuthenticationService,
    private cartCountService:CartcountService) {
    defineCustomElements(window);
    this.authService.setCartCount(0);
    this.cartCountService.setCartCount(0);
   }
   replace(){
    this.router.navigate(["tabs"],{replaceUrl:true});
  }

  ngOnInit() {
  }

  continue()
  {
    this.router.navigate(["/tabs/home"], { replaceUrl: true })
  }
  ionViewWillLeave(){
    console.log('ionViewWillLeave')
    // window.location.replace('tabs');
  }

}
