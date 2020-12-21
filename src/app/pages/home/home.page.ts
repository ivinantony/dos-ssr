import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Badge } from '@ionic-native/badge/ngx';
import { debounceTime } from "rxjs/operators";
import { LoadingController, Platform } from '@ionic/angular';


import { ProductSearchService } from 'src/app/services/product-search.service';
import { HomeService } from 'src/app/services/home/home.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IonSlides} from '@ionic/angular';


export const CATEGORIES = [
  { id: 1, name: 'Alternator & Parts' },
  { id: 2, name: 'Bearings' },
  { id: 3, name: 'Break System' },
  { id: 4, name: 'Clutch Parts' },
  { id: 5, name: 'Container Parts' },
  { id: 6, name: 'Engine Parts' },
  { id: 8, name: 'Gear Parts' },
  { id: 7, name: 'Mixer Tank Accessories' },
  { id: 9, name: 'Startter Systme' },
  { id: 10, name: 'Steering System' },
]

export const BANNERS: Array<any> = [
  { id: 1, title: 'Hydrogen', imgUrl: 'assets/banners/b1.jpeg' },
  { id: 2, title: 'Hydrogen', imgUrl: 'assets/banners/b2.jpg' },
  { id: 3, title: 'Hydrogen', imgUrl: 'assets/banners/b3.jpg' },
  { id: 4, title: 'Hydrogen', imgUrl: 'assets/banners/b4.jpg' },
];

export const BANNERS_LARGE: Array<any> = [
  { id: 1, title: 'Hydrogen', imgUrl: 'assets/banners/b1_large.jpg'},
  { id: 2, title: 'Hydrogen', imgUrl: 'assets/banners/b2_large.jpg' },
  { id: 3, title: 'Hydrogen', imgUrl: 'assets/banners/b3.jpg' },
  { id: 4, title: 'Hydrogen', imgUrl: 'assets/banners/b4.jpg' },
];

export const BANNERS_COMBINED: Array<any> = [
  {
    id:1,
    title:'Hydrogen',
    desktopImg:'assets/banners/b1_large.jpg',
    mobileImg:'assets/banners/b1.jpeg',
  },
  {
    id:2,
    title:'Hydrogen',
    desktopImg:'assets/banners/b2_large.jpg',
    mobileImg:'assets/banners/b2.jpg',
  },
  {
    id:3,
    title:'Hydrogen',
    desktopImg:'assets/banners/b3_large.jpg',
    mobileImg:'assets/banners/b3.jpg',
  },
  {
    id:4,
    title:'Hydrogen',
    desktopImg:'assets/banners/b2_large.jpg',
    mobileImg:'assets/banners/b4.jpg',
  },
]



