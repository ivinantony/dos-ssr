import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AlertController,
  IonRouterOutlet,
  IonSlides,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartService } from "src/app/services/cart/cart.service";
import { ProductDetailsService } from "src/app/services/productDetails/product-details.service";
import { UtilsService } from "src/app/services/utils.service";
import { CartmodalPage } from "../cartmodal/cartmodal.page";
import { CartcountService } from "src/app/services/cartcount.service";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";

const GET_DATA = 200;
const POST_DATA = 210;
const BUY_NOW = 240;
const WISHLIST = 250;

@Component({
  selector: "app-product",
  templateUrl: "./product.page.html",
  styleUrls: ["./product.page.scss"],
})
export class ProductPage implements OnInit {
  @ViewChild("slides", { static: false }) slides: IonSlides;
  recommendedSlides = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 5,
    centeredSlides: true,
    updateOnWindowResize: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
      loop: true,
    },
    speed: 400,
    breakpoints: {
      // when window width is <= 320px
      320: {
        slidesPerView: 1.3,
        initialSlide: 0,
        spaceBetween: 5,
        loop: true,
        centeredSlides: true,
      },
      480: {
        slidesPerView: 2,
        initialSlide: 0,
        spaceBetween: 3,
        loop: true,
      },
      // when window width is <= 640px
      768: {
        slidesPerView: 3,
        initialSlide: 1,
        spaceBetween: 5,
        loop: true,
        centeredSlides: true,
      },
    },
  };

  slidesOptionsThumbnail = {
    slidesPerView: 4,
    initialSlide: 0,
    spaceBetween: 0,
    centeredSlides: true,
  };

  slidesOptions = {
    slidesPerView: 1,
    initialSlide: 0,
  };

  product: any;
  productId: any;
  catId: any;
  productDetails: any;
  s3url: string;
  qty: number = 1;
  data: any;
  lens: any;
  myThumbnail: any;
  myFullresImage: any;
  appUrl: any;
  cart_count:any;

  constructor(
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
    private cartCountService: CartcountService,
    private authGuard:AuthGuard,
    private wishlistService:WishlistService
  ) {
    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get("catId"));
    this.s3url = utils.getS3url();
  }

  ngOnInit() {
    this.appUrl = window.location.hostname + this.router.url;  
  }

  ionViewWillEnter() {
    this.cartCountService.getCartCount().subscribe((val) => {
      this.cart_count = val;
    });
    this.getData();
  }

 

  getData() {
    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((val) => {
        if (val) {
          this.productsDetailsService
            .getProductDetails(this.productId, val)
            .subscribe(
              (data) => this.handleResponse(data, GET_DATA),
              (error) => this.handleError(error)
            );
        } else {
          this.productsDetailsService
            .getProductDetails(this.productId, val)
            .subscribe(
              (data) => this.handleResponse(data, GET_DATA),
              (error) => this.handleError(error)
            );
        }
      });
    });
  }

  handleResponse(data, type) {
    if (type == GET_DATA) {
      this.data = data;
      this.cartCountService.setCartCount(data.cart_count);
      this.authService.setCartCount(data.cart_count);
      this.productDetails = data.product;
      for (let i = 0; i < this.productDetails.images.length; i++) {
        this.productDetails.images[i].path =
          this.s3url + this.productDetails.images[i].path;
      }
      this.myThumbnail = this.productDetails.images[0].path;
      this.myFullresImage = this.productDetails.images[0].path;

      this.loadingController.dismiss();
    } else if (type == POST_DATA) {
      this.getData();
    } else if (type == BUY_NOW) {
      this.productDetails.cart_count++;
      this.presentModal();
    } else if (type == WISHLIST) {
      this.loadingController.dismiss().then(()=>{
        
        if(this.productDetails.wishlist==true)
        {
          this.presentToastSuccess(this.productDetails.name + "  removed from wishlist.");
          this.authService.setWishCount(data.wish_count);
          this.wishlistService.setWishCount(data.wish_count);
          this.productDetails.wishlist=!this.productDetails.wishlist

        }
        else{
          this.presentToastSuccess(this.productDetails.name + "  added to wishlist.");
          this.authService.setWishCount(data.wish_count);
          this.wishlistService.setWishCount(data.wish_count);
           this.productDetails.wishlist=!this.productDetails.wishlist
        }
      })
    }
  }

  handleError(error) {
    this.loadingController.dismiss;
    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
    else{
      this.presentToast(error.error.message)
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CartmodalPage,
      cssClass: "cartmodal",
      componentProps: { value: 123 },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();

    await modal.onDidDismiss().then((data) => {
      if ((data.data = 1)) {
        this.getData();
      }
    });
  }

  add() {
    this.qty += 1;
  }
  subtract() {
    this.qty -= 1;
  }

  addToCart() {
    this.authService.isAuthenticated().then((val) => {
      if (val) {
        let data = {
          product_id: this.productDetails.id,
          client_id: val,
          qty: this.qty,
        };
        this.cartService.addToCartQty(data).subscribe(
          (data) => this.handleResponse(data, POST_DATA),
          (error) => this.handleError(error)
        );
      } else {
        this.authGuard.presentModal()
      }
    });
  }

  addToWishlist()
  {
    
    this.authService.isAuthenticated().then((token) => {
      if (token) {
        this.presentLoading().then(() => {
          let data = {
            product_id: this.productDetails.id,
            client_id: token,
          };
          this.wishlistService.wishlist(data).subscribe(
            (data) => this.handleResponse(data, WISHLIST),
            (error) => this.handleError(error)
          );
        });
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  buyNow() {
    this.authService.isAuthenticated().then((val) => {
      if (val) {
        let data = {
          product_id: this.productDetails.id,
          client_id: val,
          qty: this.qty,
        };
        this.cartService.addToCart(data).subscribe(
          (data) => this.handleResponse(data, BUY_NOW),
          (error) => this.handleError(error)
        );
      } else {
        this.authGuard.presentModal()
      }
    });
  }

  goToCart() {
    this.router.navigate(["/tabs/cart"]);
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
      "https://api.whatsapp.com/send?phone=447417344825&amp;text=I%20have%20an%20enquiry%20about%20the%20product%20('" +
        this.productDetails.name +
        "')",
      this.productDetails.name
    );
  }

  mail() {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=info@dealonstore.com"
    );
  }

  qtyIncrease() {
    this.qty = this.qty + 1;
  }
  qtyDecrease() {
    if (this.qty > 1) {
      this.qty = this.qty - 1;
    }
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      color: "dark",
      duration: 1500,
    });
    toast.present();
  }

  slideTo(index: number) {
    this.slides.slideTo(index, 500);
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Required quantity unavailable",

      message:
      "Sorry we are unable to process with your required quantity, please contact via whatsapp or email." ,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }
}
