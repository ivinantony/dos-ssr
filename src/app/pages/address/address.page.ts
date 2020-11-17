import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  selectedAddress: any
  constructor(private loadingController: LoadingController, private modalController: ModalController) { }

  ngOnInit() {
  }

  onChangeAddress(index: number) {
    console.log('event', index)
  }
  async addNew() {

    const modal = await this.modalController.create({
      component: AddAddressPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    console.log(data)

  }
  dismissModal() {
    this.modalController.dismiss()
  }
}
