
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

declare var google;

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;

  // latitude: number;
  // longitude: number;

  public addressForm: FormGroup;


  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
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
    private addressService: AddressService
  ) {

    this.addressForm = this.formBuilder.group({
      member_id: [''],
      address: ['', Validators.required,],
      latitude: [''],
      longitude: [''],
      place_id: [''],
      landmark: ['', Validators.required],
      alternate_number: ['']

    });
    this.platform.ready().then(() => {
      this.presentLoading().then(() => {
        console.log('presented')
        this.loadMap().finally(() => {
          this.dismiss()
        })
      })

    })
  }
  ngOnInit() {
    // this.authservice.getMemberId().then(val => {
    //   console.log('shop id', val)
    //   this.addressForm.controls['member_id'].setValue(val);

    // })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass: 'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

  async dismiss() {
    await this.loadingController.dismiss()
  }

  async loadMap() {
    if (this.platform.is('cordova')) {

      await this.geolocation.getCurrentPosition().then((resp) => {
        this.addressForm.controls['latitude'].setValue(resp.coords.latitude);
        this.addressForm.controls['longitude'].setValue(resp.coords.longitude);
        this.inItMap(resp.coords.latitude, resp.coords.longitude)


      }).catch((error) => {
        console.log('Error getting location', error);
      });
    } else {
      console.log('cordova not supported')
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
            this.inItMap(resp.coords.latitude, resp.coords.longitude)


          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                var msg = "User denied the request for Geolocation.";
                console.log(msg)
                break;
              case error.POSITION_UNAVAILABLE:
                var msg = "Location information is unavailable.";
                console.log(msg)
                break;
              case error.TIMEOUT:
                var msg = "The request to get user location timed out.";
                console.log(msg)
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
      // this.latitude = marker.getPosition().lat();
      // this.longitude = marker.getPosition().lng();

      this.getAddressFromCoords(marker.getPosition().lat(), marker.getPosition().lng())
    })
  }
  getAddressFromCoords(latitude, longitude) {

    if (this.platform.is('cordova')) {
      console.log('cordova  available')
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
        })
        .catch((error: any) => {
        });
    } else {
      console.log('cordova not available')
      var latlng = new google.maps.LatLng(latitude, longitude);
      var geocoder = new google.maps.Geocoder();
      this.zone.run(() => {
        geocoder.geocode({ 'latLng': latlng }, (results, status) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
          }
          if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            this.addressForm.controls['address'].setValue(results[0].formatted_address);
            this.addressForm.controls['place_id'].setValue(results[0].place_id);

          }
        });
      })
    }

  }

  saveAddress() {
    console.log('this.addressForm.value', this.addressForm.value)
    // this.addressService.postAddress(this.addressForm.value).subscribe(data => this.handleResponse(data), error => this.handleError(error))
    // this.presentLoading().finally(() => {
    //   this.presentToast()
    // })



  }
  handleResponse(data) {
    console.log(data)
    this.modalController.dismiss()
  }
  handleError(error) {
    console.log(error)

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
      console.log('data', data)

    })
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss()
  }

}


















// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Router } from '@angular/router';
// import { Geolocation } from '@ionic-native/geolocation/ngx';
// import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
// import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
// import { AddressService } from 'src/app/services/address/address.service';
// import { AreaSearchPage } from '../area-search/area-search.page';
// const GET_DELIVERY_LOCATIONS=200;
// declare var google;
// @Component({
//   selector: 'app-add-address',
//   templateUrl: './add-address.page.html',
//   styleUrls: ['./add-address.page.scss'],
// })
// export class AddAddressPage implements OnInit {
//   @ViewChild('map', { static: false }) mapElement: ElementRef;
//   map: any;
//   address: string;

//   latitude: number;
//   longitude: number;
//   local_address: boolean = false
//   deliveryLocations:any
//   selectedAddress:any
//   //Geocoder configuration
//   geoencoderOptions: NativeGeocoderOptions = {
//     useLocale: true,
//     maxResults: 5
//   };
//   constructor(
//     private geolocation: Geolocation,
//     private nativeGeocoder: NativeGeocoder,
//     private platform: Platform,
//     private toastController: ToastController,
//     private router: Router,
//     private loadingController: LoadingController,
//     private modalController: ModalController,
//     private addressService:AddressService
//   ) {
//     this.getData()
//     this.platform.ready().then(() => {
//       this.presentLoading().then(() => {
//         console.log('presented')
//         this.loadMap().finally(() => {
//           this.dismiss()
//         })
//       })