export const MANUFACTURES: Array<any> = [
  { id: 1, name: 'VOLVO', imgUrl: 'assets/logos/volvo.png' },
  { id: 2, name: 'MAN', imgUrl: 'assets/logos/man.png' },
  { id: 3, name: 'SCANIA', imgUrl: 'assets/logos/scania.png' },
  { id: 4, name: 'DAF', imgUrl: 'assets/logos/daf.png' },
  { id: 5, name: 'IVECO', imgUrl: 'assets/logos/iveco.png' },
  { id: 6, name: 'RENAULT', imgUrl: 'assets/logos/renault.jpg' },
  { id: 7, name: 'SANY', imgUrl: 'assets/logos/man.png' },
  { id: 8, name: 'UD TRUCKS', imgUrl: 'assets/logos/man.png' },
  { id: 9, name: 'HINO', imgUrl: 'assets/logos/man.png' },
  { id: 10, name: 'CUMMINS', imgUrl: 'assets/logos/man.png' },
  { id: 11, name: 'DEUTZ', imgUrl: 'assets/logos/man.png' },
  { id: 12, name: 'HOWO', imgUrl: 'assets/logos/man.png' },
  { id: 13, name: 'KING LONG', imgUrl: 'assets/logos/man.png' },
  { id: 14, name: 'HIGER', imgUrl: 'assets/logos/man.png' },
  { id: 15, name: 'FOTON', imgUrl: 'assets/logos/man.png' },
  { id: 16, name: 'DONG FENG', imgUrl: 'assets/logos/man.png' },
  { id: 17, name: 'YUTONG', imgUrl: 'assets/logos/man.png' },
  { id: 18, name: 'ZF', imgUrl: 'assets/logos/man.png' },
  { id: 19, name: 'EURORICAMBI', imgUrl: 'assets/logos/man.png' },
  { id: 20, name: 'SCHWING STETTER', imgUrl: 'assets/logos/man.png' },
  { id: 21, name: 'PM', imgUrl: 'assets/logos/man.png' },
  { id: 22, name: 'LIEBHERR', imgUrl: 'assets/logos/man.png' },
  { id: 23, name: 'HYUNDAI', imgUrl: 'assets/logos/man.png' },
  { id: 24, name: 'BMW', imgUrl: 'assets/logos/man.png' },
  { id: 25, name: 'WABCO', imgUrl: 'assets/logos/man.png' },
  { id: 26, name: 'MERCEDES BENZ', imgUrl: 'assets/logos/man.png' },
  { id: 27, name: 'ROBERTS', imgUrl: 'assets/logos/man.png' },
  { id: 28, name: 'MAXPART', imgUrl: 'assets/logos/man.png' },
  { id: 29, name: 'BOSCH', imgUrl: 'assets/logos/man.png' },
  { id: 30, name: 'SKF', imgUrl: 'assets/logos/man.png' },
  { id: 31, name: 'FAG', imgUrl: 'assets/logos/man.png' },
  { id: 32, name: 'INA', imgUrl: 'assets/logos/man.png' },
  { id: 33, name: 'TIMKEN', imgUrl: 'assets/logos/man.png' },
  { id: 34, name: 'NSK', imgUrl: 'assets/logos/man.png' },
  { id: 35, name: 'KOYO', imgUrl: 'assets/logos/man.png' },
  { id: 36, name: 'NTN', imgUrl: 'assets/logos/man.png' },
  { id: 37, name: 'PORSCHE', imgUrl: 'assets/logos/man.png' }
]
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('mySlider')  slides: IonSlides;
  @ViewChild('recommended')  slides1: IonSlides;
  swipeNext(){
    this.slides.slideNext();
  }
  swipePrev(){
    this.slides.slidePrev();
  }
  swipeNextRec(){
    this.slides1.slideNext();
  }
  swipePrevRec(){
    this.slides1.slidePrev();
  }
  
  bannerSlideOpts1 = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    speed: 400

  };
  bannerSlideOpts4 = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    speed: 400

  };
  bannerSlideOpts2 = {
    slidesPerView: 1,
    initialSlide: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    speed: 400

  };
  bannerSlideOpts3 = {
    slidesPerView: 1,
    initialSlide: 2,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false
    },
    speed: 400

  };

  categorySlides = {
    slidesPerView: 2.7,
    spaceBetween: 5,
  }
  // topSlides = {
  //   slidesPerView: 2.2,
  //   spaceBetween: 5,
  // }
  // recommendedSlides = {
  //   slidesPerView: 1.5,
  //   initialSlide: 1,
  //   spaceBetween: 5,
  //   centeredSlides: true,
  // }


  productSlides = window.matchMedia("(max-width: 320px)").matches ? {
    slidesPerView: 1.5,
    loop:true,
    spaceBetween:2,
    autoplay:true,
    speed:900,

  } : window.matchMedia("(max-width: 576px)").matches ? {
    slidesPerView:1.5,
    spaceBetween:5,
    autoplay:true,
    speed:900,
    loop:true

      //spaceBetween: 2
  } : window.matchMedia(" (max-width: 768px)").matches ? {
    slidesPerView: 4,
    spaceBetween: 8,
    autoplay:true,
    speed:900,
    loop:true
  } : window.matchMedia(" (max-width: 992px)").matches ? {
    slidesPerView: 4,
      spaceBetween: 10,
      autoplay:true,
      speed: 900,
      loop:true
  } : {
        slidesPerView: 5.9,
        spaceBetween: 10,
        autoplay:true,
        speed:900,
        loop:true
       
      }




  selectedIndex = 0
  // topSearches = PRODUCTS;
  // categories = CATEGORIES
  // products = PRODUCTS
   banners :any
  s3url:string
  brands:any
  categories:any
  products:any
  data:any
  banners_combined = BANNERS_COMBINED;
  public searchTerm: FormControl;
  public searchItems: any;
  searching: any = false;
