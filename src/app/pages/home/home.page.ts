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
import { AuthenticationService } from 'src/app/services/authentication.service';

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
    
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      loop: true,
    },
    speed: 1000

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
    
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      loop: true,
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

  productSlides = window.matchMedia("(max-width: 320px)").matches ? {
    slidesPerView: 1.5,
    
    spaceBetween:2,
    autoplay:true,
    speed:900,

  } : window.matchMedia("(max-width: 576px)").matches ? {
    slidesPerView:1.5,
    spaceBetween:5,
    autoplay:true,
    speed:900,
    

      //spaceBetween: 2
  } : window.matchMedia(" (max-width: 768px)").matches ? {
    slidesPerView: 4,
    spaceBetween: 8,
    autoplay:true,
    speed:900,
    
  } : window.matchMedia(" (max-width: 992px)").matches ? {
    slidesPerView: 4,
      spaceBetween: 10,
      autoplay:true,
      speed: 900,
      
  } : {
        slidesPerView: 5.9,
        spaceBetween: 10,
        autoplay:true,
        speed:900,

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
  client_id:any
  cart_count:any
  public searchTerm: FormControl;
  public searchItems: any;
  searching: any = false;

  myDate: String = new Date().toISOString();
  banner_image: any;
  constructor(public router: Router, private platform: Platform,
    private searchService: ProductSearchService,private homeService:HomeService,
    private badge: Badge,private utils:UtilsService,
    private loadingController:LoadingController,
    private authService:AuthenticationService) {

      
      this.s3url = utils.getS3url()
    this.badge.set(10);
    // this.badge.increase(1);
    // this.badge.clear();
    this.searchTerm = new FormControl();
    this.checkWidth()
    // this.presentLoading()
    this.getData()
    this.cart_count = localStorage.getItem('cart_count')
  }

  ionViewWillEnter() {
    console.log("view")
    this.searchTerm.reset()
    this.cart_count= localStorage.getItem('cart_count')
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
    if (this.authService.isAuthenticated()) {
      this.client_id = localStorage.getItem('client_id')  
    }
    else{
      this.client_id = null 
    } 
    console.log("client_id",this.client_id)
    this.presentLoading().then(()=>{
      this.homeService.getHomeDetails(this.client_id).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      )})
  }

  handleResponse(data)
  {
   this.loadingController.dismiss()
    console.log(data)
    localStorage.setItem('cart_count',data.cart_count)

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
facebook()
{
  window.open("https://www.facebook.com/deal-on-store-103110191641253")
}
twitter()
{
  window.open("https://twitter.com/dealonstore")
}
insta()
{
  window.open("https://www.instagram.com/deal_on_store/")
}
  
}
