import { Component, NgZone, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { VerifyOtpService } from "src/app/services/otp/verify-otp.service";
import { Storage } from "@ionic/storage";
import { CartcountService } from "src/app/cartcount.service";
import { NotcountService } from "src/app/notcount.service";
const POST_OTP = 200;
const RESEND_OTP = 210;
@Component({
  selector: "app-otp",
  templateUrl: "./otp.page.html",
  styleUrls: ["./otp.page.scss"],
})
export class OtpPage implements OnInit {
  inputOtp: number;
  phone: number;
  email: any;
  constructor(
    private otpService: VerifyOtpService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private storage: Storage,
    private ngZone: NgZone,
    private cartCountService: CartcountService,
    private notCountService: NotcountService,
    private router: Router,
    private loadingController: LoadingController
  ) {
    this.phone = this.activatedRoute.snapshot.params.phone;
    this.email = this.activatedRoute.snapshot.params.email;
  }

  ngOnInit() {}

  cancel() {
    this.router.navigate(["login"]);
  }

  resendOtp() {
    var data = {
      email: this.email,
      phone: this.phone,
    };
    this.presentLoading().then(() => {
      this.otpService.resendOtp(data).subscribe(
        (data) => this.handleResponseData(data, RESEND_OTP),
        (error) => this.handleError(error, RESEND_OTP)
      );
    });
  }

  continue() {
    var data = {
      email: this.email,
      otp: this.inputOtp,
      phone: this.phone,
    };

    this.otpService.verifyOtp(data).subscribe(
      (data) => this.handleResponseData(data, POST_OTP),
      (error) => this.handleError(error, POST_OTP)
    );
  }

  handleResponseData(data, type) {
    if (type == POST_OTP) {
      // console.log("haiiiiiiiiiii",data)
      this.authService.login(data.data);
      localStorage.setItem("client_id", data.client_id);
      localStorage.setItem("cart_count", data.cart_count);
      localStorage.setItem("notf_count", data.notification_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.notCountService.setNotCount(data.notification_count);

      this.storage.get("prev_url").then((val) => {
        // console.log(val,"prev url")
        this.ngZone.run(() => {
          this.router.navigate([val] || ["/"], { replaceUrl: true });
        });
      });
    } else if (type == RESEND_OTP) {
      this.loadingController.dismiss();
      let msg = data.message;
      this.presentResendAlert(msg);
    }
  }

  handleError(error, type) {
    if (type == POST_OTP) {
      this.presentAlert("plaease check your OTP.");
    } else {
      this.loadingController.dismiss();
    }
    // console.log(error)
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Invalid OTP",

      message: msg,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async presentResendAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Resend OTP",

      message: msg,
      buttons: ["OK"],
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
