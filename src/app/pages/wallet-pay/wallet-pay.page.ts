import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-wallet-pay",
  templateUrl: "./wallet-pay.page.html",
  styleUrls: ["./wallet-pay.page.scss"],
})
export class WalletPayPage implements OnInit {
  orderData: any;
  constructor() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const data = urlParams.get("data");

    this.orderData = JSON.parse(data);
  }

  ngOnInit() {}
  async setStorage() {
    await localStorage.setItem("tran_data", JSON.stringify(this.orderData));
  }

  openUrl() {
    window.open(this.orderData.redirect_url, "_self");
  }

  ngAfterViewInit(): void {
    this.setStorage().finally(() => {
      this.openUrl();
    });
  }
}
