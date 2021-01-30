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
} from "@ionic/angular";
import { utils } from "protractor";
import { SubcatProductsService } from "src/app/services/subcatProducts/subcat-products.service";
import { UtilsService } from "src/app/services/utils.service";

import { FilterComponent } from "../filter/filter.component";

import { CartService } from "src/app/services/cart/cart.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { IonContent } from "@ionic/angular";
import { CartcountService } from "src/app/cartcount.service";
const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
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
  client_id: any;
  catId: any;
  category_name: any;
  s3url: string;
  data: any;
  isSort: boolean = false;
  sortType: any = null;
  cart_count: any;
  name: any;

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
    private cartCountService: CartcountService
  ) {
    this.page_count = 1;
    this.s3url = utils.getS3url();
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    this.category_name = this.activatedRoute.snapshot.paramMap.get("name");
    this.client_id = Number(localStorage.getItem("client_id"));
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.page_count = 1;
    this.products = [];
    this.getData();
    this.cart_count = localStorage.getItem("cart_count");
  }

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.CatProductService.getSubCatProducts(
        this.catId,
        this.client_id,
        this.page_count,
        this.sortType
      ).subscribe(
        (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
        (error) => this.handleError(error)
      );
    });
  }

  handleResponse(data, type, infiniteScroll?) {
    this.infiniteScroll.disabled = false;
    
    if (type == GET_DATA) {
      this.loadingController.dismiss();
      this.data = data;
      this.data.products.forEach((element) => {
        this.products.push(element);
      });
      this.page_limit = data.page_count;
      this.cart_count = data.cart_count;
      localStorage.setItem("cart_count", data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
    } else if (type == POST_DATA) {
      this.loadingController.dismiss();
      this.cart_count = data.cart_count;
      localStorage.setItem("cart_count", data.cart_count);
      this.cartCountService.setCartCount(data.cart_count);
      this.presentToastSuccess("One ' " + this.name + " ' added to cart.");
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
    
    if (this.authService.isAuthenticated()) {
      this.presentLoading().then(()=>{
        let data = {
          product_id: this.products[index].id,
          client_id: this.client_id,
        };
        this.cartService.addToCart(data).subscribe(
          (data) => this.handleResponse(data, POST_DATA),
          (error) => this.handleError(error)
        );
      })
      
      this.products[index].cart_count++;

      this.name = this.products[index].name;
    } else {
      this.presentLogin();
    }
  }

  goToCart() {
    this.router.navigate(["/tabs/cart"]);
  }

  removeFromcart(index: number) {
    this.cartService
      .removeFromCart(this.client_id, this.products[index].id)
      .subscribe(
        (data) => this.handleResponse(data, DEL_DATA),
        (error) => this.handleError(error)
      );
    this.products[index].cart_count--;
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

  opensortMobile() {
    this.presentActionSheet();
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
