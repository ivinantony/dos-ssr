import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, ModalController, Platform, ToastController } from '@ionic/angular';
import { AddressService } from 'src/app/services/address/address.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckoutService } from 'src/app/services/checkout/checkout.service';
import { OrderService } from 'src/app/services/order/order.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddAddressPage } from '../add-address/add-address.page';
import { AddressPage } from '../address/address.page';
import { CouponPage } from '../coupon/coupon.page';
import { ModeofpaymentPage } from '../modeofpayment/modeofpayment.page';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
declare var RazorpayCheckout: any;
declare var Razorpay: any
const GET_CART=200;
const POST_DATA=210;
const DEL_DATA=220;
const REMOVE=230;
const GET_ADDRESS=240;
const POST_ADDRESS_DETAILS = 250;
const ORDER_RESPONSE = 260;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  selectedAddress: any
  selectedPayment:any
  cart:any[]
  s3url:string
  count:number=1
  cartLength:number
  amountDetails:any
  addresses:any
  discount_amount:number=0
  promo_id:any
  payment_id:any
  address_id:any
  constructor(public modalController: ModalController, private routerOutlet: IonRouterOutlet, 
    private toastController: ToastController,
     private platform: Platform,
     private cartService:CartService,
     private utils:UtilsService,
     private addressService:AddressService,
     private checkoutService:CheckoutService,
     private orderService:OrderService,
     private router:Router,
     private payPal: PayPal) 
     {
       this.getData()
       this.getAddress()
       this.s3url = utils.getS3url()
       
      }

  ngOnInit() {
  }

  onChangeAddress($event) {
    this.selectedAddress = $event.detail.value;
    console.log('selectedAddress', this.selectedAddress)
    this.address_id = this.addresses[this.selectedAddress].id
    console.log(this.address_id)
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().finally(()=>{
          this.getAddress()
        })
    return await modal.present();
  }

  async openPromo() {
      this.amountDetails.payable_amount+=this.discount_amount
      this.amountDetails.saved_amount-=this.discount_amount
    const modal = await this.modalController.create({
      component: CouponPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    modal.onDidDismiss().then((data) => {

      const promo_Details = data['data'];
      if(promo_Details)
      {
      console.log(promo_Details)
      this.amountDetails.payable_amount-=promo_Details.discount_amount
      this.amountDetails.saved_amount=promo_Details.discount_amount
      this.discount_amount = promo_Details.discount_amount
      this.promo_id = promo_Details.promo_Id
      }
      
    }
    );
    return await modal.present();
  }

  async openPaymentModes()
  {
    
    const modal = await this.modalController.create({
      component: ModeofpaymentPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'paymentOptions',
      backdropDismiss:true
    });
    modal.onDidDismiss().then((data) => {
     
      const paymentDetails = data['data'];
      console.log(paymentDetails)
      if(paymentDetails)
      {
      this.payment_id = paymentDetails.modeOfPayment_Id
      console.log(this.payment_id)
      }
      
    }
    );
    return await modal.present();
  }

  pay()
  {
    console.log(this.selectedAddress)
    let data={
      client_id:localStorage.getItem("client_id"),
      promo_code_id:this.promo_id,
      address_id:this.address_id,
      payment_option_id:this.payment_id,
      product_total:this.amountDetails.total_amount,
      payable_amount:this.amountDetails.payable_amount  
    }
    this.orderService.captureOrder(data).subscribe(
      (data)=> this.handleResponse(data,ORDER_RESPONSE),
      (error)=>this.handleError(error)
    )
  }
  
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'custom-toast',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  getData()
  {
    let client_id = localStorage.getItem('client_id')
    this.cartService.getCart(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_CART),
      (error)=>this.handleError(error)
    )
  }

  getAddress()
  {
    let client_id = localStorage.getItem('client_id')
    this.addressService.getAddress(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_ADDRESS),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_CART)
    {
      console.log(data)
      this.cart = data.cart
      this.amountDetails = data
      this.cartLength = this.cart.length
      console.log(this.cart,"This is cart")
      for(let i=0;i<this.cart?.length;i++)
      {
        this.cart[i].images[0].path = this.s3url+this.cart[i].images[0].path
       
      }
      
      
    }
    else if(type  == GET_ADDRESS)
    {
      this.addresses = data.addresses
      console.log(this.addresses,"addresses")
    }
    else if(type == ORDER_RESPONSE)
    {
     if(this.payment_id == 4) 
     {
      if (this.platform.is('cordova')) 
      {
        this.payPal.init({
          PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
          PayPalEnvironmentSandbox: 'AdQ56AEl3TVRxp-oPoMtdptdh-KIbMNCj5TBfv5gJxhQ7JVJJJTWb5T8digw3jpjyLhsJ_WpkXRGZs1G'
        }).then(() => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            // Only needed if you get an "Internal Service Error" after PayPal login!
            //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
          })).then(() => {
            let payment = new PayPalPayment('3.33', 'INR', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((paymentDetails) => {
              console.log(paymentDetails)
              // Successfully paid
        
              // Example sandbox response
              //
              // {
              //   "client": {
              //     "environment": "sandbox",
              //     "product_name": "PayPal iOS SDK",
              //     "paypal_sdk_version": "2.16.0",
              //     "platform": "iOS"
              //   },
              //   "response_type": "payment",
              //   "response": {
              //     "id": "PAY-1AB23456CD789012EF34GHIJ",
              //     "state": "approved",
              //     "create_time": "2016-10-03T13:33:33Z",
              //     "intent": "sale"
              //   }
              // }
            }, (error) => {
              console.log(error)
              
              // Error or render dialog closed without being successful
            });
          }, (error) => {
            console.log(error)
            // Error in configuration
          });
        }, (error) => {
          console.log(error)
          // Error in initialization, maybe PayPal isn't supported or something else
        });
      }
      else{
        this.router.navigate(['paypal'])
      }
      
     }
    }

    else{
      console.log(data)
   
    }
    
  }
  handleError(error)
  {
    console.log(error)
  }


  add(index:number,id:number)
  {
    let data={
      product_id :id,
      client_id :localStorage.getItem('client_id')
       }
       this.cartService.addToCart(data).subscribe(
         (data)=>this.handleResponse(data,POST_DATA),
         (error)=>this.handleError(error)
       )
      //  this.cart[index].count = this.cart[index].count+1
      this.getData()
      
  }

  subtract(index:number,id:number)
  {
    let client_id =localStorage.getItem('client_id')
    this.cartService.removeFromCart(client_id,id).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
    // this.cart[index].count = this.cart[index].count-1
    this.getData()
   
  }

  onQuantityChange()
  {
    // let data={
    //   product_id :this.productDetails.id,
    //   client_id :localStorage.getItem('client_id')
    //    }
    //    this.cartService.addToCart(data).subscribe(
    //      (data)=>this.handleResponse(data,POST_DATA),
    //      (error)=>this.handleError(error)
    //    )
  }

 

  remove(index:number,id:number)
  {
    let client_id =localStorage.getItem('client_id')
    this.cartService.deleteFromCart(client_id,id).subscribe(
      (data)=>this.handleResponse(data,REMOVE),
      (error)=>this.handleError(error)
    )
    this.cart.splice(index,1)
    this.getData()
  }
}











