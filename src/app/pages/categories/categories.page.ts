import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';
import { UtilsService } from 'src/app/services/utils.service';
const GET_CAT = 200;
@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  data:any;
  s3url:any
  page_count:number
  page_limit:number
  categories:Array<any>=[]

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

  constructor(public router:Router,private categoryService:CategoryService,private utils:UtilsService) 
  { 
    this.page_count = 1
    this.s3url = utils.getS3url()
    this.getData()
  }

  ngOnInit() {
  }

  getData()
  {
    
    this.categoryService.getCategories(this.page_count).subscribe(
      (data)=>this.handleResponse(data,GET_CAT),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    console.log(data)
    this.data=data
    this.data.categories.forEach(element => {this.categories.push(element)});

    this.page_limit = data.page_count;
  }
  handleError(error)
  {
    console.log(error)
  }
  navigateToProducts(index: number) {
    
    this.router.navigate(['products', this.data.categories[index].id, { name: this.data.categories[index].category_name }])
  }

  loadMoreContent(event)
  {
    if (this.page_count == this.page_limit) {
      event.target.disabled = true;
    }
    else{
      console.log(this.page_count,"before")
      this.page_count++
      console.log(this.page_count,"after")
      this.getData()
      console.log("hello")
    }
  }
}
