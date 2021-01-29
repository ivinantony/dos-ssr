import { Component, Input, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
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
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  cancelOrder() {
    this.presentLoading();
    let data = {
      description: this.desc,
      client_id: localStorage.getItem("client_id"),
      order_id: this.order_id,
    };
    this.orderService.cancelOrder(data).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    this.modalController.dismiss();
    // console.log(data)
  }

  handleError(error) {
    this.loadingController.dismiss();
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
}
