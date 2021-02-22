import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  PopoverController,
  ToastController,
  IonInfiniteScroll,
  ModalController,
  IonRouterOutlet,
} from "@ionic/angular";
import { IonContent } from "@ionic/angular";
import { CartcountService } from "src/app/services/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BrandProductService } from "src/app/services/brandProducts/brand-product.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";

import { FilterComponent } from "../filter/filter.component";
import { CartmodalPage } from "../cartmodal/cartmodal.page";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";


const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
const BUY_NOW = 230;
const WISHLIST = 240;
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
      },
    },
  };
  s3url: string;
  brand_id: number;
  brand_name: string;
  page_limit: number;
  page_count: number = 1;
  current_page: number;
  data: any;
  cart_count: any;
  sortType: any = null;
  name: any;
  currentIndex: number;
  wishlistIndex: any;
  constructor(
    private brandProductService: BrandProductService,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    public router: Router,
    private cartService: CartService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private popOverCtrl: PopoverController,
    private toastController: ToastController,
    private cartCountService: CartcountService,
    private authGuard: AuthGuard,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private wishlistService: WishlistService
  ) {
    this.brand_id = this.activatedRoute.snapshot.params.brand_id;
    this.s3url = this.utils.getS3url();
  }

  ionViewWillEnter() {
    this.authService.getCartCount().then((count) => {
      if (count) {
        this.cart_count = count;
      }
    });
    this.getData();
    this.infiniteScroll.disabled = false;

  }

  ngOnInit() { }

  getData(infiniteScroll?) {

    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((token) => {
        if (token) {
          this.brandProductService
            .getBrandProducts(
              this.brand_id,
              this.page_count,
              token,
              this.sortType
            )
            .subscribe(
              (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
              (error) => this.handleError(error)
            );
        } else {
          this.brandProductService
            .getBrandProducts(
              this.brand_id,
              this.page_count,
              null,
              this.sortType
            )
            .subscribe(
              (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
              (error) => this.handleError(error)
            );
        }
      });
    });
  }

  handleResponse(data, type, infiniteScroll?) {
    if (type == GET_DATA) {
      this.loadingController.dismiss();
      this.page_limit = data.page_count;
      this.data = data;
      this.cart_count = data.cart_count;
      this.data.product.forEach((element) => {
        this.products.push(element);
      });
      this.authService.setCartCount(data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.infiniteScroll.disabled = false;
    } else if (type == POST_DATA) {
      this.loadingController.dismiss();
      this.products[this.currentIndex].cart_count++;
      this.name = this.products[this.currentIndex].name;
      this.cart_count = data.cart_count;
      this.authService.setCartCount(data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.presentToastSuccess("One ' " + this.name + " ' added to cart.");
    } else if (type == BUY_NOW) {
      this.loadingController.dismiss().then(() => {
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentModal();
      });
    } else if (type == WISHLIST) {

      this.loadingController.dismiss().then(() => {
        let name = this.products[this.wishlistIndex].name
        if (this.products[this.wishlistIndex].wishlist == true) {
          this.presentToastSuccess(name + "  removed from wishlist.");
          this.products[this.wishlistIndex].wishlist = !this.products[this.wishlistIndex].wishlist

        }
        else {
          this.presentToastSuccess(name + "  added to wishlist.");

          this.products[this.wishlistIndex].wishlist = !this.products[this.wishlistIndex].wishlist
        }
      })

    }

    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }

  handleError(error) {
    this.loadingController.dismiss();

    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
  }

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count += 1;

      this.getData(infiniteScroll);
    }
  }

  navigateToProduct(index) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
  }

  async openSortMobile() {
    const actionSheet = await this.actionSheetController.create({
      header: "SORT BY",
      mode: "md",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Price - high to low",
          handler: () => {
            this.infiniteScroll.disabled = true;
            this.page_count = 1;
            this.products = [];
            this.sortType = "DESC";
            this.getData();
            this.content.scrollToTop();
          },
        },
        {
          text: "Price - low to high",
          handler: () => {
            this.infiniteScroll.disabled = true;
            this.page_count = 1;
            this.products = [];
            this.sortType = "ASC";
            this.getData();
            this.content.scrollToTop();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async openSort(ev: any) {
    const popover = await this.popOverCtrl.create({
      component: FilterComponent,
      event: ev,
      animated: true,
      showBackdrop: true,
      cssClass: "popover",
    });
    popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.infiniteScroll.disabled = true;
        if (data.data == 2) {
          this.sortType = "ASC";
          this.page_count = 1;
          this.products = [];

          this.getData();
        } else if (data.data == 1) {
          this.sortType = "DESC";
          this.page_count = 1;
          this.products = [];

          this.getData();
        }
      }
    });
    await popover.present();
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


  addToWishlist(index: number) {
    this.wishlistIndex = index
    this.authService.isAuthenticated().then((token) => {
      if (token) {
        this.presentLoading().then(() => {
          let data = {
            product_id: this.products[index].id,
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

  buyNow(index: number) {
    this.authService.isAuthenticated().then((val) => {
      if (val) {
<<<<<<< HEAD
        this.presentLoading().then(() => {
          let data = {
            product_id: this.products[index].id,
            client_id: val,
            qty: 1,
          };
          this.cartService.addToCartQty(data).subscribe(
            (data) => this.handleResponse(data, BUY_NOW),
            (error) => this.handleError(error)
          );
        });

=======
          this.presentLoading().then(() => {
            let data = {
              product_id: this.products[index].id,
              client_id: val
            };
            this.cartService.addToCart(data).subscribe(
              (data) => this.handleResponse(data, BUY_NOW),
              (error) => this.handleError(error)
            );
          });
        
>>>>>>> 090ffa754f0448aebac8c605238f687a98300672
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  goToCart() {
    this.router.navigate(["/cart"]);
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

  doRefresh(event) {
    setTimeout(() => {
      this.page_count = 1;
      this.products = [];
      this.getData();
      event.target.complete();
    }, 2000);
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

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Required quantity unavailable",

      message:
        "This item is not available in the volume required by you.<br/><br/>"
        + msg +
        "<br/> <br/> Please contact via Email or WhatsApp to order in more volume.",
      buttons: ["OK"],
    });

    await alert.present();
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
  }


  ionViewWillLeave() {
    this.page_count = 1;
    this.products = [];
    this.infiniteScroll.disabled = true;

  }

}
