import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ActionSheetController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { AuthenticationService } from "src/app/services/authentication.service";
import { BrandProductService } from "src/app/services/brandProducts/brand-product.service";
import { CartService } from "src/app/services/cart/cart.service";
import { UtilsService } from "src/app/services/utils.service";
import { BANNERS } from "../home/home.page";
const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
@Component({
  selector: "app-brand-products",
  templateUrl: "./brand-products.page.html",
  styleUrls: ["./brand-products.page.scss"],
})
export class BrandProductsPage implements OnInit {
  products: Array<any> = [];
  banners: Array<any> = BANNERS;
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
  // bannerSlideOpts = {
  //   slidesPerView: 1,
  //   initialSlide: 0,
  //   spaceBetween: 20,
  //   loop: true,
  //   centeredSlides: true,
  //   autoplay: {
  //     delay: 3000,
  //     disableOnInteraction: false,
  //   },
  //   speed: 400,
  // };
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
      }
    }
  }
  s3url: string;
  brand_id: number;
  brand_name: string;
  page_limit: number;
  page_count: number = 1;;
  current_page: number;
  client_id: any;
  data: any;
  constructor(
    private brandProductService: BrandProductService,
    private platform: Platform,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    public router: Router,
    private cartService: CartService,
    private authService: AuthenticationService,
    private alertController: AlertController
  ) {
    this.client_id = localStorage.getItem("client_id");

    this.brand_id = activatedRoute.snapshot.params.brand_id;
    this.s3url = utils.getS3url();
    this.checkWidth();
    this.getData();
  }
  checkWidth() {
    // if (this.platform.width() > 768) {
    //   this.bannerSlideOpts = {
    //     slidesPerView: 3,
    //     initialSlide: 0,
    //     spaceBetween: 10,
    //     loop: true,
    //     centeredSlides: true,
    //     autoplay: {
    //       delay: 3000,
    //       disableOnInteraction: false,
    //     },
    //     speed: 400,
    //   };
    // }
  }
  ionViewWillEnter() {
    this.getData();
  }

  ngOnInit() { }

  getData(infiniteScroll?) {
    this.brandProductService
      .getBrandProducts(this.brand_id, this.page_count, this.client_id)
      .subscribe(
        (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
        (error) => this.handleError(error)
      );
  }

  handleResponse(data, type, infiniteScroll?) {
    if (type == GET_DATA) {
      console.log(data);
      this.page_limit = data.page_count;
      this.data = data;
      this.data.product.forEach((element) => {
        this.products.push(element);
      });
      console.log(this.products, "API called");


    }
    console.log(data);
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error) {
    console.log(error);
  }



  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count++;
      this.getData(infiniteScroll);
    }
  }

  navigateToProduct(index) {
    let id = this.products[index].id;
    let catId = this.products[index].category_id;
    this.router.navigate(["product", { id, catId }]);
  }

  openSort() {
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
            this.brandProductService
              .getBrandProducts(this.brand_id, this.page_count, this.client_id)
              .subscribe(
                (data) => this.handleResponse(data, GET_DATA),
                (error) => this.handleError(error)
              );
          },
        },
        {
          text: "Price - low to high",
          handler: () => {
            this.brandProductService
              .getBrandProducts(this.brand_id, this.page_count, this.client_id)
              .subscribe(
                (data) => this.handleResponse(data, GET_DATA),
                (error) => this.handleError(error)
              );
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
    } else {
      this.presentLogin();
    }
  }
  removeFromcart(index: number) {
    this.cartService
      .removeFromCart(this.client_id, this.products[index].id)
      .subscribe(
        (data) => this.handleResponse(data, DEL_DATA),
        (error) => this.handleError(error)
      );
    // this.getData()
    this.products[index].cart_count--;
  }
}
