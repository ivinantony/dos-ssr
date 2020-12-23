import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonFab, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductDetailsService } from 'src/app/services/productDetails/product-details.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CATEGORIES } from '../home/home.page';
import { ImagemodalPage } from '../imagemodal/imagemodal.page';

const GET_DATA=200;
const POST_DATA=210;
const GET_CART=220;
const DEL_DATA=230;
@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  recommendedSlides = {
    slidesPerView: 1.5,
    initialSlide: 0,
    spaceBetween: 5,
    centeredSlides: true,
  }
  productOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    zoom:{
      maxRatio:2
    }
  }
  product: any
  categories = CATEGORIES
  productId:any
  catId:any
  productDetails:any
  s3url:string
  qty:number=1
  data:any
  client_id:any
  constructor(private platform: Platform, private modalController: ModalController, public authencationservice: AuthenticationService, 
    public checkloginGuard: AuthGuard, private toastController: ToastController, public router: Router, 
    private activatedRoute: ActivatedRoute,private productsDetailsService:ProductDetailsService,private utils:UtilsService,private cartService:CartService,
    private authService:AuthenticationService,private alertController:AlertController,private loadingController:LoadingController) {

    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('catId'))
    // this.product = PRODUCTS.find(data => data.id == this.productId)
    this.client_id = localStorage.getItem('client_id')
    this.s3url = utils.getS3url()
    this.checkWidth()
    this.platform.resize.subscribe(async () => {
      console.log('Resize event detected', this.platform.width());
      this.checkWidth()
    });

    
    this.client_id = localStorage.getItem('client_id')
    
  }

  ngOnInit() {

  }

  ionViewWillEnter()
  {
    this.getData()
  }

  // getData()
  // {
  
  //   this.productsDetailsService.getProductDetails().subscribe(
  //     (data)=>this.handleResponse(data,GET_DATA),
  //     (error)=>this.handleError(error)
  //   )
  // }

  getData() {
    this.presentLoading().then(()=>{
      this.productsDetailsService.getProductDetails(this.productId,this.client_id).subscribe(
        (data) => this.handleResponse(data,GET_DATA),
        (error) => this.handleError(error)
      )})
  }

 
  

  handleResponse(data,type)
  {
    this.loadingController.dismiss()
    if(type == GET_DATA)
    {
      this.data = data
      console.log(data)

      this.productDetails = data.product
      for(let i=0;i<this.productDetails.images.length;i++)
      {
        this.productDetails.images[i].path = this.s3url+this.productDetails.images[i].path
      }
    }
    console.log(data)
  }
  handleError(error)
  {
    this.loadingController.dismiss
    console.log(error)
  }

  onSubmit() {
    let data={
   product_id :this.productDetails.id,
   client_id :localStorage.getItem('client_id')
    }
    this.cartService.addToCart(data).subscribe(
      (data)=>this.handleResponse(data,POST_DATA),
      (error)=>this.handleError(error)
    )
    this.presentToast()
  }
  viewCart()
  {
    let client_id = localStorage.getItem('client_id')
    this.cartService.getCart(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_CART),
      (error)=>this.handleError(error)
    )
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Added to Cart.',
      cssClass: 'custom-toast',
      duration: 2000,
      buttons: [
        {
          text: 'View Cart',
          handler: () => {
            this.router.navigate(['cart'])
          }
        }
      ]
    });
    toast.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ImagemodalPage,
      componentProps: { value: 123 }
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    console.log(data)

  }
  checkWidth() {
    if (this.platform.width() > 768) {
      this.recommendedSlides = {
        slidesPerView: 3.5,
        spaceBetween: 10,
        initialSlide: 1,
        centeredSlides: true,
      }
    }
  }
  add()
  {
    this.qty+=1
  }
  subtract()
  {
    this.qty-=1
  }

  addToCart()
  {
    if(this.authService.isAuthenticated())
    {
      let data={
        product_id :this.productDetails.id,
        client_id :this.client_id
         }
         this.cartService.addToCart(data).subscribe(
           (data)=>this.handleResponse(data,POST_DATA),
           (error)=>this.handleError(error)
         )
         this.productDetails.cart_count++
        //  this.getData()
    }
  else{
  this.presentLogin()
  }
   
   
    
  }
  removeFromcart()
  {
    this.cartService.removeFromCart(this.client_id,this.productDetails.id,).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
    // this.getData()
    this.productDetails.cart_count--
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

  navigateToProduct(index: number) {
    let id=this.data.category_products[index].id
    let catId= this.data.category_products[index].category_id
    this.router.navigate(['product',id,{catId}])
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

  whatsapp()
  {
   window.open("https://api.whatsapp.com/send?phone=447440700295&amp;text=I%20have%20an%20enquiry%20about%20the%20product%20('"+this.productDetails.name+"')",this.productDetails.name)
  }

  mail()
  {
    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=dealonstoreuae@gmail.com');
    // window.open('mailto:dealonstoreuae@gmail.com?subject=subject&body=body');
    // window.location.href = "mailto:dealonstoreuae@gmail.com?subject=Subject&body=message%20goes%20here";

  }

  async zoom(path:string) {
    const modal = await this.modalController.create({
      component: ImagemodalPage,
      swipeToClose: true,
      presentingElement: await this.modalController.getTop(),
      cssClass: 'my-custom-class',
      componentProps: { imgSrc: path }
    });
    
   
    // modal.onDidDismiss().then(data => {
    //   if (data.data) {
    //     let resp = data.data;
    //     this.inItMap(resp.lat, resp.lng)
    //   }
    //   console.log('data', data.data)
    //   this.latitude = data.data.lat
    //   this.longitude = data.data.lng
    //   this.addressForm.patchValue({ latitude:data.data.lat  });
    //   this.addressForm.patchValue({ longitude:data.data.lng  });

    //   console.log("lat lon from modalsearch",this.latitude,this.longitude)
    //   this.getDistance()
    // })
    return await modal.present();
  }

}
