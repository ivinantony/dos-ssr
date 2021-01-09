import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  IonFab,
  IonRouterOutlet,
  IonSlides,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartService } from "src/app/services/cart/cart.service";
import { ProductDetailsService } from "src/app/services/productDetails/product-details.service";
import { UtilsService } from "src/app/services/utils.service";
import { CartPage } from "../cart/cart.page";
import { CartmodalPage } from "../cartmodal/cartmodal.page";
import { CartcountService } from "src/app/cartcount.service";


const GET_DATA = 200;
const POST_DATA = 210;
const GET_CART = 220;
const DEL_DATA = 230;
@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"],
})
export class ProductPage implements OnInit {
  @ViewChild("slides", { static: false }) slides: IonSlides;
  recommendedSlides = {
    slidesPerView: 1.5,
    initialSlide: 0,
    spaceBetween: 5,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      loop: true,
    },
  };


  slidesOptionsThumbnail={
    slidesPerView: 4,
    initialSlide: 0,
    spaceBetween: 0,
    centeredSlides: true,
  }

  slidesOptions={
    slidesPerView: 1,
    initialSlide: 0,
   
  }

  product: any;
  productId: any;
  catId: any;
  productDetails: any;
  s3url: string;
  qty: number = 1;
  data: any;
  lens: any;
  client_id: any;
  myThumbnail: any;
  myFullresImage: any;
  appUrl:any
  constructor(
    private platform: Platform,
    private modalController: ModalController,
    public authencationservice: AuthenticationService,
    public checkloginGuard: AuthGuard,
    private toastController: ToastController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private productsDetailsService: ProductDetailsService,
    private utils: UtilsService,
    private cartService: CartService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private routerOutlet: IonRouterOutlet,
    private cartCountService:CartcountService
  ) {
    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get("catId"));
    // this.product = PRODUCTS.find(data => data.id == this.productId)
    this.client_id = localStorage.getItem("client_id");
    this.s3url = utils.getS3url();
    this.checkWidth();
    this.platform.resize.subscribe(async () => {
      // console.log("Resize event detected", this.platform.width());
      this.checkWidth();
    });

    this.client_id = localStorage.getItem("client_id");
  }

  ngOnInit() {

    this.appUrl = window.location.hostname + this.router.url
  }

  ionViewWillEnter() {
    this.getData();
  }

  // getData()
  // {

  //   this.productsDetailsService.getProductDetails().subscribe(
  //     (data)=>this.handleResponse(data,GET_DATA),
  //     (error)=>this.handleError(error)
  //   )
  // }

  getData() {
    this.presentLoading().then(() => {
      this.productsDetailsService
        .getProductDetails(this.productId, this.client_id)
        .subscribe(
          (data) => this.handleResponse(data, GET_DATA),
          (error) => this.handleError(error)
        );
    });
  }

  handleResponse(data, type) {
    if (type == GET_DATA) {
      this.data = data;
      // console.log(data);
      this.cartCountService.setCartCount(data.cart_count)
      this.productDetails = data.product;
      for (let i = 0; i < this.productDetails.images.length; i++) {
        this.productDetails.images[i].path =
          this.s3url + this.productDetails.images[i].path;
      }

      this.myThumbnail = this.productDetails.images[0].path;
      this.myFullresImage = this.productDetails.images[0].path;

      this.loadingController.dismiss();
    }
   
  }
  handleError(error) {
    this.loadingController.dismiss;
    // console.log(error);
  }

  onSubmit() {
    let data = {
      product_id: this.productDetails.id,
      client_id: localStorage.getItem("client_id"),
    };
    this.cartService.addToCart(data).subscribe(
      (data) => this.handleResponse(data, POST_DATA),
      (error) => this.handleError(error)
    );
    this.presentToast();
  }
  viewCart() {
    let client_id = localStorage.getItem("client_id");
    this.cartService.getCart(client_id).subscribe(
      (data) => this.handleResponse(data, GET_CART),
      (error) => this.handleError(error)
    );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Added to Cart.",
      cssClass: "custom-toast",
      duration: 2000,
      buttons: [
        {
          text: "View Cart",
          handler: () => {
            this.router.navigate(["cart"]);
          },
        },
      ],
    });
    toast.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CartmodalPage,
      cssClass:'cartmodal',
      componentProps: { value: 123 },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();

    await modal.onDidDismiss().then((data) => {
      if(data.data = 1)
      {
      this.getData();
      }
    }); 
    
  }


  checkWidth() {
    if (this.platform.width() > 768) {
      this.recommendedSlides = {
        slidesPerView: 3.5,
        spaceBetween: 10,
        initialSlide: 1,
        centeredSlides: true,
        autoplay: {
          delay: 2700,
          disableOnInteraction: false,
          loop: true,
        },
      };
    }
  }
  add() {
    this.qty += 1;
  }
  subtract() {
    this.qty -= 1;
  }

  addToCart() {
    if (this.authService.isAuthenticated()) {
      let data = {
        product_id: this.productDetails.id,
        client_id: this.client_id,
        qty:this.qty
      };
      this.cartService.addToCartQty(data).subscribe(
        (data) => this.handleResponse(data, POST_DATA),
        (error) => this.handleError(error)
      );
      this.productDetails.cart_count++;
      //  this.getData()
      let name = this.productDetails.name
      this.presentToastSuccess(data.qty + " ' " + name +" ' added to cart.");
      this.getData()
    } else {
      this.presentLogin();
    }
  }

  buyNow()
  {
    if (this.authService.isAuthenticated()) {
      let data = {
        product_id: this.productDetails.id,
        client_id: this.client_id,
        qty:this.qty
      };
      this.cartService.addToCartQty(data).subscribe(
        (data) => this.handleResponse(data, POST_DATA),
        (error) => this.handleError(error)
      );
      this.productDetails.cart_count++;
      //  this.getData()
      let name = this.productDetails.name
      this.presentModal()
      
      // this.presentToastSuccess(data.qty + " '" + name +" ' added to cart.");
    } else {
      this.presentLogin();
    }
  }

  goToCart() {
    this.router.navigate(["cart"]);
  }

  removeFromcart() {
    this.cartService
      .removeFromCart(this.client_id, this.productDetails.id)
      .subscribe(
        (data) => this.handleResponse(data, DEL_DATA),
        (error) => this.handleError(error)
      );
    // this.getData()
    this.productDetails.cart_count--;
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

  navigateToProduct(index: number) {
    let id = this.data.category_products[index].id;
    let catId = this.data.category_products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
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

  whatsapp() {
    window.open(
      "https://api.whatsapp.com/send?phone=447440700295&amp;text=I%20have%20an%20enquiry%20about%20the%20product%20('" +
        this.productDetails.name +
        "')",
      this.productDetails.name
    );
  }

  mail() {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=dealonstoreuae@gmail.com"
    );
    // window.open('mailto:dealonstoreuae@gmail.com?subject=subject&body=body');
    // window.location.href = "mailto:dealonstoreuae@gmail.com?subject=Subject&body=message%20goes%20here";
  }

  qtyIncrease() {
    this.qty = this.qty + 1;
    
  }
  qtyDecrease() {
    if(this.qty>1)
      {
    this.qty = this.qty - 1;  
      }
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

  slideTo(index: number) {
    this.slides.slideTo(index, 500);
  }
}
