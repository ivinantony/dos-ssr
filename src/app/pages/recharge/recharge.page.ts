import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, Platform, ToastController } from "@ionic/angular";
import { PaymentService } from "src/app/services/payment/payment.service";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: "app-recharge",
  templateUrl: "./recharge.page.html",
  styleUrls: ["./recharge.page.scss"],
})
export class RechargePage implements OnInit {
  inputAmount: number = null;
  balance: number = 0;
  temp: number;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private storage: Storage,
    private platform:Platform,
    private iab:InAppBrowser,
    private pay:PaymentService,
    private toastController:ToastController
  ) {
    let amount = activatedRoute.snapshot.params.balance;
    if(amount)
    {
    this.inputAmount = activatedRoute.snapshot.params.balance;

    }
    console.log(this.inputAmount)
    // if(this.temp)
    // {
    //   console.log("hello")
    //   this.inputAmount = this.balance

    // }
  }

  ngOnInit() {}

  recharge() {
    // console.log(inputAmount)
    if(this.inputAmount == 0)
    {
      this.presentToast("Enter a valid Amount")
    }
    else{
      let amount = this.inputAmount.toString();
      localStorage.setItem("total_amount", amount);
      this.hostedSubmit()
    }
    

    // let type = "recharge";
    // this.router.navigate(["checkout-pay", { type }]);
  }

  hostedSubmit() {
    this.presentLoading().then(() => {
      let data = {
        client_id:(localStorage.getItem("client_id")),
        amount: localStorage.getItem("total_amount"),
      };
      this.pay.wallet_hostedPay(data).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    console.log("data n Tab3", data);
    this.storage.set("tran_ref", data.tran_ref).then(() => {
      this.openUrl(data.redirect_url);
    });
  }

  handleError(error) {
    // console.log('error in Tab3', error)
    this.loadingController.dismiss();
  }

  openUrl(url) {
    if (!this.platform.is("cordova")) {
      window.open(url, "_self");
      return;
    }
    const browser = this.iab.create(url, "_self");

    browser.on("loadstop").subscribe((event) => {
      browser.insertCSS({ code: "body{color: red;" });
    });

    // browser.close();
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
      cssClass: "custom-toast-success",
      position: "top",
      color:"danger",
      duration: 1500,
    });
    toast.present();
  }
}
