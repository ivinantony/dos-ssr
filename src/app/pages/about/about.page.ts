import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, ToastController } from '@ionic/angular';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
data:any
  constructor(private aboutService:AboutService,
    private toastController:ToastController,
    public router:Router,public platform:Platform) {
    this.getData()
   }

  ngOnInit() {
  }

  getData()
  {
    this.aboutService.getAbout().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    this.data=data
  }

  handleError(error)
  {
  this.presentToast(error.error.message)
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
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
