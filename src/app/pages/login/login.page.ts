import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginService } from 'src/app/services/login/login.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginGroup: FormGroup;
  public hasPermission: boolean;
  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private storage: Storage,
    private router: Router,
    public alertController: AlertController,
    private afMessaging: AngularFireMessaging,
    private fcm: FCM,
    public platform: Platform,
    private zone: NgZone) {

    this.setupFCM();
    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],

      phone: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("[0-9]*"),])],

      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      fcm_token: ['']
    });
  }
  validation_messages = {
    name: [
      { type: "required", message: "Username is required." },
      {
        type: "minlength",
        message: "Username must be at least 4 characters long.",
      },
      {
        type: "maxlength",
        message: "Username cannot be more than 25 characters long.",
      },
      {
        type: "validUsername",
        message: "Your username has already been taken.",
      },
    ],
    phone: [
      { type: "required", message: "Phone number is required." },
      {
        type: "minlength",
        message: "Phone number must be 9 digits long.",
      },
      {
        type: "maxlength",
        message: "Phone number cannot be more than 9 digits.",
      },
      {
        type: "pattern",
        message: "Phone number should only include digits.",
      },
    ],
    email: [
      { type: "required", message: "Email is required." },
      {
        type: "pattern",
        message: "Invalid Email",
      },
    ]
  };

  ngOnInit() {

  }


  private async setupFCM() {
    await this.platform.ready();
    console.log('FCM setup started');

    if (!this.platform.is('cordova')) {
      // requesting permission
      this.afMessaging.requestToken // getting tokens
        .subscribe(
          (token) => { // USER-REQUESTED-TOKEN
            this.loginGroup.controls['fcm_token'].setValue(token);
          },
          (error) => {
            console.error(error);
          }
        );

    }
    else {
      this.fcm.onTokenRefresh().subscribe((newToken) => {
        this.loginGroup.controls['fcm_token'].setValue(newToken);
      });

      this.hasPermission = await this.fcm.requestPushPermission();

      let newToken = await this.fcm.getToken();
      this.loginGroup.controls['fcm_token'].setValue(newToken);
    }

  }


  login() {
    this.presentLoading().then(() => {
      this.loginService.registerUser(this.loginGroup.value).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error))
    })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait..',
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

navigateBack(){
  this.storage.get("prev_url").then((val) => {
    // console.log(val,"prev url")
    this.zone.run(() => {
      this.router.navigate([val] || ["/"], { replaceUrl: true });
    });
  });
}

  handleResponse(data) {
    this.loadingController.dismiss().then(() => {
      this.zone.run(() => {
        this.router.navigate(['otp', { phone: this.loginGroup.value.phone, email: this.loginGroup.value.email }],{ replaceUrl: true })
      })
    })

  }

  handleError(error) {
    // console.log(error)
    this.loadingController.dismiss()
  }



}
