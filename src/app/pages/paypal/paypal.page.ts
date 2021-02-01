import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, Platform, ToastController } from "@ionic/angular";
import { PaymentService } from "src/app/services/payment/payment.service";
import {
  InAppBrowser,
  InAppBrowserEvent,
} from "@ionic-native/in-app-browser/ngx";
import { Storage } from "@ionic/storage";
import { AuthenticationService } from "src/app/services/authentication.service";

const POST_DATA = 200;
const CONFIRM = 777;
@Component({
  selector: "app-paypal",
  templateUrl: "./paypal.page.html",
  styleUrls: ["./paypal.page.scss"],
})
export class PaypalPage implements OnInit {
  paymentAmount: string;
  details: any;
  response: any;
  url: any;
  address_id: any;
  client_id: any;
  tran_ref: any;
  private subscription: any;
  constructor(
    private pay: PaymentService,
    public router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private platform: Platform,
    private paymentService: PaymentService,
    private storage: Storage,
    private authservice: AuthenticationService
  ) {
    // this.platform.resume.subscribe(() => {
    //   alert('platfor resumed')
    //   this.router.navigate(['/tabs/home'], { replaceUrl: true })
    // })

    this.storage.get("total_amount").then((val) => {
      if (val) {
        console.log(val);
        this.paymentAmount = val;
      }
    });

    // this.paypal()
  }

  ngOnInit() {}
  ngOnDestroy(): void {
    if (this.platform.is("cordova")) {
    this.subscription.unsubscribe();
    }
  }
  hostedSubmit() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((id) => {
        this.client_id = id;
        if (id) {
          this.storage.get("data_store").then((val) => {
            let localValues = JSON.parse(val);
            let data = {
              client_id: JSON.stringify(id),
              payable_order_id: JSON.stringify(localValues.payable_order_id),
              payable_amount: JSON.stringify(localValues.payable_amount),
              address_id: JSON.stringify(this.address_id),
            };
            console.log("data_store", localValues);
            this.pay.hostedPay(data).subscribe(
              (data) => this.handleResponse(data, POST_DATA),
              (error) => this.handleError(error)
            );
          });
        }
      });
    });
  }

  handleResponse(data, type: any) {
    if (type == POST_DATA) {
      this.response = data;
      this.storage.set("tran_ref", data.tran_ref).then(() => {
        let encodedData = {
          redirect_url: encodeURIComponent(data.redirect_url),
          tran_ref: data.tran_ref,
          client_id: this.client_id,
        };

        var url = `https://arba.mermerapps.com/iframe?data=${JSON.stringify(
          encodedData
        )}`;
        window.open(url, "_self");
        if (this.platform.is("cordova")) {
          this.subscription = this.platform.resume.subscribe(async () => {
            this.storage.get("tran_ref").then((ref) => {
              if (ref) {
                this.paymentService
                  .confirmPayment(ref, this.client_id)
                  .subscribe(
                    (data) => this.handleResponse(data, CONFIRM),
                    (error) => this.handleError(error)
                  );
              }
            });
          });
        }
      });
      this.loadingController.dismiss();
    } else if (type == CONFIRM) {
      if (data.details) {
        if (data.details.response_status == "A") {
          this.router.navigate(["/tabs/home"], { replaceUrl: true });
        } else {
          this.router.navigate(["/tabs/cart"], { replaceUrl: true });
        }
      } else {
        alert("Payment Cancelled.");
      }
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
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
