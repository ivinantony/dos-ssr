import { Component, OnInit, ɵConsole } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { PaymentService } from "src/app/services/payment/payment.service";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Storage } from "@ionic/storage";
import { DomSanitizer } from "@angular/platform-browser";
import { PaytabsPage } from "../paytabs/paytabs.page";
import { AuthenticationService } from "src/app/services/authentication.service";

const POST_DATA = 200;
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
  order_id:any
  address_id:any
  total_amount:any
  constructor(
    private pay: PaymentService,
    public router: Router,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private platform: Platform,
    private iab: InAppBrowser,
    private storage: Storage,
    private authservice:AuthenticationService,

  ) {
    this.storage.get("total_amount").then((val) => {
      this.paymentAmount = val;
    });

    // this.paypal()
  }

  ngOnInit() {}

  hostedSubmit() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then(val=>{
        if(val)
        console.log(val,"value of is authenticated")
        {
          this.storage.get('order_id').then(val=>{
            this.order_id = val
          })
          this.storage.get('address_id').then(val=>{
            this.address_id = val
          })
          this.storage.get('total_amount').then(val=>{
            this.total_amount = val
          })
          let data = {
            client_id: val,
            payable_order_id: this.order_id,
            payable_amount: this.total_amount,
            address_id:this.address_id,
          };
          this.pay.hostedPay(data).subscribe(
            (data) => this.handleResponse(data),
            (error) => this.handleError(error)
          );
        }
      })
     
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    console.log("data n Tab3", data);
    this.response = data;
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
      // browser.insertCSS({ code: "body{color: red;" });
    });

    // browser.close();
  }

  openApp() {
    window.location.href = "dealonstore://myparam";
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
