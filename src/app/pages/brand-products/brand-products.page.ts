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
import { IonContent } from "@ionic/angular";
import { CartcountService } from "src/app/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BrandProductService } from "src/app/services/brandProducts/brand-product.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";

import { FilterComponent } from "../filter/filter.component";

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
    private loadingController: LoadingController,
    private popOverCtrl: PopoverController,
    private toastController: ToastController,
    private cartCountService: CartcountService,
    private authGuard:AuthGuard
  ) {
    this.brand_id = activatedRoute.snapshot.params.brand_id;
    this.s3url = utils.getS3url();
  }

  ionViewWillEnter() {
    
    this.authService.getCartCount().then((count) => {
      if (count) {
        this.cart_count = count;
      }
    });
    this.getData();
  }

  ngOnInit() {}

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
    } else if (type == POST_DATA) {
      this.loadingController.dismiss();
      this.products[this.currentIndex].cart_count++;
      this.name = this.products[this.currentIndex].name;
      this.cart_count = data.cart_count;
      this.authService.setCartCount(data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.presentToastSuccess("One ' " + this.name + " ' added to cart.");
    }

    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }


    
  }
  handleError(error) {
    this.loadingController.dismiss();
    // console.log(error);
    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
  }

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count += 1;
      // console.log(this.page_count)
      this.getData(infiniteScroll);
    }
  }

  navigateToProduct(index) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
  }

  async presentActionSheet() {
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
          },
        },
      ],
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
    this.currentIndex = index;
    this.authService.isAuthenticated().then((val) => {
      if (val) {
        this.presentLoading().then(() => {
          let data = {
            product_id: this.products[index].id,
            client_id: val,
          };
          this.cartService.addToCart(data).subscribe(
            (data) => this.handleResponse(data, POST_DATA),
            (error) => this.handleError(error)
          );
        });
      } else {
        this.authGuard.presentModal()
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
    this.page_count = 1;
    this.products = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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


  opensortMobile() {
    this.presentActionSheet();
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
      header: "Alert",

      message:
        msg +
        " For ordering large quantities contact us through email or whatsapp.",
      buttons: ["OK"],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    this.page_count = 1;
    this.products = [];
    // this.infiniteScroll.disabled = true;
  }
}