// payWithRazorpay() {
    
//   let client_id = localStorage.getItem('client_id')
//   let data={
//     client_id:client_id,
//     address_id:this.addresses[this.selectedAddress].id,
//     total_amount:this.amountDetails.payable_amount
//   }
//   console.log(data)
//   this.checkoutService.addressDetails(data).subscribe(
//     (data)=>this.handleResponse(data,POST_ADDRESS_DETAILS),
//     (error)=>this.handleError(error)
//   )

//   this.platform.ready().then(() => {
//     // 'hybrid' detects both Cordova and Capacitor
//     if (this.platform.is('hybrid')) {
//       // make your native API calls
//       var options = {
//         description: 'Credits towards consultation',
//         image: 'https://i.imgur.com/3g7nmJC.png',
//         currency: 'INR',
//         key: 'rzp_test_SDfK1pitLCtbv1',
//         amount: '5000',
//         name: 'Acme Corp',
//         theme: { color: '#eb445a' },
//         prefill: {
//           name: 'Ivin Antony',
//           contact: 9633361540,
//           email: 'ivin@mermerapps.com'
//         }
//       }

//       var successCallback = (success) => {
//         console.log(success)
//         this.presentToast(success.razorpay_payment_id)
//         var orderId = success.razorpay_order_id;
//         var signature = success.razorpay_signature
//       }
//       var cancelCallback = (error) => {
//         console.log(error)
//         this.presentToast(error.description)
//       }
//       RazorpayCheckout.on('payment.success', successCallback)
//       RazorpayCheckout.on('payment.cancel', cancelCallback)
//       RazorpayCheckout.open(options)
//     } else {
//       // fallback to browser APIs
//       var pwa_options = {
//         "key": "rzp_test_SDfK1pitLCtbv1",
//         "amount": "50000",
//         "currency": "INR",
//         "name": "Acme Corp",
//         "description": "Test Transaction",
//         "image": "https://example.com/your_logo",
//         "handler": (response) => {
//           this.presentToast(response.razorpay_payment_id)
//           // alert(response.razorpay_payment_id);
//           // alert(response.razorpay_order_id);
//           // alert(response.razorpay_signature)
//         },
//         "prefill": {
//           "name": "Gaurav Kumar",
//           "email": "gaurav.kumar@example.com",
//           "contact": "9999999999"
//         },
//         "notes": {
//           "address": "Razorpay Corporate Office"
//         },
//         "theme": {
//           "color": "#3399cc"
//         }
//       };
//       var rzp1 = new Razorpay(pwa_options);
//       rzp1.on('payment.failed',  (response)=> {
//         // this.presentToast(response.error.description)
//         alert(response.error.code);
//         alert(response.error.description);
//         alert(response.error.source);
//         alert(response.error.step);
//         alert(response.error.reason);
//         alert(response.error.metadata.order_id);
//         alert(response.error.metadata.payment_id);
//       });

//       rzp1.open();

//     }
//   });

// }