import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PRODUCTS, CATEGORIES } from '../home/home.page';
import { ImagemodalPage } from '../imagemodal/imagemodal.page';

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

  constructor(private platform: Platform, private modalController: ModalController, public authencationservice: AuthenticationService, public checkloginGuard: AuthGuard, private toastController: ToastController, private router: Router, private activatedRoute: ActivatedRoute) {
    let id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.product = PRODUCTS.find(data => data.id == id)

    this.checkWidth()
    this.platform.resize.subscribe(async () => {
      console.log('Resize event detected', this.platform.width());
      this.checkWidth()
    });



  }

  ngOnInit() {

  }

  onSubmit() {
    this.presentToast()
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
}
