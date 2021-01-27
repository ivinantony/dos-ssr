import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { AddAddressPage } from "../add-address/add-address.page";
declare var google;

@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.page.html',
  styleUrls: ['./address-modal.page.scss'],
})
export class AddressModalPage implements OnInit {
addresses:any
selectedAddress: any;
  constructor(private modalController:ModalController,
    private addressService:AddressService,private loadingController:LoadingController) 
    { 
    this.getData()
    }

  ngOnInit() {
  }

  getData()
  {
    this.presentLoading().then(()=>{
      let client_id = Number(localStorage.getItem('client_id'))
      this.addressService.getAddress(client_id).subscribe(
        (data)=>this.handleResponse(data),
        (error)=>this.handleError(error)
      )
    })
  }

  handleResponse(data)
  {
    this.loadingController.dismiss()
    console.log(data)
    this.addresses = data.addresses
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    console.log(error)
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().finally(() => {
      this.getData();
    });
    return await modal.present();
  }

  close()
  {
    this.modalController.dismiss()
  }

  onChangeAddress($event) {
    let current_selection
    current_selection = $event.detail.value;
    let address_selected = this.addresses[current_selection]

    console.log(current_selection, "current selected address");
    localStorage.setItem("address_id",this.addresses[current_selection].id);
    this.modalController.dismiss(address_selected,current_selection)
    // this.getDistance(
    //   this.data.address[this.current_selection].latitude,
    //   this.data.address[this.current_selection].longitude
    // );
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

}
