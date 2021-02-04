import { Component, OnInit } from "@angular/core";
import { ActionSheetController, ModalController } from "@ionic/angular";
import { AddressService } from "src/app/services/address/address.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { AddAddressPage } from "../add-address/add-address.page";
import { EditAddressPage } from "../edit-address/edit-address.page";
const GET_ADDRESS = 200;
const POST_DATA = 210;
@Component({
  selector: "app-my-addresses",
  templateUrl: "./my-addresses.page.html",
  styleUrls: ["./my-addresses.page.scss"],
})
export class MyAddressesPage implements OnInit {
  addresses: any;
  constructor(
    private addressService: AddressService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private authservice: AuthenticationService,
  ) {}

  ionViewWillEnter() {
    this.getAddress();
  }

  ngOnInit() {}

  getAddress() {
    this.authservice.isAuthenticated().then((val) => {
      if (val) {
        this.addressService.getAddress(val).subscribe(
          (data) => this.handleResponse(data, GET_ADDRESS),
          (error) => this.handleError(error)
        );
      }
    });
  }

  handleResponse(data, type) {
    if (type == GET_ADDRESS) {
      this.addresses = data.addresses;
    }
  }
  
  handleError(error) {
    // console.log(error)
  }

  selectOptions(index: number) {
    this.presentActionSheet(index);
  }

  async presentActionSheet(index: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Edit",
          icon: "create-outline",
          handler: () => {
            this.navigateToEditAddress(this.addresses[index].id);
          },
        },
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {
            this.addressService
              .deleteAddress(this.addresses[index].id)
              .subscribe(
                (data) => this.handleResponse(data, POST_DATA),
                (error) => this.handleError(error)
              );
            this.addresses.splice(index, 1);
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async navigateToAddAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl,
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().finally(() => {
      this.getAddress();
    });
    return await modal.present();
  }

  async navigateToEditAddress(id: any) {
    const modal = await this.modalController.create({
      component: EditAddressPage,
      swipeToClose: true,
      cssClass: "my-custom-class",
      componentProps: { address_id: id },
    });

    modal.onDidDismiss().finally(() => {
      this.getAddress();
    });
    return await modal.present();
  }
}
