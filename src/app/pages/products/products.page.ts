import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { utils } from 'protractor';
import { SubcatProductsService } from 'src/app/services/subcatProducts/subcat-products.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FiltersPage } from '../filters/filters.page';
import { SortPage } from '../sort/sort.page';
import { PRODUCTS, BANNERS } from '../home/home.page';
const GET_DATA = 200;
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: Array<any> = []
  banners: Array<any> = BANNERS;
  page_count:number
  page_limit:number

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
  catId:any
  category_name: any;
  s3url:string
  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];
  constructor(private activatedRoute: ActivatedRoute, private platform: Platform, private router: Router, private modalController: ModalController,
    private CatProductService:SubcatProductsService,private utils:UtilsService,private loadingcontroller:LoadingController,private actionSheetController:ActionSheetController) {
    this.page_count = 1
    this.checkWidth()
    this.s3url = utils.getS3url()
    this.catId = parseInt(this.activatedRoute.snapshot.paramMap.get('id'))
    this.category_name = this.activatedRoute.snapshot.paramMap.get('name')
    // this.products = PRODUCTS.filter(data => data.cat_id == catId)
    // console.log(this.products)
    this.getData()

  }

  ngOnInit() {
  }

  getData()
  {
    console.log("catid",this.catId)
    let client_id = Number(localStorage.getItem('client_id'))
    this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,null).subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
    if(type == GET_DATA)
    {
      console.log(data)
    this.products = data.products
    this.page_limit = data.page_count;
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
  navigateToProduct(index: number) {
    let id=this.products[index].id
    let catId= this.products[index].category_id
    this.router.navigate(['product',{id,catId}])
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

  openSort() {
    this.presentActionSheet()
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'SORT BY',
      mode:'md',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Price - high to low',
        handler: () => {
          let client_id = Number(localStorage.getItem('client_id'))
          this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,'desc').subscribe(
            (data)=>this.handleResponse(data,GET_DATA),
            (error)=>this.handleError(error)
          )
        }
      }, {
        text: 'Price - low to high',
        handler: () => {
          let client_id = Number(localStorage.getItem('client_id'))
          this.CatProductService.getSubCatProducts(this.catId,client_id,this.page_count,'asc').subscribe(
            (data)=>this.handleResponse(data,GET_DATA),
            (error)=>this.handleError(error)
          )
        }
      }]
    });
    await actionSheet.present();
  }

}


