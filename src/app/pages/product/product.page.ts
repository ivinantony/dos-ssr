import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonFab, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductDetailsService } from 'src/app/services/productDetails/product-details.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PRODUCTS, CATEGORIES } from '../home/home.page';
import { ImagemodalPage } from '../imagemodal/imagemodal.page';
const GET_DATA=200;
const POST_DATA=210;
const GET_CART=220;
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
  }
  product: any
  categories = CATEGORIES
  productId:any
  catId:any
  productDetails:any
  s3url:string
  qty:number=1
  data:any
  constructor(private platform: Platform, private modalController: ModalController, public authencationservice: AuthenticationService, 
    public checkloginGuard: AuthGuard, private toastController: ToastController, public router: Router, 
    private activatedRoute: ActivatedRoute,private productsDetailsService:ProductDetailsService,private utils:UtilsService,private cartService:CartService) {

    this.productId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('catId'))
    this.product = PRODUCTS.find(data => data.id == this.productId)
    this.s3url = utils.getS3url()
    this.checkWidth()
    this.platform.resize.subscribe(async () => {
      console.log('Resize event detected', this.platform.width());
      this.checkWidth()
    });

    this.getData()

  }

  ngOnInit() {

  }

  getData()
  {
    
    this.productsDetailsService.getProductDetails(this.productId).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
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
}
