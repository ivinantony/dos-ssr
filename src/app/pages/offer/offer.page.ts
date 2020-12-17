import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilsService } from 'src/app/services/utils.service';
const GET_DATA=200;
const POST_DATA=210;
const DEL_DATA=220;
@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {
  products: Array<any> = [];
  data:any
  s3url:any
  page_limit: number;
  page_count: number = 1;
  current_page: number;
  client_id:any
  constructor(private offerService:OfferService,private utils:UtilsService,public router:Router,
    private actionSheetController:ActionSheetController,private cartService:CartService,
    private alertController:AlertController,private authService:AuthenticationService,private loadingController:LoadingController) 
  { 
    this.client_id = localStorage.getItem('client_id')
    this.page_count = 1;
    this.s3url=utils.getS3url()
    this.getData()
  }

  // ionViewWillEnter()
  // {
  //   this.getData()
  // }

  ngOnInit() {
  }

  // getData()
  // {
    
  //   this.offerService.getOfferProducts(client_id,this.page_count).subscribe(
  //     (data)=>this.handleResponse(data,GET_DATA),
  //     (error)=>this.handleError(error)
  //   )
  // }

  getData(infiniteScroll?) {
    this.presentLoading().then(()=>{
      this.offerService.getOfferProducts(this.client_id,this.page_count).subscribe(
        (data)=>this.handleResponse(data,GET_DATA,infiniteScroll),
        (error)=>this.handleError(error)
      )
    }
    )
    
  }

  handleResponse(data,type,infiniteScroll?)
  {
    this.loadingController.dismiss()
    if(type == GET_DATA)
    {
      console.log(data);
      this.page_limit = data.page_count;
      data.product.forEach((element) => {
        this.products.push(element);
      });
      console.log(this.products, "API called");

    }
   
    console.log(data)
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    console.log(error)
  }

 

  navigateToProduct(index) 
  {
    let id=this.products[index].id
    let catId= this.products[index].category_id
    this.router.navigate(['product',id,{catId}])
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
          handler: () => {},
        },
        {
          text: "Price - low to high",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  addToCart(index:number)
  {
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
  removeFromcart(index:number)
  {
    this.cartService.removeFromCart(this.client_id,this.products[index].id,).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
    // this.getData()
    this.products[index].cart_count--
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

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } 
    else {


      this.page_count+=1;
      console.log(this.page_count)
      this.getData(infiniteScroll);
    }
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

  doRefresh(event) {
    this.page_count=1
        this.products= []
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
