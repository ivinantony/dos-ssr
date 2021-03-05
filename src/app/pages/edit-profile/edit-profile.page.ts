import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { CountryCodeService } from 'src/app/services/countryCode/country-code.service';
const GET_DATA=200;
const POST_PHONE=210;
const POST_EMAIL=220;
const POST_NAME=230;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  profile:any
  name:any
  currentPhone:any
  currentEmail:any
  currentName:any
  phone:any
  email:any
  type:any
  client_id:any
  countries:any
  countryCodeSelected:any
  new_phone:any
  isPhoneValid:boolean=true
  errormsg:any


  constructor(private modalController:ModalController,private toastController:ToastController,
    private loadingController:LoadingController,
    private profileService:ProfileService,
    private router:Router,
    private authservice:AuthenticationService,
    private countryCodeService:CountryCodeService) {

    this.getData()
    this.countries = this.countryCodeService.getCountryCodes();
    this.authservice.isAuthenticated().then(val=>{
      if(val)
      {
        this.client_id = val
      }
    })
   }
  
  ngOnInit() {
  }
 
  getData() {
    this.presentLoading().then(()=>{
    this.authservice.isAuthenticated().then(val=>{
      if(val)
      {
        this.profileService.getProfileDetails(val).subscribe(
          (data) => this.handleResponseData(data,GET_DATA),
          (error) => this.handleResponseError(error)
        )
      }
      else{
        this.profileService.getProfileDetails(null).subscribe(
          (data) => this.handleResponseData(data,GET_DATA),
          (error) => this.handleResponseError(error)
        )
      }
    })
      
    }
    )
  }

  updateName()
  {
    if(this.currentName == this.name)
    {
      this.toastError("Please change the Name to update")
    }
    else
    {
          let data={
            client_id:this.client_id,
            name:this.name
          }
          this.profileService.updateName(data).subscribe(
            (data)=>this.handleResponseData(data,POST_NAME),
            (error) => this.handleResponseError(error)
          )
          this.getData()
    }
   
    
  }

  updatePhone()
  {
    this.new_phone = this.countryCodeSelected + this.phone
    if(this.currentPhone == this.new_phone)
    {
      this.toastError("Please change the mobile number to update")
    }
    else if(this.isPhoneValid)
    {
      let code = this.countryCodeSelected.substring(1)
      this.authservice.isAuthenticated().then(val=>{
        if(val)
        {
          let data={
            client_id:val,
            phone:this.phone,
            country_code:code
          }
          this.profileService.updatePhone(data).subscribe(
            (data)=>this.handleResponseData(data,POST_PHONE),
            (error) => this.handleResponseError(error)
          )
          this.getData()
        }
      })

      // this.type = "phone"
      // let phoneNo = this.phone
      // this.router.navigate(['profile-otp',{phoneNo}])
    }
    else
    {
      this.toastError("Invalid mobile number")
    }
   
  }
  updateEmail()
  {
    if(this.currentEmail == this.email)
    {
      this.toastError("Please change the email to update")
    }
    else if(this.validateEmail(this.email))
    {
      this.authservice.isAuthenticated().then(val=>{
        if(val)
        {
          let data={
            client_id:val,
            email:this.email
          }
          this.profileService.updateEmail(data).subscribe(
            (data)=>this.handleResponseData(data,POST_EMAIL),
            (error) => this.handleResponseError(error)
          )
          this.type = "mail"
            let Email = this.email
          this.router.navigate(['profile-otp',{Email}])
        }
      })
    }
    else{
      this.toastError("Invalid Email Address")
    }

  }

  validatePhone(phone:any)
  {
    if (/^\d{9}$/.test(phone)) 
    {
      return true;
    }
    else
    {
      return false;
    }

  }

  validateEmail(email:any)
  {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(email) == false) 
    {
        
        return (false);
    }
    else{
      return true
    }
  }

  handleResponseData(data,type)
  {
    if(type==GET_DATA)
    {
      this.loadingController.dismiss().then(()=>{
        this.profile = data.client_Details
        this.name = this.profile?.name
        
        this.email = this.profile?.email
        this.phone = this.profile?.phone
        this.currentEmail = this.profile?.email
        this.currentName = this.profile?.name
        this.countryCodeSelected = "+" + this.profile?.country_code
        console.log(this.countryCodeSelected)
        this.currentPhone = this.countryCodeSelected + this.profile?.phone
        console.log(this.currentPhone)

      })  
    }
    else if(type == POST_NAME){
      this.getData()
    }
    else{
      // console.log(data)
    }
  }

  handleResponseError(error)
  {
    this.loadingController.dismiss()
  }

  onCountryChange(event) {
    this.countryCodeSelected = event.detail.value;
    let code = this.countryCodeSelected.substring(1);

    let phone = event.detail.value + this.phone;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
      this.errormsg = null;
    } else if (!this.isPhoneValid && this.phone) {
      this.errormsg = "Phone number is invalid";
    }
  }

  onPhoneChange(event) {
    let phone = this.countryCodeSelected + event.detail.value;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
      console.log(this.isPhoneValid);
      this.errormsg = null;
    } else {
      this.errormsg = "Phone number is invalid";
    }
  }

  async toastError(msg) {
    const toast = await this.toastController.create({
      color: "dark",

      message: msg,
      duration: 1000,
      mode: "ios",
      cssClass: "my-custom-toast",
      position: "bottom",
    });
    toast.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }
}
