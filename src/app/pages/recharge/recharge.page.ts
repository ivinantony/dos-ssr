import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, Platform, ToastController } from "@ionic/angular";
import { PaymentService } from "src/app/services/payment/payment.service";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { Storage } from "@ionic/storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  selector: "app-recharge",
  templateUrl: "./recharge.page.html",
  styleUrls: ["./recharge.page.scss"],
})
export class RechargePage implements OnInit {
  public rechargeForm: FormGroup;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private storage: Storage,
    private platform: Platform,
    private iab: InAppBrowser,
    private pay: PaymentService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private authservice:AuthenticationService
  ) {

    authservice.isAuthenticated().then(val=>{
      if(val){
        this.rechargeForm = this.formBuilder.group({
          client_id: [val],
          amount: [ "", Validators.compose([Validators.required, Validators.pattern("[0-9]*")]),],
        });
      }
    })
  
    let amount = this.activatedRoute.snapshot.params.balance;
    if (amount) {
      this.rechargeForm.controls["amount"].setValue(amount);
    }
  }

  ngOnInit() {}

  recharge() {
    this.presentLoading().then(() => {
      console.log(this.rechargeForm.value);
      this.storage.set("total_amount",this.rechargeForm.value.amount)
      console.log("form value",this.rechargeForm.value)
      this.pay.wallet_hostedPay(this.rechargeForm.value).subscribe(
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
      color: "dark",
      duration: 1500,
    });
    toast.present();
  }
}
