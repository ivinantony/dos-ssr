import { Component, OnInit } from "@angular/core";
import { LoadingController, ModalController } from "@ionic/angular";
import { AddressService } from "src/app/services/address/address.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AddAddressPage } from "../add-address/add-address.page";
declare var google;

@Component({
  selector: "app-address-modal",
  templateUrl: "./address-modal.page.html",
  styleUrls: ["./address-modal.page.scss"],
})
export class AddressModalPage implements OnInit {
  addresses: any;
  selectedAddress: any;
  constructor(
    private modalController: ModalController,
    private authservice: AuthenticationService,
    private addressService: AddressService,
    private loadingController: LoadingController
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
      this.authservice.isAuthenticated().then((token) => {
        if (token) {
          this.addressService.getAddress(token).subscribe(
            (data) => this.handleResponse(data),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss().then(() => {
      this.addresses = data.addresses;
    });
  }
  handleError(error) {
    this.loadingController.dismiss();
    console.log(error);
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then(() => {
      this.getData();
    });

    return await modal.present();
  }

  close() {
    this.modalController.dismiss();
  }

  onChangeAddress($event) {
    let current_selection;
    current_selection = $event.detail.value;
    let address_selected = this.addresses[current_selection];
    this.modalController.dismiss(address_selected);
 
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
