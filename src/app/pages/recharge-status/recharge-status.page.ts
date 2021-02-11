import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PaymentService } from "src/app/services/payment/payment.service";

@Component({
  selector: "app-recharge-status",
  templateUrl: "./recharge-status.page.html",
  styleUrls: ["./recharge-status.page.scss"],
})
export class RechargeStatusPage implements OnInit {
  status: boolean;
  isPWA: boolean = false;
  incoming_platform:any

  constructor(
    private storage: Storage,
    private platform: Platform,
    private paymentService: PaymentService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private ngZone: NgZone,
    private authservice: AuthenticationService
  ) {
    if (!this.platform.is("cordova")) {
      this.isPWA = true;
      // console.log("is platform pwa", this.isPWA);
    }
  }

  ngOnInit() {
    let data = JSON.parse(localStorage.getItem("tran_data"));
    let tran_ref = data.tran_ref;
    let client_id = data.client_id;
    this.incoming_platform = data.incoming_platform
    this.presentLoading().then(() => {
      this.paymentService.confirmPayment(tran_ref, client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();

    if (data.details == null) {
      this.status = false;
      let msg = "Unknown Error";
      this.presentAlert(msg);
    } else if (data.details.response_status == "A") {
      this.status = true;
    } else if (data.details.response_status != "A") {
      this.status = false;
      this.presentAlert(data.details.response_message);
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Recharge Failed",

      message: msg,
      buttons: [
        {
          text: "OK",
          handler: () => {
            localStorage.clear();
            if(this.incoming_platform == 'cordova'){
              window.open("dos://dealonstore.com", "_blank");
            }
            else{
              this.router.navigate(["/tabs/home"], { replaceUrl: true });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  continue() {
    localStorage.clear();
    if(this.incoming_platform == 'cordova'){
      window.open("dos://dealonstore.com", "_blank");
    }
    else{
      this.router.navigate(["/tabs/home"], { replaceUrl: true });
    }
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