manufactures = MANUFACTURES
  myDate: String = new Date().toISOString();
  banner_image: any;
  constructor(public router: Router, private platform: Platform,
    private searchService: ProductSearchService,private homeService:HomeService,
    private badge: Badge,private utils:UtilsService,private loadingController:LoadingController) {
      
      this.s3url = utils.getS3url()
    this.badge.set(10);
    // this.badge.increase(1);
    // this.badge.clear();
    this.searchTerm = new FormControl();
    this.checkWidth()
    // this.presentLoading()
    this.getData()
  }

  ionViewWillEnter() {
    console.log("view")
    this.searchTerm.reset()
  }

  ngOnInit() {

    this.searchTerm.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });


  }
  setFilteredItems(search) {
    this.searchItems = this.searchService.filterItems(search)
  }
  onSearchInput() {
    this.searching = true;
  }
  onCancel() {
    this.searchItems = []
  }

  navigateToProducts(index: number) {
    this.selectedIndex = index;
    this.router.navigate(['products', this.categories[index].id, { name: this.categories[index].category_name }])
  }
  viewProduct(index: number) {
    let id = this.products[index].id
    let catId =this.products[index].category_id
    this.router.navigate(['product',id, {catId}])
  }
  viewOfferProduct(index: number) {
    let id = this.data.offer_products[index].id
    let catId =this.data.offer_products[index].category_id
    this.router.navigate(['product',id, {catId}])
  }
  viewSearchProduct(index: number) {
    // this.router.navigate(['product', this.searchItems[index].id])
    let id = this.searchItems[index].id
    let catId =this.searchItems[index].category_id
    this.router.navigate(['product',id, {catId}])
    this.searchItems = [];
  }
  filterItems(searchTerm) {
    return this.products.filter(item => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  checkWidth() {
    if (this.platform.width() > 768) {
      // this.bannerSlideOpts = {
      //   slidesPerView: 3,
      //   initialSlide: 0,
      //   spaceBetween: 10,
      //   loop: true,
      //   centeredSlides: true,
      //   autoplay: {
      //     delay: 3000,
      //     disableOnInteraction: false
      //   },
      //   speed: 400
      // }
      this.categorySlides = {
        slidesPerView: 5.7,
        spaceBetween: 5,
      }
      // this.topSlides = {
      //   slidesPerView: 4.2,
      //   spaceBetween: 5,
      // }
      // this.recommendedSlides = {
      //   slidesPerView: 3.5,
      //   spaceBetween: 10,
      //   initialSlide: 1,
      //   centeredSlides: true,
      // }
    }

  }

  onSearchChange($event) {
    console.log($event);
  }

  onRoute(link) {
    console.log(link)
    if (link != null || link != undefined) {
      let data = link.split(".com").pop();
      
      console.log(data)
      this.router.navigateByUrl(data);
    }
  }

  getData() {
    this.presentLoading().then(()=>{
      this.homeService.getHomeDetails().subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )})
  }

  handleResponse(data)
  {
   this.loadingController.dismiss()
    console.log(data)

    this.data = data
    
    this.brands = data.brands
    this.categories = data.categories
    this.products = data.products
    
    console.log(this.products)
    this.banners = data.banner
    console.log(this.data,"this is banners")
    for(let i=0;i<this.brands.length;i++)
    {
      this.brands[i].path= this.s3url + this.brands[i].path
    }
    for(let i=0;i<this.categories.length;i++)
    {
      this.categories[i].path= this.s3url + this.categories[i].path
    }
    // for(let i=0;i<this.data.products.length;i++)
    // {
    //   console.log(i)
    //   this.data.products[i].images[0].path = this.s3url + this.data.products[i].images[0].path
    // }
    // for(let i=0;i<this.banners.length;i++){
    //   for(let j=0;j<this.banners[i].desktop_images.length;j++)
    //   {
    //     this.banners[i].desktop_images[j].path = this.s3url + this.banners[i].desktop_images[j].path
    //   }
    //   for(let j=0;j<this.banners[i].mobile_images.length;j++)
    //   {
    //     this.banners[i].mobile_images[j].path = this.s3url + this.banners[i].mobile_images[j].path
    //   }
    // }
    for(let i=0;i<this.data.banner.length;i++){
      console.log(this.s3url  )
      for(let j=0;j<this.data.banner[i].desktop_images.length;j++)
      {
        this.data.banner[i].desktop_images[j].path = this.s3url + this.data.banner[i].desktop_images[j].path
      }
      for(let j=0;j<this.banners[i].mobile_images.length;j++)
      {
        this.data.banner[i].mobile_images[j].path = this.s3url + this.data.banner[i].mobile_images[j].path
      }
    }
    console.log(this.products,"this is products")
    
    // this.banner_image= this.banners[2].images;
    
    console.log( this.banner_image)
    // this.dismiss();
  }
  handleError(error)
  {
   this.loadingController.dismiss()

    console.log(error);
    // this.dismiss()
   
  }


  navigateToBrandProducts(index:number)
  {
    let brand_id = this.brands[index].id
    let brand_name = this.brands[index].brand_name
    this.router.navigate(['brand-products',brand_id,{brand_name}])
  }

  viewAll()
  {
    this.router.navigate(['categories'])
  }

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