//     })

//   }
//   ngOnInit() {

//   }

//   async presentLoading() {
//     const loading = await this.loadingController.create({
//       spinner: 'bubbles',
//       cssClass:'custom-spinner',
//       message: 'Please wait...',
//       duration:2000,
//       showBackdrop: true
//     });
//     await loading.present();
//   }

//   async dismiss() {
//     await this.loadingController.dismiss()
//   }

//   async loadMap() {

//     await this.geolocation.getCurrentPosition().then((resp) => {

//       this.latitude = resp.coords.latitude;
//       this.longitude = resp.coords.longitude;

//       let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
//       let mapOptions = {
//         center: latLng,
//         // draggable: false,
//         zoom: 16,
//         disableDefaultUI: true,
//         animation: google.maps.Animation.ZOOM,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       }


//       this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

//       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//       var icon = {
//         url: "assets/imgs/pin.svg", // url
//         scaledSize: new google.maps.Size(50, 50), // scaled size
//         origin: new google.maps.Point(0, 0), // origin
//         anchor: new google.maps.Point(0, 0) // anchor
//       };
//       var marker = new google.maps.Marker({
//         draggable: true,
//         map: this.map,
//         icon: icon,
//         scaledSize: new google.maps.Size(50, 50),
//         animation: google.maps.Animation.DROP,
//         position: latLng
//       });
//       marker.addListener('dragend', () => {
//         this.latitude = marker.getPosition().lat();
//         this.longitude = marker.getPosition().lng();

//         this.getAddressFromCoords(this.latitude, this.longitude)
//       })

//     }).catch((error) => {
//       console.log('Error getting location', error);
//     });


//   }

//   getAddressFromCoords(latitude, longitude) {
//     console.log("getAddressFromCoords " + latitude + " " + longitude);
//     let options: NativeGeocoderOptions = {
//       useLocale: true,
//       maxResults: 5
//     };

//     this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
//       .then((result: NativeGeocoderResult[]) => {
//         this.address = "";
//         let responseAddress = [];
//         for (let [key, value] of Object.entries(result[0])) {
//           if (value.length > 0)
//             responseAddress.push(value);

//         }
//         responseAddress.reverse();
//         for (let value of responseAddress) {
//           this.address += value + ", ";
//         }
//         this.address = this.address.slice(0, -2);
        
//       })
//       .catch((error: any) => {
//         this.address = "Address Not Available!";
//       });

//       console.log(this.address)
//   }

//   onSubmit() {
  
//       this.presentLoading().finally(()=>{
//         this.presentToast()
//       })
      
      

//   }
//   async presentToast() {
//     const toast = await this.toastController.create({
//       cssClass: 'custom-toast',
//       position: 'top',
//       message: 'Your Address have been saved.',
//       duration: 2000
//     });
//     toast.onDidDismiss().finally(() => {
//       this.modalController.dismiss()
//     })
//     toast.present();
//   }
//   onSearchChange($event) {

//   }
//   async areaSearch() {
//     const modal = await this.modalController.create({
//       component: AreaSearchPage,
//       swipeToClose: true,
//       presentingElement: await this.modalController.getTop(),
//       cssClass: 'my-custom-class'
//     });

//     modal.onDidDismiss().then(data=>{
//       this.selectedAddress = data.data,
//       console.log(this.selectedAddress,"HAi"),
//       this.getAddressFromCoords(this.selectedAddress.lat,this.selectedAddress.lng)
//     })
//     return await modal.present();
//   }
//   dismissModal(){
//     this.modalController.dismiss()
//   }

//   getData()
//   {
//     // let client_id = Number(localStorage.getItem('client_id'))
//     this.addressService.getDeliveryLocations().subscribe(
//       (data)=>this.handleResponse(data,GET_DELIVERY_LOCATIONS),
//       (error)=>this.handleError(error)
//     )
//   }

//   handleResponse(data,type)
//   {
//     if(type == GET_DELIVERY_LOCATIONS)
//     {
//       this.deliveryLocations = data.delivery_locations
//       console.log(this.deliveryLocations)
//     }
//     else{
//       console.log(data)
//     }
    
//   }
//   handleError(error)
//   {
//     console.log(error)
//   }

// }
