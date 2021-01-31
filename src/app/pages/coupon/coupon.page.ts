import { Component, Input, OnInit } from "@angular/core";
import {
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { PromoService } from "src/app/services/promo/promo.service";
const GET_CODES = 200;
@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.page.html",
  styleUrls: ["./coupon.page.scss"],
})
export class CouponPage implements OnInit {
  @Input() totalAmount: any;
  promoSelected: any;
  data: any;
  applicableCoupons: Array<any> = [];
  coupons: Array<any> = [];
  constructor(
    private modalController: ModalController,
    private promoService: PromoService,
    private toastController: ToastController,
    private loadingController: LoadingController,
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
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.promoService.getPromoCodes(val).subscribe(
            (data) => this.handleResponse(data, GET_CODES),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  apply(i) {
    let data = {
      promo_Id: this.applicableCoupons[i].id,
      discount_amount: this.applicableCoupons[i].discount_amount,
    };
    this.modalController.dismiss(data);
    this.showToastSuccess("Coupon applied successfully");
  }

  handleResponse(data, type) {
    if (type == GET_CODES) {
      this.loadingController.dismiss().then(() => {
        this.data = data;
        this.data.promo_codes.filter((item) => {
          if (item.minimum_amount <= this.totalAmount) {
            this.applicableCoupons.push(item);
          } else {
            this.coupons.push(item);
          }
        });
      });
    }
  }

  handleError(error) {
    // console.log(error)
  }

  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "top",
      color: "dark",
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
