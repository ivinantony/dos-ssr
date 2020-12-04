import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
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

  data:any
  s3url:any
  page_limit: number;
  page_count: number;
  current_page: number;
  client_id:any
  constructor(private offerService:OfferService,private utils:UtilsService,public router:Router,private actionSheetController:ActionSheetController,private cartService:CartService) 
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

  getData()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.offerService.getOfferProducts(client_id,this.page_count).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_DATA)
    {
      this.page_limit = data.page_count;
      this.data = data
      console.log(data)
    }
   
    console.log(data)
  }
  handleError(error)
  {
    console.log(error)
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
    let id=this.data.product[index].id
    let catId= this.data.product[index].category_id
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
    let data={
      product_id :this.data.product[index].id,
      client_id :this.client_id
       }
       this.cartService.addToCart(data).subscribe(
         (data)=>this.handleResponse(data,POST_DATA),
         (error)=>this.handleError(error)
       )
       this.data.product[index].cart_count++
      //  this.getData()
  }
  removeFromcart(index:number)
  {
    this.cartService.removeFromCart(this.client_id,this.data.product[index].id,).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
    // this.getData()
    this.data.product[index].cart_count--
  }

}
