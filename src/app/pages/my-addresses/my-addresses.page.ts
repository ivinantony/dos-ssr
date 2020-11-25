import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { AddAddressPage } from '../add-address/add-address.page';
import { EditAddressPage } from '../edit-address/edit-address.page';
const GET_ADDRESS= 200;
const POST_DATA = 210;
@Component({
  selector: 'app-my-addresses',
  templateUrl: './my-addresses.page.html',
  styleUrls: ['./my-addresses.page.scss'],
})
export class MyAddressesPage implements OnInit {
addresses:any
  constructor(private addressService:AddressService,private actionSheetController:ActionSheetController,private router:Router,
    private modalController:ModalController) 
  { 
    this.getAddress()
  }

  ngOnInit() {
  }

  getAddress()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.addressService.getAddress(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_ADDRESS),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_ADDRESS)
    {
      
      this.addresses = data.addresses
      console.log(this.addresses)
    }
    
  }
  handleError(error)
  {
    console.log(error)
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
            localStorage.setItem('address_id',this.addresses[index].id)
            this.navigateToEditAddress()
          },
        },
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {
            
            this.addressService.deleteAddress(this.addresses[index].id).subscribe(
              (data) => this.handleResponse(data, POST_DATA),
              (error) => this.handleError(error)
            );
            this.addresses.splice(index,1)
          },
        },
      ],
    });
    await actionSheet.present();
  }

 async navigateToAddAddress()
  {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async navigateToEditAddress()
  {
    const modal = await this.modalController.create({
      component: EditAddressPage,
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }



}




