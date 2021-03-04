import { Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { LocationmodelPage } from '../locationmodel/locationmodel.page';
import {isValidPhoneNumber } from "libphonenumber-js";
import { CountryCodeService } from 'src/app/services/countryCode/country-code.service';
const POST_ADDRESS = 100;
const GET_EDIT_ADDRESS = 110;
@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  @Input() address_id: any;
  deliveryLocations:Array<any>=[]
  public addressForm:FormGroup;
  editAddress:any;
  selectedDeliveryLocationId:any;
  code:any
  countries:any
  isPhoneValid:any
  errormsg:any
  alterrormsg:any
  countryCodeSelected:any
  constructor(private formBuilder:FormBuilder,
    private modalController:ModalController,
    private addressService: AddressService,
    private loadingController:LoadingController,
    private countryCodeService:CountryCodeService,
  ) 
  { 
    this.addressForm = this.formBuilder.group({
      client_id: [""],
      name: [ "",Validators.compose([Validators.required, Validators.minLength(3)])],
      full_address: ["", Validators.required],
      state:["",Validators.compose([Validators.required])],
      landmark: [""],
      country: ["",Validators.required],
      alternate_phone: [""],
      phone: ["",Validators.required],
      delivery_location_id: ["",Validators.required],
      zip_code: ["",Validators.compose([Validators.required,Validators.maxLength(6),Validators.minLength(6),Validators.pattern("[0-9]*")])],
      phone_country_code: [""],
      address_id:[""]
    });
    this.getEditAddress()
    this.countries = this.countryCodeService.getCountryCodes()
  }


  ngOnInit() {
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

  close()
  {
    this.modalController.dismiss()
  }


  async selectDeliveryLocation() {
    const modal = await this.modalController.create({
      component: LocationmodelPage,
      cssClass: 'my-custom-class',
      presentingElement:await this.modalController.getTop()
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

  getEditAddress() {
    
    this.presentLoading().then(()=>{  
      console.log(this.address_id)
        this.addressService.getEditAddress(this.address_id).subscribe(
          (data)=>this.handleResponse(data,GET_EDIT_ADDRESS),
          (error)=>this.handleError(error)
        )
    })
  }

  handleResponse(data,type)
  {   
    if(type == POST_ADDRESS){
      console.log(data)
      this.modalController.dismiss()
    }
    else if(type == GET_EDIT_ADDRESS){
      this.loadingController.dismiss()
      this.editAddress = data.address
      console.log(this.editAddress)
      this.countryCodeSelected = "+" + this.editAddress?.phone_country_code
      this.update()
    }

  }

  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
  }
  
  update()
  {
    this.addressForm.patchValue({name:this.editAddress?.name});
    this.addressForm.patchValue({alternate_phone:this.editAddress?.alternate_phone}); 
    this.addressForm.patchValue({phone:this.editAddress?.phone}); 
    this.addressForm.patchValue({full_address:this.editAddress?.full_address});
    this.addressForm.patchValue({landmark:this.editAddress?.landmark});
    this.addressForm.patchValue({state:this.editAddress?.state});
    this.addressForm.patchValue({country:this.editAddress?.country});
    this.addressForm.patchValue({client_id:this.editAddress?.client_id});
    this.addressForm.patchValue({delivery_location_id:this.editAddress?.delivery_location_id});
    this.addressForm.patchValue({zip_code:this.editAddress?.zip_code});
    this.addressForm.patchValue({address_id:this.editAddress?.id});
    this.addressForm.patchValue({phone_country_code:this.editAddress?.phone_country_code});
    
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
      console.log(this.isPhoneValid);
      this.errormsg = null;
    } else {
      this.errormsg = "Phone number is invalid";
    }
  }

  onAltPhoneChange(event) {
    console.log(event.detail.value)
    let phone = this.code + event.detail.value;
    this.isPhoneValid = isValidPhoneNumber(phone);
    if (this.isPhoneValid) {
      console.log(this.isPhoneValid);
      this.alterrormsg = null;
    } else {
      this.alterrormsg = "Phone number is invalid";
    }
  }


  onSubmit()
  {
    console.log(this.addressForm.value)
    this.addressService.addEditAddress(this.addressForm.value).subscribe(
      (data) => this.handleResponse(data, POST_ADDRESS),
      (error) => this.handleError(error)
    );
  }

}
