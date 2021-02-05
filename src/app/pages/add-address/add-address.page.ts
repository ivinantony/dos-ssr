
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  NativeGeocoder,
  NativeGeocoderOptions,
  NativeGeocoderResult,
} from "@ionic-native/native-geocoder/ngx";
import {
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { AreaSearchPage } from "src/app/pages/area-search/area-search.page";
import { AddressService } from "src/app/services/address/address.service";
import { AuthenticationService } from "src/app/services/authentication.service";
const GET_DELIVERY_LOC = 200;
const POST_ADDRESS = 210;
declare var google;

@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.page.html",
  styleUrls: ["./add-address.page.scss"],
})
export class AddAddressPage implements OnInit {
  @ViewChild("map", { static: false }) mapElement: ElementRef;
  map: any;
  latitude: number;
  longitude: number;
  is_valid: boolean = false;
  isPwa:boolean=false
  public addressForm: FormGroup;


  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5,
  };
  navController: any;
  locationAvailability: boolean;
  delivery_locations: any;
  selectedAddress: any;
  is_granted: boolean = true;

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
    
    this.addressForm = this.formBuilder.group({
      client_id: [""],
      name: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      address: ["", Validators.required],
      latitude: [""],
      longitude: [""],
      full_address: ["", Validators.required],
      place_id: [""],
      landmark: [""],
      alternate_phone: [
        "",
        Validators.compose([
          Validators.maxLength(9),
          Validators.minLength(9),
          Validators.pattern("[0-9]*"),
        ]),
      ],
      phone: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(9),
          Validators.minLength(9),
          Validators.pattern("[0-9]*"),
        ]),
      ],
      delivery_location_id: [""],
    });
    
    this.platform.ready().then(() => {
      this.presentLoading().then(() => {
      this.getData();
        this.loadMap().finally(() => {
          this.dismiss();
          
          this.handlePermission();
        });
      });
    });
    if(!this.platform.is('cordova'))
    {
      this.isPwa=true
     
    }
  }
  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
    }
  }

  getData() {
    this.addressService.getDeliveryLocations().subscribe(
      (data) => this.handleResponse(data, GET_DELIVERY_LOC),
      (error) => this.handleError(error)
    );
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


    this.authservice.isAuthenticated().then((token) => {
      if (token) {
        this.addressForm.patchValue({ client_id: token });
      }
    });

    if (this.platform.is("cordova")) {

      await this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          this.addressForm.controls["latitude"].setValue(resp.coords.latitude);
          this.addressForm.controls["longitude"].setValue(
            resp.coords.longitude
          );
   
          this.inItMap(resp.coords.latitude, resp.coords.longitude);
        })
        .catch((error) => {
          // console.log("Error getting location", error);
        });
    } else {
   
      var accuracyOptions = {
        enableHighAccuracy: true,
        timeout: 27000,
        maximumAge: 1000,
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (resp) => {
            this.addressForm.controls["latitude"].setValue(
              resp.coords.latitude
            );
            this.addressForm.controls["longitude"].setValue(
              resp.coords.longitude
            );
            this.latitude = resp.coords.latitude;
            this.longitude = resp.coords.longitude;
        
            this.getDistance();
            this.inItMap(resp.coords.latitude, resp.coords.longitude);
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                var msg =
                  "User denied the request for Geolocation. In order to access your location reset the permission in settings.";
                this.showToastDangerDenied(msg);
            

                break;
              case error.POSITION_UNAVAILABLE:
                var msg = "Location information is unavailable.";
                this.showToastDanger(msg);
          
                break;
              case error.TIMEOUT:
                var msg = "The request to get user location timed out.";
                this.showToastDanger(msg);
              
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
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.getAddressFromCoords(lat, lng);

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    var icon = {
      url: "assets/imgs/pin.svg", // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };
    var marker = new google.maps.Marker({
      draggable: true,
      map: this.map,
      icon: icon,
      scaledSize: new google.maps.Size(50, 50),
      animation: google.maps.Animation.DROP,
      position: latLng,
    });
    marker.addListener("dragend", () => {
      this.addressForm.controls["latitude"].setValue(
        marker.getPosition().lat()
      );
      this.addressForm.controls["longitude"].setValue(
        marker.getPosition().lng()
      );

      this.getAddressFromCoords(
        marker.getPosition().lat(),
        marker.getPosition().lng()
      );
      
    });
    console.log("get distance")
    this.getDistance();
  }

  getAddressFromCoords(latitude, longitude) {
    if (this.platform.is("cordova")) {
    
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      };
      this.nativeGeocoder
        .reverseGeocode(latitude, longitude, options)
        .then((result: NativeGeocoderResult[]) => {
        

          this.addressForm.controls["address"].setValue(null);
          let responseAddress = [];
          for (let [key, value] of Object.entries(result[0])) {
            if (value.length > 0) responseAddress.push(value);
          }
          responseAddress.reverse();
          
          let address = "";
          for (let value of responseAddress) {
            address += value + ", ";
          }
          address = address.slice(0, -2);
          
          this.addressForm.controls["address"].setValue(address);
          this.selectedAddress = address;
        })
        .catch((error: any) => {});
    } else {
   
      var latlng = new google.maps.LatLng(latitude, longitude);
      var geocoder = new google.maps.Geocoder();
      this.zone.run(() => {
        geocoder.geocode({ latLng: latlng }, (results, status) => {
          if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
          }
          if (status == google.maps.GeocoderStatus.OK) {
    
            this.selectedAddress = results[0].formatted_address;
            this.addressForm.controls["address"].setValue(
              results[0].formatted_address
            );
            this.addressForm.controls["place_id"].setValue(results[0].place_id);
          }
        });
      });
    }
  }

  getDistance() {
    
    const service = new google.maps.DistanceMatrixService();
    var current_coords = new google.maps.LatLng(this.latitude, this.longitude);
   
    var lat: string = this.latitude.toString();
    var long: string = this.longitude.toString();
    var destination = lat + "," + long;
    // var origin = '10.008,76.329'

    var shop_coords = new Array();

    this.delivery_locations?.forEach((element) => {
      shop_coords.push(element.location);
    });
   
    const matrixOptions = {
      origins: shop_coords, // shop coords
      destinations: [destination], // customer coords
      travelMode: "DRIVING",
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };

    service.getDistanceMatrix(matrixOptions, (response, status) => {
   
      if (status !== "OK") {
        var msg = "Error with distance matrix";
        this.locationAvailability = false;
        this.showToast(msg);
      } else {
        var response_data = new Array();
        var distances = new Array();
        let shortest_distance;
        let shop_index: number;
        response_data = response.rows;
        
        response_data.forEach((ele) => {
          if (ele.elements[0].status == "ZERO_RESULTS") {
            this.locationAvailability = false;
            var msg = "Sorry, this location is currently not serviceable";
            this.showToast(msg);
          } else {
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
          this.addressForm.patchValue({
            delivery_location_id: this.delivery_locations[shop_index].id,
          });
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
      cssClass: "custom-toast",
      position: "top",
      message: "Your Address have been saved.",
      duration: 2000,
    });
    toast.onDidDismiss().finally(() => {
      this.modalController.dismiss();
    });
    toast.present();
  }

  onSearchChange($event) {}

  async areaSearch() {
    const modal = await this.modalController.create({
      component: AreaSearchPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      cssClass: "my-custom-class",
    });
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        let resp = data.data;
        this.inItMap(resp.lat, resp.lng);
      }
   
      this.latitude = data.data.lat;
      this.longitude = data.data.lng;
      this.addressForm.patchValue({ latitude: data.data.lat });
      this.addressForm.patchValue({ longitude: data.data.lng });

   
      this.getDistance();
    });
    return await modal.present();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  onSubmit() {
   

    if (this.locationAvailability == false) {
      this.showToast(
        "Selected location is not servicable. Please select a suitable location"
      );
    } else if (!this.addressForm.value.name) {
      this.showToast("Please enter a valid user name");
    } else if (!this.addressForm.value.full_address) {
      this.showToast("Please enter a valid House no./Flat no./Floor/Building");
    } else if (!this.addressForm.value.phone) {
      this.showToast("Please enter a valid phone number");
    } else if (this.addressForm.valid && this.locationAvailability == true) {
      
      this.addressService.addAddress(this.addressForm.value).subscribe(
        (data) => this.handleResponse(data, POST_ADDRESS),
        (error) => this.handleError(error)
      );
      this.modalController.dismiss();
    } else {
      this.showToast("Please fill all mandatory fields.");
    }
  }

  handleResponse(data, type) {

    this.delivery_locations = data.delivery_locations;
  }
  handleError(error) {
    // this.showToast(error.msg)
  }

  async showToast(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "dark",
    });
    toast.present();
  }
  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "dark",
    });
    toast.present();
  }

  async showToastDanger(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: "top",
      color: "dark",
    });
    toast.present();
  }

  async showToastDangerDenied(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: "top",
      color: "dark",
    });
    toast.present();
  }

  handlePermission() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state == "granted") {
        this.report(result.state);

        this.is_granted = true;
      } else if (result.state == "prompt") {
        this.report(result.state);

        this.is_granted = true;
        // navigator.geolocation.getCurrentPosition();
      } else if (result.state == "denied") {
        this.report(result.state);

        this.is_granted = false;
      }
      result.onchange = () => {
        this.report(result.state);
        this.handlePermission();
      };
    });
  }

  report(state) {
    console.log("Permission " + state);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "bubbles",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }

  async dismiss() {
    await this.loadingController.dismiss();
  }
}
