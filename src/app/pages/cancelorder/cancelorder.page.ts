import { Component, Input, OnInit } from "@angular/core";
import { LoadingController, ModalController, ToastController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { OrderService } from "src/app/services/order/order.service";

@Component({
  selector: "app-cancelorder",
  templateUrl: "./cancelorder.page.html",
  styleUrls: ["./cancelorder.page.scss"],
})
export class CancelorderPage implements OnInit {
  @Input() order_id: any;
  desc: any;
  constructor(
    private modalController: ModalController,
    private orderService: OrderService,
    private loadingController: LoadingController,
    private authservice: AuthenticationService,
    private toastController:ToastController
  ) {}

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
  }

  close() {
    this.modalController.dismiss();
  }

  cancelOrder() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          let data = {
            description: this.desc,
            client_id: val,
            order_id: this.order_id,
          };
          this.orderService.cancelOrder(data).subscribe(
            (data) => this.handleResponse(data),
            (error) => this.handleError(error)
          );
        } else {
          let data = {
            description: this.desc,
            client_id: null,
            order_id: this.order_id,
          };
          this.orderService.cancelOrder(data).subscribe(
            (data) => this.handleResponse(data),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    this.modalController.dismiss();
    
  }

  handleError(error) {
    this.loadingController.dismiss();
    this.presentToast(error.error.message)
    this.modalController.dismiss();
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
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }
}
