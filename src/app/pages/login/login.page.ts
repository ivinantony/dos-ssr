import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, LoadingController, ToastController, ModalController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginService } from 'src/app/services/login/login.service';
import { UsernameValidator } from 'src/app/validators/username';
import { OtpmodalPage } from '../otpmodal/otpmodal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginGroup: FormGroup;
  previousUrl: string = null;
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
    public alertController: AlertController) {
    
    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*"),])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')])],
     
    });
  }

  ngOnInit() {

  }
  login(data) {
    let phone= data.phone
    let email = data.email
    let userDetails={
      
      email: data.email,
      name: data.name,
      phone: data.phone
    }
    console.log(this.loginGroup.value)
    this.loginService.registerUser(userDetails).subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error))
      this.router.navigate(['otp',{phone,email}])
    // this.presentLoading().then(() => {
    //   this.authService.login().then(() => {
    //     this.presentToast().finally(() => {
    //       this.navCtrl.back()
    //     })

    //   })
    // })


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

  handleResponse(data)
  {
   this.data = data
    console.log(data)
    this.presentAlert()
  }

  handleError(error)
  {
    console.log(error)
  }
  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: OtpmodalPage,
  //     cssClass: '',
  //     componentProps: {
  //       phone : type,
        
  //     }
  //   });
  //   //  modal.onDidDismiss().finally(()=>{
  //   //   this.getData()
  //   // })
  //   return await modal.present();
   
  // }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: ' YOUR OTP IS',
      message: this.data.otp,
      buttons: ['OK']
    });

    await alert.present();
  }
}
