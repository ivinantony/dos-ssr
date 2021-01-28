import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Badge } from "@ionic-native/badge/ngx";
import { debounceTime } from "rxjs/operators";
import { LoadingController, Platform } from "@ionic/angular";
import { ProductSearchService } from "src/app/services/product-search.service";
import { HomeService } from "src/app/services/home/home.service";
import { UtilsService } from "src/app/services/utils.service";
import { IonSlides } from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { SearchService } from "src/app/services/search/search.service";
import { CartcountService } from "src/app/cartcount.service";
import { NotcountService } from "src/app/notcount.service";

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

 ;
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
    on: {
    beforeInit() {
    const swiper = this;
    swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
    const overwriteParams = {
    slidesPerView: 1,
    slidesPerColumn: 1,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
    spaceBetween: 0,
    virtualTranslate: true,
    };
    swiper.params = Object.assign(swiper.params, overwriteParams);
    swiper.params = Object.assign(swiper.originalParams, overwriteParams);
    },
    setTranslate() {
    const swiper = this;
    const { slides } = swiper;
    for (let i = 0; i < slides.length; i += 1) {
    const $slideEl = swiper.slides.eq(i);
    const offset$$1 = $slideEl[0].swiperSlideOffset;
    let tx = -offset$$1;
    if (!swiper.params.virtualTranslate) tx -= swiper.translate;
    let ty = 0;
    if (!swiper.isHorizontal()) {
    ty = tx;
    tx = 0;
    }
    const slideOpacity = swiper.params.fadeEffect.crossFade
    ? Math.max(1 - Math.abs($slideEl[0].progress), 0)
    : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
    $slideEl
    .css({
    opacity: slideOpacity,
    })
    .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
    }
    },
    setTransition(duration) {
    const swiper = this;
    const { slides, $wrapperEl } = swiper;
    slides.transition(duration);
    if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    slides.transitionEnd(() => {
    if (eventTriggered) return;
    if (!swiper || swiper.destroyed) return;
    eventTriggered = true;
    swiper.animating = false;
    const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
    for (let i = 0; i < triggerEvents.length; i += 1) {
    $wrapperEl.trigger(triggerEvents[i]);
    }
    });
    }
    },
    }
    }
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
    }
    }
    }


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
  result:Array<any>=[]

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
    private searchService:SearchService,
    private cartCountService:CartcountService,
    private notCountService:NotcountService,
  ) {
    this.s3url = utils.getS3url();
    // this.badge.set(10);
    this.searchTerm = new FormControl();
    this.getData();
    this.cart_count = localStorage.getItem("cart_count");
    this.notf_count = localStorage.getItem("notf_count");
    cartCountService.getCartCount().subscribe(res => {
      this.cart_count=res}
      )
    notCountService.getNotCount().subscribe(res => {
        this.notf_count=res}
        )
  }

  ionViewWillEnter() {
    this.searchTerm.reset();
    this.cart_count = localStorage.getItem("cart_count");
    this.notf_count = localStorage.getItem("notf_count");
  }

  ngOnInit() {
    this.searchTerm.valueChanges.pipe(debounceTime(700)).subscribe((searchTerm) => {
      this.searching = false;
      console.log(searchTerm)
      if(searchTerm)
        {
          this.result=[]
          this.searchService.getSearchResult(searchTerm).subscribe(
            (data)=>this.handleResponseSearch(data),
            (error)=>this.handleErrorSearch(error)
          )
        }
      
      // this.setFilteredItems(search);
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
    console.log("search view")

    // this.router.navigate(['product', this.searchItems[index].id])
    let id = this.result[index].id;
    let catId = this.result[index].category_id;
    this.result = [];
    this.router.navigate(["product", id, { catId }]);
    
  }

  filterItems(searchTerm) {
    return this.products.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }



  onRoute(link) {
    this.result = [];
    // console.log(link)
    if (link != null || link != undefined) {
      let data = link.split(".com").pop();

      // console.log(data)
      this.router.navigateByUrl(data);
    }
  }

  getData() {
    if (this.authService.isAuthenticated()) {
      this.client_id = localStorage.getItem("client_id");
    } else {
      this.client_id = null;
    }
    // console.log("client_id",this.client_id)
    this.presentLoading().then(() => {
      this.homeService.getHomeDetails(this.client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    });
  }

  handleResponse(data) {
    this.loadingController.dismiss();
    localStorage.setItem("cart_count", data.cart_count);
    localStorage.setItem("notf_count", data.notification_count);
    this.data = data;
    this.brands = data.brands;
    this.categories = data.categories;
    this.products = data.products;
    this.banners = data.banner;
   
  }

  handleError(error) {
    this.loadingController.dismiss();

    // console.log(error);
    // this.dismiss()
  }

  navigateToBrandProducts(index: number) {
    this.result = [];
    let brand_id = this.brands[index].id;
    let brand_name = this.brands[index].brand_name;
    this.router.navigate(["brand-products", brand_id, { brand_name }]);
  }

  viewAll() {
    this.result = [];
    this.router.navigate(["categories"]);
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
    window.open("https://www.facebook.com/deal-on-store-103110191641253");
  }
  twitter() {
    window.open("https://twitter.com/dealonstore");
  }
  insta() {
    window.open("https://www.instagram.com/deal_on_store/");
  }

  handleResponseSearch(data) {
    console.log(data)
    data.data.filter(item => {
      this.result.push(item)
      }) 
    console.log(this.result,"result")
  }
  handleErrorSearch(error) {
    console.log(error)
  }
}
