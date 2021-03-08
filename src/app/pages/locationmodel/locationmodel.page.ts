import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-locationmodel',
  templateUrl: './locationmodel.page.html',
  styleUrls: ['./locationmodel.page.scss'],
})
export class LocationmodelPage implements OnInit {
  deliveryLocations:Array<any>=[];
  selectedAddress:any;
  constructor(private addressService:AddressService,private modalController:ModalController) 
  { 
    this.getData()
  }

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
    
  }

  getData() {
    this.addressService.getDeliveryLocations().subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data) {
    this.deliveryLocations = data.delivery_locations;
    console.log("delivery locations",this.deliveryLocations)
  }

  handleError(error) {
    // this.showToast(error.msg)
  }

  onChangeLoc(event) {
    this.selectedAddress = this.deliveryLocations[event.detail.value]
    console.log(this.selectedAddress,"selected address")
    let data={
      
    }
  }

  dismissModal(){
    this.modalController.dismiss()
  }

  onSubmit()
  {
    this.modalController.dismiss(this.selectedAddress)
  }

}
