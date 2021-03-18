import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import {
  AlertController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { CartcountService } from "src/app/services/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";
import { CartmodalPage } from "../cartmodal/cartmodal.page";

const REMOVE = 200;
const GET_DATA = 210;
const ADD_TO_CART = 220;
const BUY_NOW = 230;
@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.page.html",
  styleUrls: ["./wishlist.page.scss"],
})
export class WishlistPage implements OnInit {
  s3url: any;
  wishlist: Array<any> = [];
  client_id: any;
  removedIndex: any;
  cart_count: any;
  currentIndex: any;
  constructor(
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private wishlistService: WishlistService,
    private utils: UtilsService,
    public router: Router,
    private alertController: AlertController,
    private cartCountService: CartcountService,
    private cartService: CartService,
    private authGuard: AuthGuard,
    private toastController: ToastController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet
  ) {
    this.s3url = this.utils.getS3url();

    this.getData();
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.cartCountService.getCartCount().subscribe((val) => {
      this.cart_count = val;
    });
  }

  getData() {
    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((val) => {
        if (val) {
          this.client_id = val;
          this.wishlistService.getWishlist(val).subscribe(
            (data) => this.handleResponse(data, GET_DATA),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  handleResponse(data, type) {
    if (type == GET_DATA) {
      this.loadingController.dismiss();
      this.wishlist = data.wishlist;
    } else if (type == REMOVE) {
      this.wishlist.splice(this.removedIndex, 1);
      this.loadingController.dismiss();

      this.authService.setWishCount(data.wish_count);
      this.wishlistService.setWishCount(data.wish_count);

    } else if (type == ADD_TO_CART) {
      this.loadingController.dismiss().then(() => {
        let name = this.wishlist[this.currentIndex].name;

        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentToast(name + " added to cart.");
      });
    } else if (type == BUY_NOW) {
      this.loadingController.dismiss().then(() => {
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentModal();
      });
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
    if (error.status == 400) {
      this.presentAlert(error.error.message);
    }
    else{
      this.presentToast(error.error.message)
    }
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

  continueShopping() {
    this.router.navigate(["/tabs/home"]);
  }

  async remove(index: number) {
    this.removedIndex = index;
    let name = this.wishlist[index].name;
    let id = this.wishlist[index].id;
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Remove From Wishlist",
      message: "Do you want to remove " + name + " from wishlist",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Confirm",
          cssClass: "secondary",
          handler: () => {
            let data = {
              product_id: this.wishlist[index].id,
              client_id: this.client_id,
            };

            this.presentLoading().then(() => {
              this.wishlistService.wishlist(data).subscribe(
                (data) => this.handleResponse(data, REMOVE),
                (error) => this.handleError(error)
              );
            });
          },
        },
      ],
    });

    await alert.present();
  }

  navigateToProduct(index: number) {
    let id = this.wishlist[index].id;
    this.router.navigate(["product", id]);
  }

  moveToCart(index: number) {
    this.currentIndex = index;
    this.authService.isAuthenticated().then((token) => {
      if (token) {
        this.presentLoading().then(() => {
          let data = {
            product_id: this.wishlist[index].id,
            client_id: token,
          };
          this.cartService.addToCart(data).subscribe(
            (data) => this.handleResponse(data, ADD_TO_CART),
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
        if (this.wishlist[index].cart_count > 0) {
          this.presentModal();
        } else {
          this.presentLoading().then(() => {
            this.wishlist[index].cart_count =
              this.wishlist[index].cart_count + 1;
            let data = {
              product_id: this.wishlist[index].id,
              client_id: val,
              qty: 1,
            };
            this.cartService.addToCartQty(data).subscribe(
              (data) => this.handleResponse(data, BUY_NOW),
              (error) => this.handleError(error)
            );
          });
        }
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      color: "dark",
      duration: 1500,
    });
    toast.present();
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

  doRefresh(event) {
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
