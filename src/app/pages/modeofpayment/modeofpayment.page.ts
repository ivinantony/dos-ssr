import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, ModalController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PaymentService } from "src/app/services/payment/payment.service";

const GET_DATA = 210;
const POST_DATA = 220;
@Component({
  selector: "app-modeofpayment",
  templateUrl: "./modeofpayment.page.html",
  styleUrls: ["./modeofpayment.page.scss"],
})
export class ModeofpaymentPage implements OnInit {
  paymentOptions: any;
  constructor(
    public router: Router,
    private paymentservice: PaymentService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private authservice: AuthenticationService
  ) {
    this.getData();
  }
  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
  }

  getData() {
    this.authservice.isAuthenticated().then((val) => {
      if (val) {
        this.paymentservice.getPaymentOptions(val).subscribe(
          (data) => this.handleResponseData(data, GET_DATA),
          (error) => this.handleError(error)
        );
      } else {
        this.paymentservice.getPaymentOptions(null).subscribe(
          (data) => this.handleResponseData(data, GET_DATA),
          (error) => this.handleError(error)
        );
      }
    });
  }

  close() {
    let data = {
      modeOfPayment_Id: null,
    };
    this.modalController.dismiss();
  }

  selectPaymentMethod(i) {
    let data = {
      modeOfPayment_Id: this.paymentOptions.payment_options[i].id,
    };
    this.modalController.dismiss(data);
  }

  handleResponseData(data, type) {
    if (type == GET_DATA) {
      this.paymentOptions = data;
    } else if (type == POST_DATA) {
      // console.log(data)
    }
  }

  handleError(error) {
    // console.log(error)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Please wait...",
      duration: 2000,
    });
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }

}
