import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  PopoverController,
  ToastController,
  IonInfiniteScroll,
} from "@ionic/angular";
import { IonContent } from '@ionic/angular';
import { CartcountService } from "src/app/cartcount.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BrandProductService } from "src/app/services/brandProducts/brand-product.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";

import { FilterComponent } from '../filter/filter.component';

const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
@Component({
  selector: "app-brand-products",
  templateUrl: "./brand-products.page.html",
  styleUrls: ["./brand-products.page.scss"],
})
export class BrandProductsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  products: Array<any> = [];
  sortOptions: Array<any> = [
    {
      option: "Price - High to low",
      isChecked: false,
    },
    {
      option: "Price - Low to high",
      isChecked: false,
    },
  ];
  // bannerSlideOpts = {
  //   slidesPerView: 1,
  //   initialSlide: 0,
  //   spaceBetween: 20,
  //   loop: true,
  //   centeredSlides: true,
  //   autoplay: {
  //     delay: 3000,
  //     disableOnInteraction: false,
  //   },
  //   speed: 400,
  // };
  bannerSlideOpts = {
    updateOnWindowResize: true,
    breakpoints: {

      // when window width is <= 320px
      320: {
        slidesPerView: 1,
        initialSlide: 0,
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        speed: 400,
      },
      // when window width is <= 640px
      768: {
        slidesPerView: 3,
        initialSlide: 0,
        spaceBetween: 10,
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        speed: 400,
      }
    }
  }
  s3url: string;
  brand_id: number;
  brand_name: string;
  page_limit: number;
  page_count: number = 1;
  current_page: number;
  client_id: any;
  data: any;
  cart_count:any
  sortType:any=null
  name:any
  constructor(
    private brandProductService: BrandProductService,
    private platform: Platform,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    public router: Router,
    private cartService: CartService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController:LoadingController,
    private popOverCtrl:PopoverController,
    private toastController:ToastController,
    private cartCountService:CartcountService
  ) {
    this.client_id = localStorage.getItem("client_id");

    this.brand_id = activatedRoute.snapshot.params.brand_id;
    this.s3url = utils.getS3url();
    // this.checkWidth();
    // console.log("first")
    this.page_count=1
    this.products= []
    // this.getData()
    
  }

  
  ionViewWillEnter()
  {
    this.getData()
    this.cart_count = localStorage.getItem('cart_count')
  }

  ngOnInit() { }

 

  getData(infiniteScroll?) {
    this.presentLoading().then(()=>{
      this.brandProductService.getBrandProducts(this.brand_id, this.page_count, this.client_id,this.sortType)
      .subscribe(
        (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
        (error) => this.handleError(error)
      )
    }
    )
  }

  handleResponse(data, type, infiniteScroll?) {
    this.infiniteScroll.disabled = false;
    
    // console.log(infiniteScroll)
    if (type == GET_DATA) {
      this.loadingController.dismiss()
      // console.log(data);
      this.page_limit = data.page_count;
      this.data = data;
      this.cart_count = data.cart_count
      localStorage.setItem("cart_count",data.cart_count)
      this.data.product.forEach((element) => {
        this.products.push(element);
      });
      // console.log(this.products, "API called");
    }
    else if(type == POST_DATA)
    {
      // console.log("add to cart",data)
      this.cart_count = data.cart_count
      localStorage.setItem("cart_count",data.cart_count)
      this.cartCountService.setCartCount(data.cart_count)
      this.presentToastSuccess("One ' " + this.name +" ' added to cart.");
    }
    // console.log(data);

    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error) {
    this.loadingController.dismiss()
    // console.log(error);
    if(error.status == 400)
    {
      this.presentAlert(error.error.message)
    }
  }



  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } 
    else {


      this.page_count+=1;
      // console.log(this.page_count)
      this.getData(infiniteScroll);
    }
  }

  navigateToProduct(index) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product",id, { catId }]);
  }



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'SORT BY',
      mode:'md',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Price - high to low',
        handler: () => {
          this.infiniteScroll.disabled = true;
          this.page_count=1
          this.products= []
          this.sortType='DESC'
          this.getData()
        }
      }, {
        text: 'Price - low to high',
        handler: () => {
          this.infiniteScroll.disabled = true;
          this.page_count=1
          this.products= []
          this.sortType='ASC'
          this.getData()
        }
      }]
    });
    await actionSheet.present();
  }

  async presentLogin() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "You Are Not Logged In",
      message: "Log in to continue.",
      buttons: [
        {
          text: "Login",
          handler: () => {
            this.router.navigate(["login"]);
          },
        },
      ],
    });

    await alert.present();
  }

  addToCart(index: number) {
    if (this.authService.isAuthenticated()) {
      let data = {
        product_id: this.products[index].id,
        client_id: this.client_id,
      };
      this.cartService.addToCart(data).subscribe(
        (data) => this.handleResponse(data, POST_DATA),
        (error) => this.handleError(error)
      );
      this.products[index].cart_count++;
      //  this.getData()
      this.name = this.products[index].name

        // this.presentToastSuccess("One ' " + name +" ' added to cart.");
        localStorage.setItem('cart_count',this.cart_count)
    } else {
      this.presentLogin();
    }
  }

  goToCart()
  {
    this.router.navigate(['cart'])
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

  doRefresh(event) {
    this.page_count=1
    this.products= []
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async openSort(ev:any) {
    const popover = await this.popOverCtrl.create({  
      component: FilterComponent, 
      event:ev,   
      animated: true, 
      showBackdrop: true ,
      cssClass:'popover' 
    });  

   popover.onDidDismiss().then((data)=>{
    if(data.data)
    this.infiniteScroll.disabled = true;

    {
      // console.log("hello")
      
      if(data.data == 2)
      {
        // console.log("low to high")
        this.sortType = 'ASC'
        this.page_count=1
        this.products= []
        this.getData()
      }
      else if(data.data == 1){
      //  console.log("high to low")
 
       this.sortType = 'DESC'
       this.page_count=1
       this.products= []
       this.getData()
      }
    }
    })
   await popover.present(); 
  }

  opensortMobile()
  {
    this.presentActionSheet()
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      
      duration: 1500,
    });
    toast.present();
  }
  async presentAlert(msg:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Low Stock Alert',
     
      message:msg + "\ For ordering large quantities contact us through email or whatsapp.",
      buttons: ['OK']
    });

    await alert.present();
  }
}
