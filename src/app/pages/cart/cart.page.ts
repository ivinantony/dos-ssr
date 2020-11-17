import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, Platform, ToastController } from '@ionic/angular';
import { AddAddressPage } from '../add-address/add-address.page';
import { AddressPage } from '../address/address.page';
import { CouponPage } from '../coupon/coupon.page';
declare var RazorpayCheckout: any;
declare var Razorpay: any
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  selectedAddress: any
  constructor(public modalController: ModalController, private routerOutlet: IonRouterOutlet, private toastController: ToastController, private platform: Platform) { }

  ngOnInit() {
  }

  onChangeAddress($event) {
    this.selectedAddress = $event.detail.value;
    console.log('event', $event.detail.value)
  }

  async addAddress() {
    const modal = await this.modalController.create({
      component: AddAddressPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async openPromo() {
    const modal = await this.modalController.create({
      component: CouponPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  payWithRazorpay() {

    this.platform.ready().then(() => {
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) {
        // make your native API calls
        var options = {
          description: 'Credits towards consultation',
          image: 'https://i.imgur.com/3g7nmJC.png',
          currency: 'INR',
          key: 'rzp_test_SDfK1pitLCtbv1',
          amount: '5000',
          name: 'Acme Corp',
          theme: { color: '#eb445a' },
          prefill: {
            name: 'Ivin Antony',
            contact: 9633361540,
            email: 'ivin@mermerapps.com'
          }
        }

        var successCallback = (success) => {
          console.log(success)
          this.presentToast(success.razorpay_payment_id)
          var orderId = success.razorpay_order_id;
          var signature = success.razorpay_signature
        }
        var cancelCallback = (error) => {
          console.log(error)
          this.presentToast(error.description)
        }
        RazorpayCheckout.on('payment.success', successCallback)
        RazorpayCheckout.on('payment.cancel', cancelCallback)
        RazorpayCheckout.open(options)
      } else {
        // fallback to browser APIs
        var pwa_options = {
          "key": "rzp_test_SDfK1pitLCtbv1",
          "amount": "50000",
          "currency": "INR",
          "name": "Acme Corp",
          "description": "Test Transaction",
          "image": "https://example.com/your_logo",
          "handler": (response) => {
            this.presentToast(response.razorpay_payment_id)
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
          },
          "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
          },
          "notes": {
            "address": "Razorpay Corporate Office"
          },
          "theme": {
            "color": "#3399cc"
          }
        };
        var rzp1 = new Razorpay(pwa_options);
        rzp1.on('payment.failed',  (response)=> {
          // this.presentToast(response.error.description)
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();

      }
    });

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
}
