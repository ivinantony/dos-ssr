import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile/profile.service';
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
  constructor(private modalController:ModalController,private toastController:ToastController,private loadingController:LoadingController,
    private profileService:ProfileService,private router:Router) {
    this.getData()
   }
  ionViewWillEnter()
  {
    console.log("hello")
  }
  ngOnInit() {
  }
  getData()
  { this.presentLoading()
    this.profileService.getProfileDetails(Number(localStorage.getItem('client_id'))).subscribe(
      (data)=>this.handleResponseData(data,GET_DATA),
      (error) => this.handleResponseError(error)
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
      console.log(this.name)
      let data={
        client_id:Number(localStorage.getItem('client_id')),
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
    if(this.currentPhone == this.phone)
    {
      this.toastError("Please change the mobile number to update")
    }
    else if(this.validatePhone(this.phone))
    {
      let data={
        client_id:Number(localStorage.getItem('client_id')),
        phone:this.phone
      }
      this.profileService.updatePhone(data).subscribe(
        (data)=>this.handleResponseData(data,POST_PHONE),
        (error) => this.handleResponseError(error)
      )
      this.type = "phone"
      let phoneNo = this.phone
      this.router.navigate(['profile-otp',{phoneNo}])
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
      let data={
        client_id:Number(localStorage.getItem('client_id')),
        email:this.email
      }
      this.profileService.updateEmail(data).subscribe(
        (data)=>this.handleResponseData(data,POST_EMAIL),
        (error) => this.handleResponseError(error)
      )
      this.type = "mail"
        let Email = this.email
      this.router.navigate(['profile-otp',{Email}])
      // this.presentModal(this.type)
    }
    else{
      this.toastError("Invalid Email Address")
    }

  }

  handleResponseData(data,type)
  {
    if(type==GET_DATA)
    {
      console.log(data)
      this.profile = data.client_Details
      this.name = this.profile?.name
      this.phone = this.profile?.phone
      this.email = this.profile?.email
      this.currentPhone = this.profile?.phone
      this.currentEmail = this.profile?.email
      this.currentName = this.profile?.name
     
    }
    else if(type == POST_NAME){
      console.log(data)
      this.getData()
    }
    else{
      console.log(data)
    }
  }
  handleResponseError(error)
  {
    console.log(error)
  }


  // async presentModal(type) {
  //   const modal = await this.modalController.create({
  //     component: "he",
  //     cssClass: 'modal-class',
  //     componentProps: {
  //       type : type,
        
  //     }
  //   });
  //    modal.onDidDismiss().finally(()=>{
  //     this.getData()
  //   })
  //   return await modal.present();
   
  // }

 
  async toastError(msg) {
    const toast = await this.toastController.create({
      color: "danger",

      message: msg,
      duration: 1000,
      mode: "ios",
      cssClass: "my-custom-toast",
      position: "middle",
    });
    toast.present();
  }

  validatePhone(phone:any)
  {
    if (/^\d{10}$/.test(phone)) 
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
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
