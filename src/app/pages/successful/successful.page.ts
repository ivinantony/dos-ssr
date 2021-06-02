import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defineCustomElements } from "@teamhive/lottie-player/loader";
import { CartcountService } from 'src/app/services/cartcount.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ModalController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-successful',
  templateUrl: './successful.page.html',
  styleUrls: ['./successful.page.scss'],
})
export class SuccessfulPage implements OnInit {

  constructor(private router:Router,
    private authService:AuthenticationService,
    private cartCountService:CartcountService,
    private navController:NavController,
    private modalController:ModalController) {
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
    this.modalController.dismiss()
    this.router.navigate(["/tabs/home"],{replaceUrl:true})
  }

}
