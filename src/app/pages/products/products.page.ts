import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  IonInfiniteScroll,
  ModalController,
  Platform,
  PopoverController,
  ToastController,
  IonRouterOutlet,
} from "@ionic/angular";
import { utils } from "protractor";
import { SubcatProductsService } from "src/app/services/subcatProducts/subcat-products.service";
import { UtilsService } from "src/app/services/utils.service";

import { FilterComponent } from "../filter/filter.component";
import { CartmodalPage } from "../cartmodal/cartmodal.page";

import { CartService } from "src/app/services/cart/cart.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { IonContent } from "@ionic/angular";
import { CartcountService } from "src/app/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";
const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
const BUY_NOW = 230;
const WISHLIST = 240;
@Component({
  selector: "app-products",
  templateUrl: "./products.page.html",
  styleUrls: ["./products.page.scss"],
})
export class ProductsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  products: Array<any> = [];

  page_limit: number;
  page_count: number = 1;
  catId: any;
  category_name: any;
  s3url: string;
  data: any;
  isSort: boolean = false;
  sortType: any = null;
  cart_count: any;
  name: any;
  currentIndex: number;
  wishlistIndex:any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private CatProductService: SubcatProductsService,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private cartService: CartService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private popOverCtrl: PopoverController,
    private toastController: ToastController,
    private cartCountService: CartcountService,
    private authGuard: AuthGuard,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private wishlistService:WishlistService
  ) {
    this.page_count = 1;
    this.s3url = this.utils.getS3url();
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.category_name = this.activatedRoute.snapshot.paramMap.get("name");
    
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.cartCountService.getCartCount().subscribe((val) => {
      this.cart_count = val;
      
    });
    this.getData();
    this.infiniteScroll.disabled = false;
  }

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((res) => {
        if (res) {
          this.CatProductService.getSubCatProducts(
            this.catId,
            res,
            this.page_count,
            this.sortType
          ).subscribe(
            (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
            (error) => this.handleError(error)
          );
        } else {
          this.CatProductService.getSubCatProducts(
            this.catId,
            null,
            this.page_count,
            this.sortType
          ).subscribe(
            (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data, type, infiniteScroll?) {
    if (type == GET_DATA) {
      this.loadingController.dismiss().then(() => {
        this.data = data;
        this.data.products.forEach((element) => {
          this.products.push(element);
        });
        this.page_limit = data.page_count;
        this.cart_count = data.cart_count;
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.infiniteScroll.disabled = false;
      });
    } else if (type == POST_DATA) {
      this.loadingController.dismiss().then(() => {
        this.products[this.currentIndex].cart_count++;
        this.name = this.products[this.currentIndex].name;
        this.cart_count = data.cart_count;
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentToastSuccess("One ' " + this.name + " ' added to cart.");
      });
    } else if (type == BUY_NOW) {
      this.loadingController.dismiss().then(() => {
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentModal();
      });
    } else if (type == WISHLIST) {
      this.loadingController.dismiss().then(()=>{
        let name = this.products[this.wishlistIndex].name
        if(this.products[this.wishlistIndex].wishlist==true)
        {
          this.presentToastSuccess(name + "  removed from wishlist.");
          this.products[this.wishlistIndex].wishlist=!this.products[this.wishlistIndex].wishlist

        }
        else{
          this.presentToastSuccess(name + "  added to wishlist.");
         
           this.products[this.wishlistIndex].wishlist=!this.products[this.wishlistIndex].wishlist
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

  navigateToProduct(index: number) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
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

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count += 1;
      this.getData(infiniteScroll);
    }
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
    this.authService.isAuthenticated().then((token) => {
      if (token) {
        this.presentLoading().then(() => {
          let data = {
            product_id: this.products[index].id,
            client_id: token,
          };
          this.cartService.addToCart(data).subscribe(
            (data) => this.handleResponse(data, POST_DATA),
            (error) => this.handleError(error)
          );
        });
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  addToWishlist(index:number)
  {
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
        // if(this.products[index].cart_count>0){
        // this.presentModal();
        // }
        // else{
          this.presentLoading().then(() => {
            // this.products[index].cart_count=this.products[index].cart_count+1 
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
        // }
        
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  goToCart() {
    this.router.navigate(["tabs/cart"]);
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

  doRefresh(event) {
    this.page_count = 1;
    this.products = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Low Stock Alert",

      message:
        msg +
        " For ordering large quantities contact us through email or whatsapp.",
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

    // await modal.onDidDismiss().then((data) => {
    //   if ((data.data = 1)) {
    //     this.page_count = 1;
    //     this.products = [];
    //     this.getData();
    //   }
    // });
  }

  ionViewWillLeave() {
  
    this.page_count = 1;
    this.products = [];
    this.infiniteScroll.disabled = true;

  }
}
