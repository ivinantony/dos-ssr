import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
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
  constructor(
    public router: Router,
    private loadingController: LoadingController,
    private walletService: WalletService,
    private authservice: AuthenticationService
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
   
    console.log(data);
    this.walletDetails = data.client_details; 
    this.loadingController.dismiss();
  }
  handleError(error) {
    this.loadingController.dismiss();

    console.log(error);
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
}
