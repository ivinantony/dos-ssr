import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocationmodelPage } from '../locationmodel/locationmodel.page';



@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  deliveryLocations:Array<any>=[]
  public addressForm:FormGroup;
  selectedDeliveryLocationId:any;
  constructor(private formBuilder:FormBuilder,private addressService:AddressService,
    private modalController:ModalController,private authservice:AuthenticationService) 
  { 
    this.addressForm = this.formBuilder.group({
      client_id: [""],
      name: [ "",Validators.compose([Validators.required, Validators.minLength(3)])],
      full_address: ["", Validators.required],
      state:["",Validators.compose([Validators.required])],
      landmark: [""],
      country: ["",Validators.required],
      alternate_phone: ["",Validators.compose([Validators.maxLength(9),Validators.minLength(9),Validators.pattern("[0-9]*"),]),],
      phone: ["",Validators.compose([Validators.required,Validators.maxLength(9),Validators.minLength(9),Validators.pattern("[0-9]*"),]),],
      delivery_location_id: ["",Validators.required],
      zip_code: ["",Validators.compose([Validators.required,Validators.maxLength(6),Validators.minLength(6),Validators.pattern("[0-9]*")])],
    });

    this.authservice.isAuthenticated().then((val)=>{
      this.addressForm.controls['client_id'].setValue(val);
    })
  
  }

  ngOnInit() {
  }

  close()
  {
    this.modalController.dismiss()
  }

  validation_messages = {
    full_address: [
      { type: "required", message: "House details are required." },
    ],
    name: [
      { type: "required", message: "Name is required." },
      {
        type: "minlength",
        message: "Name must be at least 3 letters long.",
      },
    ],
    state: 
    [
      { type: "required", message: "State / Province is required." }
    ],
    country: 
    [
      { type: "required", message: "Country is required." }
    ],
    alternate_phone: 
    [
      {
        type: "minlength",
        message: "Mobile number must be at least 9 digit.",
      },
      {
        type: "maxlength",
        message: "Mobile number cannot be more than 9 digit.",
      },
      {
        type: "pattern",
        message: "Your Mobile number must contain only numbers.",
      },
    ],
    phone: 
    [
      { type: "required", message: "Phone number is required." },
      {
        type: "minlength",
        message: "Mobile number must be at least 9 digit.",
      },
      {
        type: "maxlength",
        message: "Mobile number cannot be more than 9 digit.",
      },
      {
        type: "pattern",
        message: "Your Mobile number must contain only numbers.",
      },
    ],
    zip_code: 
    [
      { type: "required", message: "Zip code is required." },
      {
        type: "minlength",
        message: "Zip code must be 6 digits.",
      },
      {
        type: "maxlength",
        message: "Zip code cannot be more than 6 digits.",
      },
      {
        type: "pattern",
        message: "Zip code must contain only numbers.",
      },
    ],
  };

  async selectDeliveryLocation() {
    const modal = await this.modalController.create({
      component: LocationmodelPage,
      cssClass: 'my-custom-class',
      // presentingElement: await this.modalController.getTop(),
    });

    modal.onDidDismiss().then((data) => {
      if(data.data)
      {
      console.log(data)
      this.addressForm.controls['delivery_location_id'].setValue(data.data);
      }
    });
    return await modal.present();
  }

  onSubmit()
  {
    this.addressService.addAddress(this.addressForm.value).subscribe( 
    (data)=>this.handleResponse(data),
    (error)=>this.handleError(error))
    console.log(this.addressForm.value)
  }
  
  handleResponse(data)
  {
    console.log(data)
    this.modalController.dismiss()
  }
  handleError(error)
  {
    console.log(error)
  }
}
