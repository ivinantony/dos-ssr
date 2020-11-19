import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BrandProductService } from 'src/app/services/brandProducts/brand-product.service';
import { UtilsService } from 'src/app/services/utils.service';
import { BANNERS } from '../home/home.page';
const GET_DATA=200;
@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.page.html',
  styleUrls: ['./brand-products.page.scss'],
})
export class BrandProductsPage implements OnInit {

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
  s3url:string
  brand_id:number
  brand_name:string
  page_limit:number
  current_page:number
  constructor(private brandProductService:BrandProductService,private platform: Platform,private utils:UtilsService,private activatedRoute:ActivatedRoute) 
  {
    this.brand_id = activatedRoute.snapshot.params.brand_id
    this.s3url = utils.getS3url()
    this.checkWidth()
    this.getData()
   }

  ngOnInit() {
  }

  getData()
  {
    this.brandProductService.getBrandProducts(this.brand_id).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    console.log(data)
    if(type == GET_DATA)
    {
    this.page_limit = data.page_count
    this.products = data.product
    this.brand_name = this.products[0].brand_name
    console.log(this.products)
    for(let i=0;i<this.products.length;i++)
    {
      this.products[i].images[0].path = this.s3url+this.products[i].images[0].path
    }
    }
    
    
  }
  handleError(error)
  {
    console.log(error)
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

  // loadMoreContent()
  // {
  //   if (this.page_limit == 1000) {
  //   //   event.target.disabled = true;
  //   // }
  // }
}
