import { CompileShallowModuleMetadata } from "@angular/compiler";
import { Route } from "@angular/compiler/src/core";
import { Content } from "@angular/compiler/src/render3/r3_ast";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Data, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  PopoverController,
  ToastController,
  IonInfiniteScroll,
} from "@ionic/angular";
import { IonContent } from "@ionic/angular";
import { CartcountService } from "src/app/cartcount.service";
import { AuthGuard } from "src/app/guards/auth.guard";
import { AuthenticationService } from "src/app/services/authentication.service";
import { CartService } from "src/app/services/cart/cart.service";
import { OfferService } from "src/app/services/offer/offer.service";
import { UtilsService } from "src/app/services/utils.service";
import { FilterComponent } from "../filter/filter.component";

const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
@Component({
  selector: "app-offer",
  templateUrl: "./offer.page.html",
  styleUrls: ["./offer.page.scss"],
})
export class OfferPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  products: Array<any> = [];
  data: any;
  s3url: any;
  page_limit: number;
  page_count: number = 1;
  current_page: number;

  sortType: any = null;
  scroll: boolean = true;
  cart_count: any;
  name: any;

  constructor(
    private offerService: OfferService,
    private utils: UtilsService,
    public router: Router,
    private actionSheetController: ActionSheetController,
    private cartService: CartService,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private popOverCtrl: PopoverController,
    private toastController: ToastController,
    private cartCountService: CartcountService,
    private authGuard: AuthGuard
  ) {
    this.s3url = utils.getS3url();
  }

  ionViewWillEnter() {
    this.page_count = 1;
    this.products = [];
    this.getData();
    this.authService.getCartCount().then((count) => {
      if (count) {
        this.cart_count = count;
      }
    });
  }

  ngOnInit() {}

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.authService.isAuthenticated().then((val) => {
        if (val) {
          this.offerService
            .getOfferProducts(val, this.page_count, this.sortType)
            .subscribe(
              (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
              (error) => this.handleError(error)
            );
        } else {
          this.offerService
            .getOfferProducts(null, this.page_count, this.sortType)
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
      this.loadingController.dismiss().then(() => {
        this.page_limit = data.page_count;
        this.cart_count = data.cart_count;
        data.product.forEach((element) => {
          this.products.push(element);
        });
        this.cartCountService.setCartCount(data.cart_count);
        this.authService.setCartCount(data.cart_count);
      });
    } else if (type == POST_DATA) {
      this.loadingController.dismiss().then(() => {
        this.cart_count = data.cart_count;
        this.authService.setCartCount(data.cart_count);
        this.cartCountService.setCartCount(data.cart_count);
        this.presentToastSuccess("One ' " + this.name + " ' added to cart.");
      });
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

  addToCart(index: number) {
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

        this.products[index].cart_count++;
        this.name = this.products[index].name;
      } else {
        this.authGuard.presentModal();
      }
    });
  }

  goToCart() {
    this.router.navigate(["/cart"]);
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

  loadMoreContent(infiniteScroll) {
    // console.log("loadMoreContent", this.page_count);
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count++;
      // console.log("from load more content");
      this.getData(infiniteScroll);
    }
  }

  async presentLoading() {
    console.log("1");
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }

  navigateToProduct(index) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", id, { catId }]);
  }

  doRefresh(event) {
    this.page_count = 1;
    this.products = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  openSortMobile() {
    this.presentActionSheet();
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
            this.content.scrollToTop(1500);
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
            // console.log(this.scroll, "sort");
            this.content.scrollToTop(1500);
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      duration: 1500,
      color: "dark",
    });
    toast.present();
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
}
