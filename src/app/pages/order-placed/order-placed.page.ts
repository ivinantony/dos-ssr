import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { defineCustomElements } from "@teamhive/lottie-player/loader";
import { PaymentService } from "src/app/services/payment/payment.service";
import { AlertController, LoadingController, Platform } from "@ionic/angular";

@Component({
  selector: "app-order-placed",
  templateUrl: "./order-placed.page.html",
  styleUrls: ["./order-placed.page.scss"],
})
export class OrderPlacedPage implements OnInit {
  status: boolean;
  isPWA: boolean = false;
  constructor(
    public router: Router,
    private paymentService: PaymentService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private ngzone: NgZone
  ) {
    if (!this.platform.is("cordova")) {
      this.isPWA = true;
    }
    defineCustomElements(window);
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
  }
  continue() {
    localStorage.clear();
    setTimeout(() => {
      this.ngzone.run(() => {
        this.router.navigate(["/tabs/home"], { replaceUrl: true });
      });
    }, 25);
    window.open("dos://dealonstore.com", "_blank");
    // window.open('dos://dealonstore.com','_blank');
    // setTimeout(() => {
    //   this.router.navigate(['/tabs/home'],{ replaceUrl: true })
    // }, 1000);
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
      header: "Payment Failed",

      message: msg,
      buttons: [
        {
          text: "OK",
          handler: () => {
            localStorage.clear();
            setTimeout(() => {
              this.ngzone.run(() => {
                this.router.navigate(["/tabs/home"], { replaceUrl: true });
              });
            }, 25);
            window.open("dos://dealonstore.com", "_blank");
          },
        },
      ],
    });

    await alert.present();
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
