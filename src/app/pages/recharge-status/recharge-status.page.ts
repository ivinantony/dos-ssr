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
    this.presentLoading().then(() => {
      this.paymentService.confirmPayment(tran_ref, client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
    // this.presentLoading().then(() => {
    //   this.paymentService.confirmPayment(tran_ref, client_id).subscribe(
    //     (data) => this.handleResponse(data),
    //     (error) => this.handleError(error)
    //   );
    // });
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
            this.router.navigate(["wallet"], { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }

  continue() {
    this.storage.get("prev_url").then((val) => {
      // console.log(val,"prev url")
      this.ngZone.run(() => {
        this.router.navigate([val] || ["/wallet"], { replaceUrl: true });
      });
    });
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
