import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private authService: AuthenticationService,
    private navCtrl: NavController, private loadingController: LoadingController, private toastController: ToastController) { }




  ngOnInit() {
  }
  logout() {
    this.presentLoading().then(() => {
      this.authService.logout().then(() => {
        this.presentToast().finally(() => {
          this.navCtrl.back()
        })

      })
    })


  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait... ',
      duration: 100,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Logged out Succesfully',
      cssClass: 'custom-toast',
      duration: 2000
    });
    toast.present();
  }

}
