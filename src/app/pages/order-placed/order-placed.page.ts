import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartcountService } from "src/app/cartcount.service";
import { defineCustomElements } from "@teamhive/lottie-player/loader";
import { PaymentService } from "src/app/services/payment/payment.service";
import { Storage } from "@ionic/storage";
import { AlertController, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-order-placed",
  templateUrl: "./order-placed.page.html",
  styleUrls: ["./order-placed.page.scss"],
})
export class OrderPlacedPage implements OnInit {
  client_id: any;
  ref: any;
  status: boolean;
  constructor(
    public router: Router,
    private cartCountService: CartcountService,
    private paymentService: PaymentService,
    private storage: Storage,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {

   
  }

  ngOnInit() {
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    console.log(data);

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

    console.log(error);
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
            this.router.navigate(["/tabs/cart"]);
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
