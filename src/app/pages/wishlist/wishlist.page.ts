import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { CartcountService } from "src/app/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";
const REMOVE = 200;
const GET_DATA = 210;
const ADD_TO_CART = 220;
@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.page.html",
  styleUrls: ["./wishlist.page.scss"],
})
export class WishlistPage implements OnInit {
  s3url: any;
  wishlist: Array<any> = [];
  client_id: any;
  removedIndex:any;
  cart_count: any;
  currentIndex:any;
  constructor(
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private wishlistService: WishlistService,
    private utils: UtilsService,
    public router: Router,
    private alertController: AlertController,
    private cartCountService:CartcountService,
    private cartService:CartService,
    private authGuard:AuthGuard,
    private toastController:ToastController
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
      console.log(data);
      this.wishlist = data.wishlist;
    } else if (type == REMOVE) {
      this.wishlist.splice(this.removedIndex,1)
      this.loadingController.dismiss();
      console.log(data);
    } else if (type == ADD_TO_CART) {
      this.loadingController.dismiss().then(() => {
        
       let name = this.wishlist[this.currentIndex].name;
        
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentToastSuccess(name + " added to cart.");
      });
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
    console.log(error);
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
    this.removedIndex = index
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
            client_id: token
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
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
