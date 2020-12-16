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


// export const PRODUCTS = [
//   { id: 1, cat_id: 1, name: 'Alternator 24v', price: 400, images: [{ id: 1, url: 'https://www.ikh.fi/images/wwwkuvat/Tuotekuvat/STL24005_S_1_web.jpg' }] },
//   { id: 2, cat_id: 1, name: 'Dynamo', price: 400, images: [{ id: 1, url: 'https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0409/users/c5473c99d15b9e041d17e6dfb2f2ef927382999a/i-img1200x900-1536215275pws7ks183838.jpg' }] },
//   { id: 3, cat_id: 1, name: 'Rectifier', price: 400, images: [{ id: 1, url: 'https://sc02.alicdn.com/kf/HTB11rPPKXmWBuNjSspdq6zugXXa9/220802964/HTB11rPPKXmWBuNjSspdq6zugXXa9.jpg_.webp' }] },


//   { id: 5, cat_id: 2, name: 'Ball Bearings', price: 400, images: [{ id: 1, url: 'https://5.imimg.com/data5/SC/VI/MY-25319/volvo-truck-bearings-500x500.jpg' }] },
//   { id: 6, cat_id: 2, name: 'Tapper Roller Bearing', price: 400, images: [{ id: 1, url: 'https://www.skf.com/binaries/pub12/Images/0901d19680a53c26-SKF-Cooper-split-tapered-roller-bearing_40_0_768_763_tcm_12-562696.png' }] },
//   { id: 7, cat_id: 2, name: 'Pillow Block Bearing', price: 400, images: [{ id: 1, url: 'https://pimimages.buyersproducts.com/products/MD/P16_front.jpg' }] },

//   { id: 8, cat_id: 3, name: 'Brake Disc', price: 400, images: [{ id: 1, url: 'https://www.trt.co.nz/assets/Parts/Brakes/Disk-Brake/Images/0b5b3761a5/Truck-Brakes-Rotor-ID__FillWzgwMCw1NzRd.jpg ' }] },
//   { id: 9, cat_id: 3, name: 'Brake Pad Set', price: 400, images: [{ id: 1, url: 'https://i.pinimg.com/originals/58/7f/59/587f59cad22147ed416e5e60611d019e.jpg ' }] },
//   { id: 10, cat_id: 3, name: 'ABS Braking System', price: 400, images: [{ id: 1, url: 'https://5.imimg.com/data5/VW/UY/MY-35223123/anti-lock-braking-system-500x500.jpg' }] },

//   { id: 11, cat_id: 4, name: '3482081232 Clutch Pressure Plate', price: 400, images: [{ id: 1, url: 'https://image.made-in-china.com/202f0j00kJQTeAmCEEuW/Heavy-Truck-430mm-Clutch-Cover-Clutch-Dis-Pressure-Plate-3482081232-for-Man-Daf-Volvo-Truck.jpg' }] },
//   { id: 12, cat_id: 4, name: '1888063137 Clutch Cover', price: 400, images: [{ id: 1, url: 'https://sc01.alicdn.com/kf/Hf835b6e53289421c96a55e40d35b7e23T.png' }] },
//   { id: 13, cat_id: 4, name: ' Clutch Bearing', price: 400, images: [{ id: 1, url: 'https://partnerportal.dieseltechnic.com/dtwsassets/zoom/2/2_30000/2_30256_M.jpg' }] },

//   { id: 14, cat_id: 5, name: 'Fifth Wheel Couplings & Mounting Plates', price: 400, images: [{ id: 1, url: 'https://www.utilityaz.com/assets/Uploads/parts/fifth_wheels/image052.jpg' }] },
//   { id: 15, cat_id: 5, name: 'Modul CS - Jost World', price: 400, images: [{ id: 1, url: 'https://semitrailers.net/wp-content/uploads/2017/10/jost_landing_gear_set_logo.jpg' }] },
//   { id: 16, cat_id: 5, name: 'Wheel Stoppers', price: 400, images: [{ id: 1, url: 'https://valueautoparts.co.sz/wp-content/uploads/2019/08/Wheel-Chocks-600x600.jpg' }] },

