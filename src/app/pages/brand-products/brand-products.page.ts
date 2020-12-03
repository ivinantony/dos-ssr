import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSheetController, Platform } from "@ionic/angular";
import { BrandProductService } from "src/app/services/brandProducts/brand-product.service";
import { CartService } from 'src/app/services/cart/cart.service';
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
  sortOptions:Array<any> = [
    {
      option:"Price - High to low",
      isChecked:false
    },
    {
      option:"Price - Low to high",
      isChecked:false
    }
  
  ]
  bannerSlideOpts = {
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
  };
  s3url: string;
  brand_id: number;
  brand_name: string;
  page_limit: number;
  page_count: number;
  current_page: number;
  client_id:any
  constructor(
    private brandProductService: BrandProductService,
    private platform: Platform,
    private utils: UtilsService,
    private activatedRoute: ActivatedRoute,
    private actionSheetController:ActionSheetController,
    private router:Router,
    private cartService:CartService
  ) {
    this.client_id = localStorage.getItem('client_id')
    this.page_count = 1;
    this.brand_id = activatedRoute.snapshot.params.brand_id;
    this.s3url = utils.getS3url();
    this.checkWidth();
    this.getData();
  }
  ionViewWillEnter()
  {
    this.getData()
  }

  ngOnInit() {}

  getData() {
   
    this.brandProductService
      .getBrandProducts(this.brand_id, this.page_count,this.client_id)
      .subscribe(
        (data) => this.handleResponse(data, GET_DATA),
        (error) => this.handleError(error)
      );
  }

  handleResponse(data, type) {
    
    if (type == GET_DATA) {
      this.page_limit = data.page_count;

      this.products = data.product;
      this.brand_name = this.products[0].brand_name;
      console.log(this.products);
      for (let i = 0; i < this.products.length; i++) {
        this.products[i].images[0].path =
          this.s3url + this.products[i].images[0].path;
      }
    }
    console.log(data);
  }
  handleError(error) {
    console.log(error);
  }

  checkWidth() {
    if (this.platform.width() > 768) {
      this.bannerSlideOpts = {
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
      };
    }
  }

  loadMoreContent(event) {
    if (this.page_count == this.page_limit) {
      event.target.disabled = true;
    } else {
      this.page_count++;
      this.getData();
      console.log("hello");
    }
  }

  navigateToProduct(index) 
  {
    let id=this.products[index].id
    let catId= this.products[index].category_id
    this.router.navigate(['product',{id,catId}])
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
        this.brandProductService.getBrandProducts(this.brand_id, this.page_count,this.client_id).subscribe(
        (data) => this.handleResponse(data, GET_DATA),
        (error) => this.handleError(error)
        );
          },
        },
        {
          text: "Price - low to high",
          handler: () => {
            this.brandProductService.getBrandProducts(this.brand_id, this.page_count,this.client_id).subscribe(
              (data) => this.handleResponse(data, GET_DATA),
              (error) => this.handleError(error)
              );
          },
        },
      ],
    });
    await actionSheet.present();
  }


  addToCart(index:number)
  {
    let data={
      product_id :this.products[index].id,
      client_id :this.client_id
       }
       this.cartService.addToCart(data).subscribe(
         (data)=>this.handleResponse(data,POST_DATA),
         (error)=>this.handleError(error)
       )
       this.products[index].cart_count++
      //  this.getData()
  }
  removeFromcart(index:number)
  {
    this.cartService.removeFromCart(this.client_id,this.products[index].id,).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
    // this.getData()
    this.products[index].cart_count--
  }
  
}
