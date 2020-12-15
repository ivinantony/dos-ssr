import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(public router: Router, private categoryService: CategoryService, private utils: UtilsService) {

    this.s3url = utils.getS3url()
    this.getData()
  }

  ngOnInit() {
  }

  getData(infiniteScoll?) {
    this.categoryService.getCategories(this.page_count).subscribe(
      (data) => this.handleResponse(data, infiniteScoll),
      (error) => this.handleError(error)
    )
  }


  navigateToProducts(index: number) {

    this.router.navigate(['products', this.categories[index].id, { name: this.categories[index].category_name }])
  }

  loadMoreContent(infiniteScoll) {
    if (this.page_count == this.page_limit) {
      infiniteScoll.target.disabled = true;
    }
    else {
      this.page_count++;
      this.getData(infiniteScoll)
    }
  }
  handleResponse(data, infiniteScroll) {
    console.log(data)
    this.data = data;
    this.data.categories.forEach(element => { this.categories.push(element) });
    this.page_limit = data.page_count;
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error) {
    console.log(error)
  }
}
