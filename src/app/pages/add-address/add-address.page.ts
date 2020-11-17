import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AreaSearchPage } from '../area-search/area-search.page';

declare var google;
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.page.html',
  styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;
  local_address: boolean = false
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private platform: Platform,
    private toastController: ToastController,
    private router: Router,
    private loadingController: LoadingController,
    private modalController: ModalController,
  ) {
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

  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      duration:2000,
      showBackdrop: true
    });
    await loading.present();
  }

  async dismiss() {
    await this.loadingController.dismiss()
  }

  async loadMap() {

    await this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        // draggable: false,
        zoom: 16,
        disableDefaultUI: true,
        animation: google.maps.Animation.ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }


      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

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
        this.latitude = marker.getPosition().lat();
        this.longitude = marker.getPosition().lng();

        this.getAddressFromCoords(this.latitude, this.longitude)
      })

    }).catch((error) => {
      console.log('Error getting location', error);
    });


  }
  getAddressFromCoords(latitude, longitude) {
    console.log("getAddressFromCoords " + latitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(latitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }

  onSubmit() {
  
      this.presentLoading().finally(()=>{
        this.presentToast()
      })
      
      

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
    return await modal.present();
  }
  dismissModal(){
    this.modalController.dismiss()
  }

}
