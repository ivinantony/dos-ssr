import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { WalletService } from "src/app/services/wallet/wallet.service";
const GET_WALLET = 200;

@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.page.html",
  styleUrls: ["./wallet.page.scss"],
})
export class WalletPage implements OnInit {
  walletDetails: any;
  transaction_details:any
  constructor(
    public router: Router,
    private loadingController: LoadingController,
    private walletService: WalletService,
    private authservice: AuthenticationService,
    private toastController:ToastController
  ) {}

  ionViewWillEnter() {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.walletService.getWalletDetails(val).subscribe(
            (data) => this.handleResponse(data, GET_WALLET),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data, type) {
    this.walletDetails = data.client_details; 
    this.transaction_details = data.transaction_details; 
    this.loadingController.dismiss();
  }
  
  handleError(error) {
    this.presentToast(error.error.messgae)
    this.loadingController.dismiss();
  }
  
  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }
}
