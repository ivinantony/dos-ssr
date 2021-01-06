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
import { IonContent } from '@ionic/angular';
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
  client_id: any;
  sortType: any = null;
  scroll:boolean=true
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
    private toastController: ToastController
  ) {
    this.client_id = localStorage.getItem("client_id");
    this.s3url = utils.getS3url();
    this.page_count = 1;
    this.products = [];
    this.getData();
  }

  ngOnInit() {}

  ionViewWillEnter() {
  
  }

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.offerService
        .getOfferProducts(this.client_id, this.page_count, this.sortType)
        .subscribe(
          (data) => this.handleResponse(data, infiniteScroll),
          (error) => this.handleError(error)
          
        );
        
    });
  }

  handleResponse(data, infiniteScroll?) 
  {
    this.infiniteScroll.disabled = false;
    console.log(this.scroll)
    this.loadingController.dismiss();
    this.page_limit = data.page_count;
    data.product.forEach((element) => {
      this.products.push(element);
    });
    console.log(this.products, "API called");
    
    if (infiniteScroll) 
      {
      // console.log("infinite scroll", infiniteScroll);
      infiniteScroll.target.complete();
      }
  }

  handleError(error) 
  {
    this.loadingController.dismiss();
    console.log(error);
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
            console.log(this.scroll,"sort")
            this.content.scrollToTop(1500);

          },
        },
      ],
    });
    await actionSheet.present();
  }

  addToCart(index: number) {
    if (this.authService.isAuthenticated()) {
      console.log("hai");
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

      let name = this.products[index].name;

      this.presentToastSuccess("One ' " + name + " ' added to cart.");
    } else {
      this.presentLogin();
    }
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
          console.log("low to high");
          this.sortType = "ASC";
          this.page_count = 1;
          this.products = [];
          console.log("from sort")
          this.getData();
          
          console.log(this.scroll,"sort")
          
        } else if (data.data == 1) {
          console.log("high to low");
          this.sortType = "DESC";
          this.page_count = 1;
          this.products = [];
          console.log("from sort")
          this.getData();
          
          console.log(this.scroll,"sort")

        }
      }
    });
    await popover.present();
  }

  loadMoreContent(infiniteScroll) {
    console.log("loadMoreContent", this.page_count);
    if (this.page_count == this.page_limit) 
    {
      infiniteScroll.target.disabled = true;
    } 
    else 
    {
      this.page_count++;
      console.log("from load more content")
      this.getData(infiniteScroll);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "bubbles",
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

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast-success",
      position: "bottom",
      duration: 1500,
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
}
