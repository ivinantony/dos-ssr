import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UsernameValidator } from 'src/app/validators/username';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginGroup: FormGroup;
  previousUrl: string = null;
  currentUrl: string = null;
  constructor(private authService: AuthenticationService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,) {

    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*"),])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')])],
    });
  }

  ngOnInit() {

  }
  login() {
    console.log(this.loginGroup.value)
    this.presentLoading().then(() => {
      this.authService.login().then(() => {
        this.presentToast().finally(() => {
          this.navCtrl.back()
        })

      })
    })


  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait..',
      duration: 1000,
      spinner: 'bubbles'
    });
    await loading.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Logged in Succesfully',
      cssClass: 'custom-toast',
      duration: 2000
    });
    toast.present();
  }
}