//   { id: 17, cat_id: 6, name: '441 030 29 01 Crankshaft ', price: 400, images: [{ id: 1, url: 'https://sc02.alicdn.com/kf/HTB11bkxKFXXXXboXXXXq6xXFXXXM.jpg_350x350.jpg' }] },
//   { id: 18, cat_id: 6, name: 'Piston With Con Rod', price: 400, images: [{ id: 1, url: 'https://www.chevydiy.com/wp-content/uploads/2014/08/101.jpg' }] },
//   { id: 19, cat_id: 6, name: 'Engine Bearing', price: 400, images: [{ id: 1, url: 'https://5.imimg.com/data5/RF/OF/MY-3237327/man-bearings-500x500.jpg' }] },

//   { id: 20, cat_id: 7, name: 'Hydraulic Motor', price: 400, images: [{ id: 1, url: 'https://img2.exportersindia.com/product_images/bc-full/dir_183/5479244/hydraulic-motor-1521020443-3719190.jpeg' }] },
//   { id: 21, cat_id: 7, name: 'Mixer Water Pump', price: 400, images: [{ id: 1, url: 'https://lh3.googleusercontent.com/proxy/xVFrFb2jlS_dta2WeT81l0Mryri3-XXHMZyab_ufQiecPHy52h1mHW_Jb3IzKBWMD2ZQG8TjWSO3xKtCs6f0wZUfxfEVRi2FCPl5HGdPetwZ3jTgmfcApHdoMPukxFe9QB4' }] },
//   { id: 22, cat_id: 7, name: '', price: 400, images: [{ id: 1, url: '' }] },

//   { id: 23, cat_id: 8, name: 'Syncronizer Gear', price: 400, images: [{ id: 1, url: 'https://sc01.alicdn.com/kf/Had7a3319583c4f2280a7026b5fd02b6ch/200856212/Had7a3319583c4f2280a7026b5fd02b6ch.jpg_q50.jpg' }] },
//   { id: 24, cat_id: 8, name: 'Synchronizer Hub 1292304041', price: 400, images: [{ id: 1, url: 'https://s.alicdn.com/@sc01/kf/H2b7377a574d64a3c95e6a898a71b824b0.jpg_300x300.jpg' }] },
//   { id: 25, cat_id: 8, name: '', price: 400, images: [{ id: 1, url: '' }] },

//   { id: 26, cat_id: 9, name: 'Starter Motor', price: 400, images: [{ id: 1, url: 'https://lh3.googleusercontent.com/proxy/QI6Qxfkj3Qw4i7wLLavZADcTd5quoZmzqcjnK2TYr31ydE-JD1QPBJBy5uQtQNLkuNBSoEy-_hQdoAjNg7SZiyVLjxM-k01GeUM1beuW2ZkKKZ7rH83dUXAwHpBTFx81lWmNslap7NvqZPU2LLcjug' }] },
//   { id: 27, cat_id: 9, name: 'Armature', price: 400, images: [{ id: 1, url: 'https://image.made-in-china.com/202f0j00hQIfDMoFOCzt/Original-Sinotruk-HOWO-Truck-Spare-Parts-Starter-Armature-Vg1560090001-01.jpg' }] },
//   { id: 28, cat_id: 9, name: 'Starter Solenoid', price: 400, images: [{ id: 1, url: 'https://media.napaonline.com/is/image/GenuinePartsCompany/NWMDC?$Product=GenuinePartsCompany/755651' }] },

//   { id: 29, cat_id: 10, name: 'Power Steering Box', price: 400, images: [{ id: 1, url: 'https://5.imimg.com/data5/LR/OB/HZ/SELLER-66273618/power-steering-box-500x500.jpg' }] },
//   { id: 30, cat_id: 10, name: 'Power Steering Pump', price: 400, images: [{ id: 1, url: 'https://sc02.alicdn.com/kf/HTB1xaSLrL5TBuNjSspcq6znGFXaN.jpg' }] },

// ]
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
    spaceBetween:8,
    autoplay:true,
    speed:900,
    loop:true
    
  } : window.matchMedia("(max-width: 576px)").matches ? {
    slidesPerView:2.2,
    spaceBetween:5,
    autoplay:true,
    speed:900,
    loop:true

      //spaceBetween: 2
  } : window.matchMedia(" (max-width: 768px)").matches ? {
    slidesPerView: 4.2,
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
    this.router.navigate(['product', {id,catId}])
  }
  viewSearchProduct(index: number) {
    // this.router.navigate(['product', this.searchItems[index].id])
    let id = this.searchItems[index].id
    let catId =this.searchItems[index].category_id
    this.router.navigate(['product', {id,catId}])
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
    this.router.navigate(['brand-products',{brand_id,brand_name}])
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
