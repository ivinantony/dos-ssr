import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, ModalController } from '@ionic/angular';
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
  constructor(private authService: AuthenticationService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private loginService:LoginService,
    private modalController:ModalController) {
    
    this.loginGroup = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]*"),])],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$')])],
     
    });
  }

  ngOnInit() {

  }
  login(data) {
    let userDetails={
      branch_id: 6,
      email: data.email,
      name: data.name,
      phone: data.phone
    }
    console.log(this.loginGroup.value)
    this.loginService.registerUser(userDetails).subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error))
      this.presentModal()
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
    console.log(data)
  }

  handleError(error)
  {
    console.log(error)
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: OtpmodalPage,
      cssClass: 'modal-class',
      // componentProps: {
      //   type : type,
        
      // }
    });
    //  modal.onDidDismiss().finally(()=>{
    //   this.getData()
    // })
    return await modal.present();
   
  }
}
