import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { utils } from 'protractor';
import { SubcatProductsService } from 'src/app/services/subcatProducts/subcat-products.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FiltersPage } from '../filters/filters.page';
import { SortPage } from '../sort/sort.page';
import { PRODUCTS, BANNERS } from '../home/home.page';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Array<any> = []
  banners: Array<any> = BANNERS;
  page_count:number
  page_limit:number
  client_id:any

  bannerSlideOpts = {
    slidesPerView: 1,
    initialSlide: 0,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    speed: 400
  }
  catId:any
  category_name: any;
  s3url:string
  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];
  constructor(private activatedRoute: ActivatedRoute, private platform: Platform, private router: Router, private modalController: ModalController,
    private CatProductService:SubcatProductsService,private utils:UtilsService,private loadingcontroller:LoadingController,
    private actionSheetController:ActionSheetController,private cartService:CartService,private authService:AuthenticationService,private alertController:AlertController) {
    this.page_count = 1
    this.checkWidth()
    this.s3url = utils.getS3url()
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.category_name = this.activatedRoute.snapshot.paramMap.get('name')
    // this.products = PRODUCTS.filter(data => data.cat_id == catId)
    // console.log(this.products)
    this.client_id = Number(localStorage.getItem('client_id'))
    this.getData()

  }

  ngOnInit() {
  }

  getData()
  {
    
    console.log("catid",this.catId)
    let client_id = Number(localStorage.getItem('client_id'))
    this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,null).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_DATA)
    {
      console.log(data)
    this.products = data.products
    this.page_limit = data.page_count;
    console.log(this.products)
    for(let i=0;i<this.products.length;i++)
    {
      this.products[i].images[0].path = this.s3url+this.products[i].images[0].path
    }
    }
    
    
  }
  handleError(error)
  {
    console.log(error)
  }
  navigateToProduct(index: number) {
    let id=this.products[index].id
    let catId= this.products[index].category_id
    this.router.navigate(['product',{id,catId}])
  }

  onCatChange(event) {
    console.log(event.detail.value)
  }
  
  async openFilter() {

    const modal = await this.modalController.create({
      component: FiltersPage,
      componentProps: { value: 123 }
    });

    await modal.present();
  }

  openSort() {
    this.presentActionSheet()
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
          disableOnInteraction: false
        },
        speed: 400
      }

    }
  }

  loadMoreContent(event)
  {
    if (this.page_count == this.page_limit) {
      event.target.disabled = true;
    }
    else{
      console.log(this.page_count,"before")
      this.page_count++
      console.log(this.page_count,"after")
      this.getData()
      console.log("hello")
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'SORT BY',
      mode:'md',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Price - high to low',
        handler: () => {
          
          this.CatProductService.getSubCatProducts(this.catId,this.client_id,this.page_count,'desc').subscribe(
            (data)=>this.handleResponse(data,GET_DATA),
            (error)=>this.handleError(error)
          )
        }
      }, {
        text: 'Price - low to high',
        handler: () => {
          let client_id = Number(localStorage.getItem('client_id'))
          this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,'asc').subscribe(
            (data)=>this.handleResponse(data,GET_DATA),
            (error)=>this.handleError(error)
          )
        }
      }]
    });
    await actionSheet.present();
  }

  async presentLogin() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'You Are Not Logged In',
      message: 'Log in to continue.',
      buttons: [
         {
          text: 'Login',
          handler: () => {
            this.router.navigate(['login'])
          }
        }
      ]
    });

    await alert.present();
  }
 

  addToCart(index:number)
  {
    if(this.authService.isAuthenticated())
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

    else{
      this.presentLogin()
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

}


