
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AreaSearchPage } from 'src/app/pages/area-search/area-search.page';
import { AddressService } from 'src/app/services/address/address.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilsService } from 'src/app/services/utils.service';
const GET_DELIVERY_LOC = 200;
const POST_ADDRESS = 210;
const GET_EDIT_ADDRESS = 220;
declare var google;

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.page.html',
  styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  latitude: number;
  longitude: number;

  public addressForm: FormGroup;


  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  navController: any;
  locationAvailability:boolean
  delivery_locations:any
  selectedAddress:any
  editAddress:any
  constructor(
    private geolocation: Geolocation,
    private zone: NgZone,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private addressService: AddressService,
    
  ) {
    this.getEditAddress()
    // this.getData()
    

    
    
    
    
    this.addressForm = this.formBuilder.group({
      client_id: [''],
      name:['',Validators.compose([Validators.required,Validators.minLength(3)])],
      address: ['', Validators.required,],
      latitude: [''],
      longitude: [''],
      full_address:['', Validators.required],
      place_id: [''],
      landmark: ['', Validators.required],
      alternate_phone: ['',Validators.compose([Validators.maxLength(9), Validators.minLength(9),Validators.pattern("[0-9]*")]),],
      phone: ['',Validators.compose([Validators.required,Validators.maxLength(9), Validators.minLength(9),Validators.pattern("[0-9]*")]),],
      delivery_location_id:[''],
      address_id:[Number(localStorage.getItem('address_id'))],

    });
    // this.platform.ready().then(() => {
      
    //   this.presentLoading().then(() => {
    //     console.log('presented')
    //     this.loadMap().finally(() => {
    //       this.dismiss()
    //     })
    //   })

    // })
  }
  ngOnInit() {
    // this.authservice.getMemberId().then(val => {
    //   console.log('shop id', val)
    //   this.addressForm.controls['member_id'].setValue(val);

    // })
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
    alternate_phone: [
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
    landmark: [
      { type: "required", message: "A landmark is required." },
    ],
    phone: [
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
  };

 

  async loadMap() {
    let client_id = localStorage.getItem('client_id')
    this.addressForm.patchValue({ client_id: client_id });
    if (this.platform.is('cordova')) {

      await this.geolocation.getCurrentPosition().then((resp) => {
        this.addressForm.controls['latitude'].setValue(resp.coords.latitude);
        this.addressForm.controls['longitude'].setValue(resp.coords.longitude);
        this.getDistance()
        this.inItMap(resp.coords.latitude, resp.coords.longitude)


      }).catch((error) => {
        // console.log('Error getting location', error);
      });
    } else {
      // console.log('cordova not supported')
      var accuracyOptions = {
        enableHighAccuracy: true,
        timeout: 27000,
        maximumAge: 1000,
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (resp) => {
            this.addressForm.controls['latitude'].setValue(resp.coords.latitude);
            this.addressForm.controls['longitude'].setValue(resp.coords.longitude);
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude
            // console.log(this.latitude,"from load map")
            this.getDistance()
            this.inItMap(resp.coords.latitude, resp.coords.longitude)


          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                var msg = "User denied the request for Geolocation.";
                // console.log(msg)
                break;
              case error.POSITION_UNAVAILABLE:
                var msg = "Location information is unavailable.";
                // console.log(msg)
                break;
              case error.TIMEOUT:
                var msg = "The request to get user location timed out.";
                // console.log(msg)
                break;
            }
          },
          accuracyOptions
        );
      }
    }

    
  }
  inItMap(lat, lng) {
    let latLng = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: latLng,
      // draggable: false,
      zoom: 16,
      disableDefaultUI: true,
      animation: google.maps.Animation.ZOOM,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }


    this.getAddressFromCoords(lat, lng);

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var icon = {
      url: "assets/imgs/pin.svg", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    var marker = new google.maps.Marker({
      draggable: true,
      map: this.map,
      icon: icon,
      scaledSize: new google.maps.Size(50, 50),
      animation: google.maps.Animation.DROP,
      position: latLng
    });
    marker.addListener('dragend', () => {
      this.addressForm.controls['latitude'].setValue(marker.getPosition().lat());
      this.addressForm.controls['longitude'].setValue(marker.getPosition().lng());
      

      this.getAddressFromCoords(marker.getPosition().lat(), marker.getPosition().lng())
      this.getDistance()
    })
  }
  getAddressFromCoords(latitude, longitude) {

    if (this.platform.is('cordova')) {
      // console.log('cordova  available')
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          this.addressForm.controls['address'].setValue(null);
          let responseAddress = [];
          for (let [key, value] of Object.entries(result[0])) {
            if (value.length > 0)
              responseAddress.push(value);

          }
          responseAddress.reverse();
          let address;
          for (let value of responseAddress) {
            address += value + ", ";
          }
          address = address.slice(0, -2);
          this.addressForm.controls['address'].setValue(address);
          this.selectedAddress = address
          // console.log(this.selectedAddress,"hello")
          
        })
        .catch((error: any) => {
        });
    } else {
      // console.log('cordova not available')
      var latlng = new google.maps.LatLng(latitude, longitude);
      var geocoder = new google.maps.Geocoder();
      this.zone.run(() => {
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
          }
          if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results);
            this.selectedAddress  = results[0].formatted_address;
            this.addressForm.controls['address'].setValue(results[0].formatted_address);
            this.addressForm.controls['place_id'].setValue(results[0].place_id);

          }
        });
      })
    }

  }


  getDistance() {
    // console.log("GEt Distance started",this.latitude,this.longitude)
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(this.latitude, this.longitude);
    // console.log("current coords getdistance", current_coords);
    var lat: string = this.latitude.toString();
    var long: string = this.longitude.toString();
    var destination = lat + "," + long;
    // var origin = '10.008,76.329'

    var shop_coords = new Array();

    this.delivery_locations?.forEach((element) => {
      shop_coords.push(element.location);
    });
    // console.log("shop", shop_coords);
    // console.log("current_coords", this.latitude, this.longitude);
    const matrixOptions = {
      origins: shop_coords, // shop coords
      destinations: [destination], // customer coords
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };
    // console.log("matrix", matrixOptions);
    service.getDistanceMatrix(matrixOptions, (response, status) => {
      // console.log("GET DISTANCE MATRIX");
      if (status !== "OK") {
        var msg = "Error with distance matrix";
        this.showToast(msg);
        this.locationAvailability = false;
        
      } else {
        var response_data = new Array();
        var distances = new Array();
        let shortest_distance;
        let shop_index: number;
        response_data = response.rows;
        // console.log("responsee data", response_data);
        response_data.forEach((ele) => {
          if(ele.elements[0].status == "ZERO_RESULTS")
          {
            this.locationAvailability = false;
            var msg = "Sorry, this location is currently not serviceable";
            this.showToast(msg);

          }
          else{
            distances.push(ele.elements[0].distance.value);
          }
        });
        shortest_distance = Math.min.apply(null, distances);
        shop_index = distances.findIndex(
          (element) => element == shortest_distance
        );
        if (
          shortest_distance <
          this.delivery_locations[shop_index].radius * 1000
        ) {
          var msg =
            "Delivery available from " +
            this.delivery_locations[shop_index].location;
          this.showToastSuccess(msg);
          this.locationAvailability = true;
          this.addressForm.patchValue({delivery_location_id:this.delivery_locations[shop_index].id})
        } else {
          this.locationAvailability = false;
          var msg = "Sorry, this location is currently not serviceable";
          this.addressForm.patchValue({ latitude: null });
          this.addressForm.patchValue({ longitude: null });
          this.showToast(msg);
        }
      }
    });
  }




  async presentToast() {
    const toast = await this.toastController.create({
      cssClass: 'custom-toast',
      position: 'top',
      message: 'Your Address have been saved.',
      duration: 2000
    });
    toast.onDidDismiss().finally(() => {
      this.modalController.dismiss()
    })
    toast.present();
  }
  onSearchChange($event) {

  }
  async areaSearch() {
    const modal = await this.modalController.create({
      component: AreaSearchPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then(data => {
      if (data.data) {
        let resp = data.data;
        this.inItMap(resp.lat, resp.lng)
      }
      // console.log('data', data.data)
      this.latitude = data.data.lat
      this.longitude = data.data.lng
      this.addressForm.patchValue({ latitude:data.data.lat  });
      this.addressForm.patchValue({ longitude:data.data.lng  });

      // console.log("lat lon from modalsearch",this.latitude,this.longitude)
      this.getDistance()
    })
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss()
  }


  onSubmit()
  {
    // console.log(this.addressForm.value)
    // console.log(this.locationAvailability,"availability")

    if (this.locationAvailability == false) 
    {
      this.showToast(
        "Selected location is not servicable. Please select a suitable location"
      );
    } 
    else if(!this.addressForm.value.name)
    {
      this.showToast("Please enter a valid user name");
    }
    else if(!this.addressForm.value.address)
    {
      this.showToast("Please enter a valid House no./Flat no./Floor/Building");
    }
    else if(!this.addressForm.value.landmark)
    {
      this.showToast("Please enter a landmark");
    }
    else if(!this.addressForm.value.phone)
    {
      this.showToast("Please enter a valid phone number");
    }
      else if (this.addressForm.valid && this.locationAvailability == true) {
        // console.log(this.addressForm.value)
        this.addressService.addEditAddress(this.addressForm.value).subscribe(
          (data) => this.handleResponse(data, POST_ADDRESS),
          (error) => this.handleError(error)
        );
        // this.navController.popTo('checkout');
        this.modalController.dismiss()
      } 
       
      else {
        this.showToast("Please fill all mandatory fields.");
      }

  
  }

  // getData()
  // {
    
  //   let member_id = Number(localStorage.getItem('member_id'))
  //   this.addressService.getDeliveryLocations().subscribe(
  //     (data)=>this.handleResponse(data,GET_DELIVERY_LOC),
  //     (error)=>this.handleError(error)
  //   )
   
  // }

  handleResponse(data,type)
  {
    if(type == GET_EDIT_ADDRESS)
    {
      this.loadingController.dismiss()
      // console.log("Edit data",data)
      this.editAddress = data.address
      this.latitude = data.address.latitude
      this.longitude = data.address.longitude
      this.delivery_locations = data.delivery_locations
      // console.log(this.latitude,this.longitude,"lat long in edit address")
      this.update()
      this.inItMap(this.latitude,this.longitude)
      this.getDistance()
      
    
      
    }
    // else if(type == GET_DELIVERY_LOC)
    // {
    //   console.log(data,"Delivery loc")
    //   this.delivery_locations = data.delivery_locations
    //   console.log("heyyy")
    //   this.inItMap(this.latitude,this.longitude)
    //   this.getDistance()
    // }
    
    
    
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
  }


  async showToast(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "danger",
    });
    toast.present();
  }

  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "success",
    });
    toast.present();
  }


  // getEditAddress()
  // {
    
  //   let address_id = Number(localStorage.getItem('address_id'))
  //   this.addressService.getEditAddress(address_id).subscribe(
  //     (data)=>this.handleResponse(data,GET_EDIT_ADDRESS),
  //     (error)=>this.handleError(error)
  //   )
    
  // }

  getEditAddress() {
    this.presentLoading().then(()=>{
      let address_id = Number(localStorage.getItem('address_id'))
    this.addressService.getEditAddress(address_id).subscribe(
      (data)=>this.handleResponse(data,GET_EDIT_ADDRESS),
      (error)=>this.handleError(error)
    )})
  }

  update()
  {
    // console.log("edit address address",this.editAddress?.landmark)
    // document.getElementById("address").innerText = this.editAddress?.full_address;
    this.addressForm.patchValue({name:this.editAddress?.name});
    this.addressForm.patchValue({address:this.editAddress?.address});
   
    this.addressForm.patchValue({alternate_phone:this.editAddress?.alternate_phone}); 
    this.addressForm.patchValue({phone:this.editAddress?.phone}); 
    this.addressForm.patchValue({full_address:this.editAddress?.full_address});
    
    this.addressForm.patchValue({landmark:this.editAddress?.landmark});
    this.addressForm.patchValue({latitude:this.editAddress?.latitude});
    this.addressForm.patchValue({longitude:this.editAddress?.longitude});
    this.addressForm.patchValue({client_id:this.editAddress?.client_id});
    this.addressForm.patchValue({place_id:this.editAddress?.place_id});
    this.addressForm.patchValue({id:this.editAddress?.id});
           
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

