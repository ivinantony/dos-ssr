import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController,IonInfiniteScroll, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { utils } from 'protractor';
import { SubcatProductsService } from 'src/app/services/subcatProducts/subcat-products.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FiltersPage } from '../filters/filters.page';
import { FilterComponent } from '../filter/filter.component';
import { SortPage } from '../sort/sort.page';
import { CartService } from 'src/app/services/cart/cart.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IonContent } from '@ionic/angular';
import { CartcountService } from 'src/app/cartcount.service';
const GET_DATA = 200;
const POST_DATA = 210;
const DEL_DATA = 220;
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  
  products: Array<any> = []

  page_limit: number;
  page_count: number = 1;
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
  s3url:string;
  data:any
  isSort:boolean=false
  sortType:any=null
  cart_count:any
  name:any

  constructor(private activatedRoute: ActivatedRoute, 
    private platform: Platform, 
    public router: Router, 
    private modalController: ModalController,
    private CatProductService:SubcatProductsService,
    private utils:UtilsService,
    private loadingController:LoadingController,
    private actionSheetController:ActionSheetController,
    private cartService:CartService,
    private authService:AuthenticationService,
    private alertController:AlertController,
    private popOverCtrl:PopoverController,
    private toastController:ToastController,
    private cartCountService:CartcountService) {
    this.page_count = 1
    this.checkWidth()
    this.s3url = utils.getS3url()
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.category_name = this.activatedRoute.snapshot.paramMap.get('name')
    // this.products = PRODUCTS.filter(data => data.cat_id == catId)
    // console.log(this.products)
    this.client_id = Number(localStorage.getItem('client_id'))
    
    // this.page_count=1
    // this.products= []
    // this.getData()

  }

  ngOnInit() {
  }
  ionViewWillEnter()
  {
    this.page_count=1
    this.products= []
    this.getData()
    this.cart_count = localStorage.getItem('cart_count')
  }

  // getData()
  // {
    
  //   console.log("catid",this.catId)
  //   let client_id = Number(localStorage.getItem('client_id'))
  //   this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,null).subscribe(
  //     (data)=>this.handleResponse(data,GET_DATA),
  //     (error)=>this.handleError(error)
  //   )
  // }

  getData(infiniteScroll?) {
    this.presentLoading().then(()=>{

      this.CatProductService.getSubCatProducts(this.catId,this.client_id,this.page_count,this.sortType).subscribe(
        (data)=>this.handleResponse(data,GET_DATA,infiniteScroll),
        (error)=>this.handleError(error)
      )
    }
    )
    
  }

  handleResponse(data,type,infiniteScroll?)
  {
    this.infiniteScroll.disabled = false;
    this.loadingController.dismiss()
    if(type == GET_DATA)
    {
    // console.log(data)
    this.data=data
    this.data.products.forEach(element => {this.products.push(element)});
    this.page_limit = data.page_count;
    this.cart_count = data.cart_count
    localStorage.setItem("cart_count",data.cart_count)
    }
    else if(type == POST_DATA)
    {
      // console.log("add to cart",data)
      this.cart_count = data.cart_count
      localStorage.setItem("cart_count",data.cart_count)
      this.cartCountService.setCartCount(data.cart_count)
      this.presentToastSuccess("One ' " + this.name +" ' added to cart.");
    }
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  //  console.log(data) 
    
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
    if(error.status == 400)
    {
      this.presentAlert(error.error.message)
    }
    
  }
  navigateToProduct(index: number) {
    let id=this.products[index].id
    let catId= this.products[index].category_id
    this.router.navigate(['product',id,{catId}])
  }

  onCatChange(event) {
    // console.log(event.detail.value)
  }
  
  async openFilter() {

    const modal = await this.modalController.create({
      component: FiltersPage,
      componentProps: { value: 123 }
    });

    await modal.present();
  }

  async openSort(ev:any) {
    const popover = await this.popOverCtrl.create({  
      component: FilterComponent, 
      event:ev,   
      animated: true, 
      showBackdrop: true ,
      cssClass:'popover' 
  });  
  popover.onDidDismiss().then((data)=>{
   if(data.data)
   {
    this.infiniteScroll.disabled = true;
    //  console.log("hello")
     
     if(data.data == 2)
     {
      //  console.log("low to high")
       this.sortType = 'ASC'
       this.page_count=1
       this.products= []
       this.getData()
     }
     else if(data.data == 1){
      // console.log("high to low")

      this.sortType = 'DESC'
      this.page_count=1
      this.products= []
      this.getData()
     }
   }
  
  })
   await popover.present(); 
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

  

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } 
    else {


      this.page_count+=1;
      // console.log(this.page_count)
      this.getData(infiniteScroll);
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
          this.infiniteScroll.disabled = true;
          this.page_count=1
          this.products= []
          this.sortType='DESC'
          this.getData()
        }
      }, {
        text: 'Price - low to high',
        handler: () => {
          this.infiniteScroll.disabled = true;
          this.page_count=1
          this.products= []
          this.sortType='ASC'
          this.getData()
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
      // console.log("hai")
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

        this.name = this.products[index].name

        
        // this.cart_count++
        localStorage.setItem('cart_count',this.cart_count)
    }

    else{
      this.presentLogin()
    }
    
  }

  goToCart()
  {
    this.router.navigate(['cart'])
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
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

  doRefresh(event) {
    this.page_count=1
    this.products= []
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  opensortMobile()
  {
    this.presentActionSheet()
  }

  async presentAlert(msg:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Low Stock Alert',
     
      message:msg + "\ For ordering large quantities contact us through email or whatsapp.",
      buttons: ['OK']
    });

    await alert.present();
  }

}


