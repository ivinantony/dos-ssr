import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { FiltersPage } from '../filters/filters.page';
import { PRODUCTS, BANNERS } from '../home/home.page';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Array<any> = []
  banners: Array<any> = BANNERS;
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
  category_name: any;
  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];
  constructor(private activatedRoute: ActivatedRoute, private platform: Platform, private router: Router, private modalController: ModalController) {
    this.checkWidth()
    let id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.category_name = this.activatedRoute.snapshot.paramMap.get('name')
    this.products = PRODUCTS.filter(data => data.cat_id == id)
    console.log(this.products)
  }

  ngOnInit() {
  }

  navigateToProduct(index: number) {
    this.router.navigate(['product', this.products[index].id])
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

}
