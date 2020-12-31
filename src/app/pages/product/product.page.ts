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
    autoplay: true,
    speed: 1000,
    zoom:{
      maxRatio:2
    },
    
    
  }



  
  product: any
  categories = CATEGORIES
  productId:any
  catId:any
  productDetails:any
  s3url:string
  qty:number=1
  data:any
  lens:any
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
        this.presentToastSuccess("Product added to cart.")
    }
  else{
  this.presentLogin()
  }
  
  }

  goToCart()
  {
    this.router.navigate(['cart'])
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

  magnify(imgID, zoom) {
    
    var img, glass, w, h, bw;
    img = document.getElementById(imgID);
    console.log(img,"image iddddd")
    /* Create magnifier glass: */
    glass = document.createElement("DIV");
    this.lens = glass
    /* Insert magnifier glass: */
    img.parentElement.insertBefore(glass, img);
  
    /* Set background properties for the magnifier glass: */
   
    glass.style.width="200px";
    glass.style.height="200px";
    glass.style.position="absolute";
    glass.style.cursor="zoom-in";
    glass.style.border="1px dotted #000";
    glass.style.backgroundImage = "url('" + img.src + "')";
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
    bw = 3;
    w = glass.offsetWidth / 2;
    h = glass.offsetHeight / 2;
  
    /* Execute a function when someone moves the magnifier glass over the image: */
    glass.addEventListener("mousemove", moveMagnifier);
    img.addEventListener("mousemove", moveMagnifier);
  
    /*and also for touch screens:*/
    glass.addEventListener("touchmove", moveMagnifier);
    img.addEventListener("touchmove", moveMagnifier);

   
    img.addEventListener("mouseout", destroy);
    img.addEventListener("touchout", destroy);


    function moveMagnifier(e) {
      var pos, x, y;
      /* Prevent any other actions that may occur when moving over the image */
      e.preventDefault();
      /* Get the cursor's x and y positions: */
      pos = getCursorPos(e);
      x = pos.x;
      y = pos.y;
      /* Prevent the magnifier glass from being positioned outside the image: */
      if (x > img.width - (w / zoom)) {x = img.width - (w / zoom);}
      if (x < w / zoom) {x = w / zoom;}
      if (y > img.height - (h / zoom)) {y = img.height - (h / zoom);}
      if (y < h / zoom) {y = h / zoom;}
      /* Set the position of the magnifier glass: */
      glass.style.left = (x - w) + "px";
      glass.style.top = (y - h) + "px";
      /* Display what the magnifier glass "sees": */
      glass.style.backgroundPosition = "-" + ((x * zoom) - w + bw) + "px -" + ((y * zoom) - h + bw) + "px";
    }
  
    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }

    function destroy(e)
    {
    glass.remove()
    }
  }

  fireEvent(e)
  {
    console.log(e.type);
    this.magnify("myimage", 2);

  }

  mouseExit(e)
  {

  }


  
  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "middle",
      color: "success",
      duration: 1500,
    });
    toast.present();
  }
}
