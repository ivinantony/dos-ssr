import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Badge } from "@ionic-native/badge/ngx";
import { debounceTime } from "rxjs/operators";
import { AlertController, LoadingController, Platform } from "@ionic/angular";
import { ProductSearchService } from "src/app/services/product-search.service";
import { HomeService } from "src/app/services/home/home.service";
import { UtilsService } from "src/app/services/utils.service";
import { IonSlides } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SearchService } from "src/app/services/search/search.service";
import { CartcountService } from "src/app/services/cartcount.service";
import { NotcountService } from "src/app/services/notcount.service";
import { Storage } from "@ionic/storage";
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  @ViewChild("mySlider") slides: IonSlides;
  @ViewChild("recommended") slides1: IonSlides;
  swipeNext() {
    this.slides.slideNext();
  }
  swipePrev() {
    this.slides.slidePrev();
  }
  swipeNextRec() {
    this.slides1.slideNext();
  }
  swipePrevRec() {
    this.slides1.slidePrev();
  }

  bannerSlideOpts4 = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    speed: 400,
  };
  bannerSlideOpts2 = {
    slidesPerView: 1,
    initialSlide: 1,
    spaceBetween: 20,

    centeredSlides: true,
    autoplay: {
      delay: 2000,
      loop: true,
      disableOnInteraction: false,
    },
    speed: 400,
  };
  bannerSlideOpts3 = {
    slidesPerView: 1,
    initialSlide: 2,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    speed: 400,
  };
  bannerSlideOpts = {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    updateOnWindowResize: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
  };
  categoryOpts = {
    updateOnWindowResize: true,
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 2.2,
        initialSlide: 0,
        spaceBetween: 10,
      },
      // when window width is <= 640px
      768: {
        slidesPerView: 2,
        initialSlide: 0,
        spaceBetween: 10,
        autoplay: {
          delay: 2000,
          loop: true,
          disableOnInteraction: false,
        },
        speed: 400,
      },
      1024: {
        slidesPerView: 6,
        initialSlide: 0,
        spaceBetween: 10,
        autoplay: {
          delay: 2000,
          loop: true,
          disableOnInteraction: false,
        },
        speed: 400,
      },
    },
  };

  productSlides = window.matchMedia("(max-width: 320px)").matches
    ? {
        slidesPerView: 1.5,

        spaceBetween: 2,
        autoplay: true,
        speed: 900,
      }
    : window.matchMedia("(max-width: 576px)").matches
    ? {
        slidesPerView: 1.5,
        spaceBetween: 5,
        autoplay: true,
        speed: 900,

        //spaceBetween: 2
      }
    : window.matchMedia(" (max-width: 768px)").matches
    ? {
        slidesPerView: 4,
        spaceBetween: 8,
        autoplay: true,
        speed: 900,
      }
    : window.matchMedia(" (max-width: 992px)").matches
    ? {
        slidesPerView: 4,
        spaceBetween: 10,
        autoplay: true,
        speed: 900,
      }
    : {
        slidesPerView: 5.9,
        spaceBetween: 10,
        autoplay: true,
        speed: 900,
      };

  selectedIndex = 0;
  banners: any;
  s3url: string;
  brands: any;
  categories: any;
  products: any;
  data: any;
  client_id: any;
  cart_count: any;
  notf_count: any;
  public searchTerm: FormControl;
  public searchItems;
  searching: any = false;
  result: Array<any> = [];
  android_version:any
  ios_version:any
  isAlertPresent:boolean=false;

  myDate: String = new Date().toISOString();
  banner_image: any;
  constructor(
    public router: Router,
    private platform: Platform,
    private homeService: HomeService,
    private badge: Badge,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private searchService: SearchService,
    private cartCountService: CartcountService,
    private notCountService: NotcountService,
    private storage: Storage,
    private notificationCountService:NotcountService,
    private alertController:AlertController,
    private appVersion:AppVersion
  ) {
    this.s3url = utils.getS3url();
    // this.badge.set(10);
    this.searchTerm = new FormControl();
    this.notificationCountService.getNotCount().subscribe((res) => {
      this.notf_count = res;
    });
  }

  ionViewWillEnter() {
    this.getData();
    this.searchTerm.reset();
  }

  ngOnInit() {
    this.searchTerm.valueChanges
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searching = false;

        if (searchTerm) {
          this.result = [];
          this.searchService.getSearchResult(searchTerm).subscribe(
            (data) => this.handleResponseSearch(data),
            (error) => this.handleErrorSearch(error)
          );
        }
      });

      this.platform.resume.subscribe(async () => {
        console.log("alert status",this.isAlertPresent)
        if(this.isAlertPresent)
        {
          this.alertController.dismiss()
            this.checkApplicationUpdate(this.android_version,this.ios_version); 
        }
        else{
          console.log("when returned from store without update")
          this.checkApplicationUpdate(this.android_version,this.ios_version)
        }
   
      });
  }

  onSearchInputMobile() {
    this.searching = true;
  }

  onCancel() {
    this.result = [];
  }

  navigateToProducts(index: number) {
    this.result = [];
    this.selectedIndex = index;
    this.router.navigate([
      "products",
      this.categories[index].id,
      { name: this.categories[index].category_name },
    ]);
  }
  viewProduct(index: number) {
    this.result = [];
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
  }
  viewOfferProduct(index: number) {
    this.result = [];
    let id = this.data.offer_products[index].id;
    let catId = this.data.offer_products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
  }

  viewSearchProduct(index: number) {
    let id = this.result[index].id;
    let catId = this.result[index].category_id;
    let type = this.result[index].type;

    if (type == "P") {
      this.router.navigate(["product", id, { catId }]);
    } else if (type == "B") {
      let brand_id = id;
      let brand_name = this.result[index].brand_name;
      this.router.navigate(["/tabs/rand-products", brand_id, { brand_name }]);
    } else if (type == "C") {
      let catId = id;
      let category_name = this.result[index].category_name;

      this.router.navigate(["products", catId, { category_name }]);
    }

    this.searchItems = [];
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  onRoute(link) {
    this.result = [];
    if (link != null || link != undefined) {
      let data = link.split(".com").pop();

      this.router.navigateByUrl(data);
    }
  }

  getData() {
    this.authService.isAuthenticated().then((val) => {
      if (val) {
        this.client_id = val;
      } else {
        this.client_id = null;
      }
    });

    this.presentLoading().then(() => {
      this.homeService.getHomeDetails(this.client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    this.authService.setCartCount(data.cart_count)
    this.authService.setNotificationCount(data.notification_count)
    this.cart_count = data.cart_count;
    this.notf_count = data.notification_count;
    this.cartCountService.setCartCount(data.cart_count);
    this.notCountService.setNotCount(data.notification_count)
    this.badge.set(this.notf_count);

    this.data = data;
    this.brands = data.brands;
    this.categories = data.categories;
    this.products = data.products;
    this.banners = data.banner;
    this.android_version = data.android_version
    this.ios_version = data.ios_version
    if(this.platform.is('cordova')){
      this.checkApplicationUpdate(data.android_version,data.ios_version)
    }
    
  }

  handleError(error) {
    this.loadingController.dismiss();
  }

  navigateToBrandProducts(index: number) {
    this.result = [];
    let brand_id = this.brands[index].id;
    let brand_name = this.brands[index].brand_name;
    this.router.navigate(["brand-products", brand_id, { brand_name }]);
  }

  viewAll() {
    this.result = [];
    this.router.navigate(["manufacturers"]);
  }
  onNotification() {
    this.router.navigate(['notification'])
  }
  doRefresh(event) {
    this.result = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }
  facebook() {
    window.open("https://www.facebook.com/deal-on-store-103110191641253", "_self");
  }
  twitter() {
    window.open("https://twitter.com/dealonstore", "_self");
  }
  insta() {
    window.open("https://www.instagram.com/deal_on_store/", "_self");
  }

  handleResponseSearch(data) {
    data.data.filter((item) => {
      this.result.push(item);
    });
  }
  handleErrorSearch(error) {}

  checkApplicationUpdate(android_version:any,ios_version:any)
  {
    console.log("android_version",this.android_version)
    let current_version
    this.appVersion.getVersionNumber().then(res => {
      current_version = res;
      console.log("current_version", current_version)
      if (android_version > current_version) {
      
        console.log("force update required")
        this.presentUpdateConfirm()
      }
      else if(ios_version > current_version)
      {
        console.log("force update required")
        this.presentUpdateConfirm()
      }
      else{
        console.log("update not required app up to date")
      }
    })
    
    
    
  }

  async presentUpdateConfirm() {
    this.isAlertPresent = true
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'This version of the app is outdated',
      message: 'Please download the latest version to continue.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            navigator['app'].exitApp();
          }
        }, {
          text: 'Update',
          handler: () => {
            if(this.platform.is('ios'))
            {
              this.isAlertPresent = false
              window.open('http://itunes.apple.com/lb/app/truecaller-caller-id-number/id448142450?mt=8');
            }
            else if(this.platform.is('android'))
            {
              this.isAlertPresent = false
              window.open('https://play.google.com/store/apps/details?id=com.whatsapp');
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
