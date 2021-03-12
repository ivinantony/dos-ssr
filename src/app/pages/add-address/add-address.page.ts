import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CountryCallingCode } from 'libphonenumber-js';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CountryCodeService } from 'src/app/services/countryCode/country-code.service';
import { LocationmodelPage } from '../locationmodel/locationmodel.page';
import {isValidPhoneNumber } from "libphonenumber-js";


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  deliveryLocations:Array<any>=[]
  public addressForm:FormGroup;
  selectedDeliveryLocationId:any;
  countries:any
  code:any
  isPhoneValid:any
  errormsg: any;
  alterrormsg: any;
  addressSelected:boolean=false
  loc_selected:any;
  constructor(private formBuilder:FormBuilder,private addressService:AddressService,
    private modalController:ModalController,private authservice:AuthenticationService,
    private countryCodeService:CountryCodeService) 
  { 
    this.addressForm = this.formBuilder.group({
      client_id: [""],
      name: [ "",Validators.compose([Validators.required, Validators.minLength(3)])],
      full_address: ["", Validators.required],
      state:["",Validators.compose([Validators.required])],
      landmark: [""],
      country: ["",Validators.required],
      alternate_phone: ["",Validators.pattern("[0-9]*")],
      phone: ["",Validators.compose([Validators.pattern("[0-9]*"),Validators.required])],
      delivery_location_id: ["",Validators.required],
      zip_code: ["",Validators.compose([Validators.maxLength(6),Validators.minLength(6),Validators.pattern("[0-9]*")])],
      phone_country_code: [""],
    });

    this.authservice.isAuthenticated().then((val)=>{
      this.addressForm.controls['client_id'].setValue(val);
    })

    this.countries = this.countryCodeService.getCountryCodes()
  
  }

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }

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
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
    });

    modal.onDidDismiss().then((data) => {
      if(data.data)
      {
      this.addressSelected = true
    
      this.addressForm.controls['delivery_location_id'].setValue(data.data.id);
      this.loc_selected = data.data.location 
      }
    });
    return await modal.present();
  }

  onSubmit()
  {
    this.addressService.addAddress(this.addressForm.value).subscribe( 
    (data)=>this.handleResponse(data),
    (error)=>this.handleError(error))
 
  }

  onCountryChange(event) {
    this.code = event.detail.value;
    let code = this.code.substring(1);
    this.addressForm.controls["phone_country_code"].setValue(code);
    let phone = event.detail.value + this.addressForm.value.phone;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
      this.errormsg = null;
    } else if (!this.isPhoneValid && this.addressForm.value.phone) {
      this.errormsg = "Phone number is invalid";
    }
  }

  onPhoneChange(event) {
    let phone = this.code + event.detail.value;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
     
      this.errormsg = null;
    } else {
      this.errormsg = "Phone number is invalid";
    }
  }

  onAltPhoneChange(event) {
    
    let phone = this.code + event.detail.value;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
      
      this.alterrormsg = null;
    } else {
      this.alterrormsg = "Phone number is invalid";
    }
  }

  
  
  handleResponse(data)
  {

    this.modalController.dismiss()
  }
  handleError(error)
  {
    // console.log(error)
  }
}
