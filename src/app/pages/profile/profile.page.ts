import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
const GET_DATA=200;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user:any
  constructor(private authService: AuthenticationService,
  private navCtrl: NavController, private loadingController: LoadingController, 
  private toastController: ToastController,private router:Router,private profileService:ProfileService) 
  {
    
  }

  ionViewWillEnter(){
    this.getData()
  }

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

  getData()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.profileService.getProfileDetails(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    this.user = data.client_Details
    console.log(this.user)
  }
  handleError(error)
  {
    console.log(error)
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

  goToSettings()
  {
    this.router.navigate(['edit-profile'])
  }
  goToAddresses()
  {
    this.router.navigate(['my-addresses'])
  }
  goToOrders()
  {
    this.router.navigate(['orders'])
  }
}
