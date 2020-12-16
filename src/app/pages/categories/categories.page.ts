import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category/category.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  data: any;
  s3url: any
  page_count: number = 1
  page_limit: number
  categories: Array<any> = []

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

  constructor(public router: Router, private categoryService: CategoryService, private utils: UtilsService,private loadingController:LoadingController) {
    this.s3url = utils.getS3url()
    this.getData()
  }

  ngOnInit() {
  }

  getData(infiniteScroll?) {
    this.presentLoading().then(()=>{
      this.categoryService.getCategories(this.page_count).subscribe(
        (data) => this.handleResponse(data, infiniteScroll),
        (error) => this.handleError(error)
      )
    }
    )
  }


  navigateToProducts(index: number) {
    this.router.navigate(['products', this.categories[index].id, { name: this.categories[index].category_name }])
  }

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    }
    else {
      this.page_count++;
      this.getData(infiniteScroll)
    }
  }
  
  handleResponse(data, infiniteScroll) {
    this.loadingController.dismiss()
    console.log(data)
    this.data = data;
    this.data.categories.forEach(element => { this.categories.push(element) });
    this.page_limit = data.page_count;
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error) {
    this.loadingController.dismiss()
    console.log(error)
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

      doRefresh(event) {
        this.getData();
        setTimeout(() => {
          event.target.complete();
        }, 1000);
      }
}
