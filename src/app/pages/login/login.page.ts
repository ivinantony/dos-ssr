import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginService } from 'src/app/services/login/login.service';
import { INotificationPayload } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/typings';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { UsernameValidator } from 'src/app/validators/username';
import { OtpmodalPage } from '../otpmodal/otpmodal.page';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginGroup: FormGroup;
  previousUrl: string = null;
  public hasPermission: boolean;
  public token: string;
  public pushPayload: INotificationPayload;
  currentUrl: string = null;
  branch_id:number=6
  phone:any
  data:any
  constructor(private authService: AuthenticationService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private loginService:LoginService,
    private modalController:ModalController,
    private router:Router,
    public alertController: AlertController,
    private afMessaging: AngularFireMessaging,
    private fcm: FCM,
    public platform: Platform) {
    
    this.setupFCM() 
    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
   
      phone: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern("[0-9]*"),])],
      
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
     
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
              console.log('Permission granted! Save to the server!', token);
              this.token = token
            },
            (error) => {
              console.error(error);
            }
          );
         await this.afMessaging.messages.subscribe( async (msg:any)=>{
           console.log()
            console.log('msg',msg);
            this.showToast(msg.notification.title)
          })
      
    }
    else{
      console.log('In cordova platform');
      console.log('Subscribing to token updates');
      this.fcm.onTokenRefresh().subscribe((newToken) => {
        this.token = newToken;
        // this.loginForm.controls['fcm_token'].setValue(newToken);
        console.log('onTokenRefresh received event with: ', newToken);
      });
  
      console.log('Subscribing to new notifications');
      this.fcm.onNotification().subscribe((payload) => {
        this.pushPayload = payload;
        console.log('onNotification received event with: ', payload);
        if (payload.wasTapped) {
          this.router.navigate(['notifications',{data:payload}]);
          console.log('Received in background');
        } else {
          console.log('Received in foreground');
          this.showToast(payload.notification.title)
          this.router.navigate(['notification',{data:payload}]);
        }
      });
  
      this.hasPermission = await this.fcm.requestPushPermission();
      console.log('requestPushPermission result: ', this.hasPermission);
  
      this.token = await this.fcm.getToken();
      // this.loginForm.controls['fcm_token'].setValue(this.token);
      console.log('getToken result: ', this.token);
  
      this.pushPayload = await this.fcm.getInitialPushPayload();
      console.log('getInitialPushPayload result: ', this.pushPayload);
    }

  }


  login(data) {

    if(this.loginGroup.valid)
    {
      let phone= data.phone
      let email = data.email
      let userDetails={
        
        email: data.email,
        name: data.name,
        phone: data.phone,
        fcm_token:this.token
      }
      // console.log(this.loginGroup.value)
      this.loginService.registerUser(userDetails).subscribe(
        (data)=>this.handleResponse(data),
        (error)=>this.handleError(error))
        this.router.navigate(['otp',{phone,email}])
  
    }
    else
    {
      this.presentToastDanger("Some fields are invalid.")
    }

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

  async presentToastDanger(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      color: "danger",
      position: "middle",
      duration: 2000,
    });
    toast.present();
  }

  handleResponse(data)
  {
   this.data = data
    // console.log(data)
    // this.presentAlert()
  }

  handleError(error)
  {
    // console.log(error)
  }

 

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: ' YOUR OTP IS',
      message: this.data.otp,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showToast(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "danger",
      buttons: [
        {
          side: 'end',
          text: 'view',
          handler: () => {
            this.router.navigate(['notification'])
          }
        }
      ]
    });
    toast.present();
  }

}
