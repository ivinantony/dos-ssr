import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { defineCustomElements } from "@teamhive/lottie-player/loader";
import { PaymentService } from "src/app/services/payment/payment.service";
import { AlertController, LoadingController, ModalController, Platform } from "@ionic/angular";
import { SuccessfulPage } from "../successful/successful.page";


@Component({
  selector: "app-order-placed",
  templateUrl: "./order-placed.page.html",
  styleUrls: ["./order-placed.page.scss"],
})
export class OrderPlacedPage implements OnInit {
  status: boolean;
  isPWA: boolean = false;
  incoming_platform:any
  constructor(
    public router: Router,
    private paymentService: PaymentService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private platform: Platform,
    private ngzone: NgZone,
    private modalController:ModalController
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
    this.incoming_platform = data.incoming_platform
    this.presentLoading().then(() => {
      this.paymentService.confirmPayment(tran_ref, client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
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

  handleResponse(data) {
    this.loadingController.dismiss();

    if (data.details == null) {
      this.status = false;
      let msg = "Unknown Error";
      this.presentAlert(msg);
    } else if (data.details.response_status == "A") {
      this.status = true;
      this.presentSuccessModal()
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }
  async presentSuccessModal() {
    const modal = await this.modalController.create({
      component: SuccessfulPage,
      cssClass: 'my-custom-class'
    });

    modal.onDidDismiss().then(()=>{
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
      // this.navController.navigateRoot('tabs/home')
    })
    return await modal.present();
  }
}
