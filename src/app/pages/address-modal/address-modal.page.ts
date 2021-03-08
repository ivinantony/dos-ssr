import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AddAddressPage } from "../add-address/add-address.page";
declare var google;
const GET_DATA=100;
const DELETE_DATA=110;
const POST_DATA=120;
@Component({
  selector: 'app-address-modal',
  templateUrl: './address-modal.page.html',
  styleUrls: ['./address-modal.page.scss'],
})
export class AddressModalPage implements OnInit {
addresses:any
selectedAddress: any;
delivery_location:Array<any>=[]
valid_del_loc_id:Array<any>=[]
  constructor(private modalController:ModalController,
    private addressService:AddressService,private loadingController:LoadingController,
    private authservice:AuthenticationService,
    private actionSheetController:ActionSheetController,
    private alertController:AlertController) 
    { 
    this.getData()
    }

  ngOnInit() {
    
  }

  getData()
  {
    this.presentLoading().then(()=>{
      this.authservice.isAuthenticated().then(val=>{
        if(val){
           this.addressService.getAddress(val).subscribe(
          (data)=>this.handleResponse(data,GET_DATA),
          (error)=>this.handleError(error)
        )
        }
       
      })
     
    })
  }

  handleResponse(data,type)
  {
    if(type==GET_DATA){
      console.log(data)
      this.loadingController.dismiss()
      // console.log(data)
      this.addresses = data.addresses
      this.delivery_location = data.delivery_locations
      
      this.delivery_location.filter((loc)=>{
        this.valid_del_loc_id.push(loc.id)
      })
      console.log(this.valid_del_loc_id)
    }
    else if(type==DELETE_DATA){
      // console.log(data)
    }
     
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
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

  async options(index: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {
            this.presentAlertConfirm(index)
          },
        },
      ],
    });
    await actionSheet.present();
  }
  close()
  {
    this.modalController.dismiss()
  }
  onChangeAddress(event){
    console.log(event.detail.value)
console.log(this.addresses[event.detail.value])
    this.modalController.dismiss(this.addresses[event.detail.value])
  }

  // onChangeAddress(index:number) {
  //   let current_selection = index;
  //   let address_selected = this.addresses[current_selection]
  //   this.modalController.dismiss(address_selected)
  
  // }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

  async presentAlertConfirm(index:number) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete',
      message: 'Do you want to remove the selected address.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Delete',
          handler: () => {
            this.addressService
              .deleteAddress(this.addresses[index].id)
              .subscribe(
                (data) => this.handleResponse(data, POST_DATA),
                (error) => this.handleError(error)
              );
            this.addresses.splice(index, 1);  
          }
        }
      ]
    });

    await alert.present();
  
}

}
