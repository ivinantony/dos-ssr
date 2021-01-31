import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  NavController,
  ToastController,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { ProfileService } from "src/app/services/profile/profile.service";
const GET_DATA = 200;
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user: any;
  constructor(
    private authService: AuthenticationService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private profileService: ProfileService,
    private authservice: AuthenticationService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getData();
  }
  logout() {
    this.authService.logout().then(() => {
      this.authService.loginStatus(false)
      this.presentToast().finally(() => {
        this.navCtrl.back();
      });
    });
  }

  getData() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.profileService.getProfileDetails(val).subscribe(
            (data) => this.handleResponse(data, GET_DATA),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data, type) {
    if (type == GET_DATA) {
      this.loadingController.dismiss();
      this.user = data.client_Details;
    }

    // console.log(this.user)
  }
  handleError(error) {
    this.loadingController.dismiss();
    // console.log(error)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait... ",
      spinner: "crescent",
    });
    await loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Logged out Succesfully",
      cssClass: "custom-toast",
      duration: 2000,
    });
    toast.present();
  }

  goToSettings() {
    this.router.navigate(["edit-profile"]);
  }
  goToAddresses() {
    this.router.navigate(["my-addresses"]);
  }
  goToOrders() {
    this.router.navigate(["orders"]);
  }
  goToWallet() {
    this.router.navigate(["wallet"]);
  }
  notification() {
    this.router.navigate(["notification"]);
  }
  help() {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=dealonstoreuae@gmail.com"
    );
  }
}
