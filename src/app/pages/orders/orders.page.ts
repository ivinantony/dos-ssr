import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { OrderService } from "src/app/services/order/order.service";
const GET_DATA = 200;
@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"],
})
export class OrdersPage implements OnInit {
  data: any;
  constructor(
    private orderService: OrderService,
    public router: Router,
    private loadingController: LoadingController,
    private authservice: AuthenticationService
  ) {
    // this.getData()
  }

  ionViewWillEnter() {
    this.getData();
  }

  ngOnInit() {}

  getData() {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.orderService.getOrderDetails(val).subscribe(
            (data) => this.handleResponse(data, GET_DATA),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data, type) {
    this.loadingController.dismiss();
    if (type == GET_DATA) {
      this.data = data;
      // console.log(data)
    }
  }
  handleError(error) {
    this.loadingController.dismiss();
    // console.log(error)
  }

  continueShopping() {
    this.router.navigate(["/tabs/home"]);
  }
  details(index: number) {
    let order_id = this.data.orders[index].id;
    this.router.navigate(["/tabs/order-details", { order_id }]);
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
