import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
data:any
  constructor(private aboutService:AboutService,
    private toastController:ToastController) {
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

}
