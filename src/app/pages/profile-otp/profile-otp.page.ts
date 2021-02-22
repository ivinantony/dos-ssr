import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { VerifyOtpService } from 'src/app/services/otp/verify-otp.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
const POST_OTP=200;
@Component({
  selector: 'app-profile-otp',
  templateUrl: './profile-otp.page.html',
  styleUrls: ['./profile-otp.page.scss'],
})
export class ProfileOTPPage implements OnInit {
  inputOtp:number
  phone:number
  email:any
  data:any
  client_id:any
  constructor(private otpService:VerifyOtpService,private activatedRoute:ActivatedRoute,private alertController:AlertController,
    private authService:AuthenticationService,private router:Router,private profileService:ProfileService,private navController:NavController,
    private authservice:AuthenticationService) 
  { 
    this.phone = this.activatedRoute.snapshot.params.phoneNo
    this.email = this.activatedRoute.snapshot.params.Email
    this.authService.isAuthenticated().then(val=>{
      if(val){
        this.client_id = val
      }
    })
    
  }

  ngOnInit() {
  }

  continue()
  {
    if(this.phone == null)
    {
      this.data={
        client_id:this.client_id,
        email:this.email,
        otp:this.inputOtp ,
      }  
      this.profileService.verifyEmail(this.data).subscribe(
        (data) => this.handleResponseData(data, POST_OTP),
        (error) => this.handleError(error)
      );
    }
    else if(this.email == null)
    {
     this.data={
        client_id:this.client_id,
        otp:this.inputOtp ,
        phone:this.phone,
      } 
      this.profileService.verifyPhone(this.data).subscribe(
        (data) => this.handleResponseData(data, POST_OTP),
        (error) => this.handleError(error)
      );
    }
  }

  handleResponseData(data,type)
  {
    this.router.navigate(['profile'])
  }

  handleError(error)
  {
    this.presentAlert("plaease check your OTP.")
  }

  async presentAlert(msg:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Invalid OTP',
     
      message:msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  cancel()
  {
    this.navController.pop()
  }
}
