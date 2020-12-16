import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { UtilsService } from 'src/app/services/utils.service';
const GET_DATA=200;
@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.page.html',
  styleUrls: ['./manufacturers.page.scss'],
})
export class ManufacturersPage implements OnInit {
data:any
s3url:any
page_count: number = 1
page_limit: number
client_id:any
brands:Array<any>=[]
  constructor(private manufacturerService:ManufacturerService,private utils:UtilsService,private router:Router,private loadingController:LoadingController) 
  { 
    this.client_id = localStorage.getItem('client_id')
    this.s3url  = utils.getS3url()
  this.getData()
  }

  ngOnInit() {
  }

  getData(infiniteScroll?) {
    this.presentLoading().then(()=>{
      this.manufacturerService.getManufacturers(this.page_count).subscribe(
        (data)=>this.handleResponse(data,infiniteScroll),
        (error)=>this.handleError(error))
    }
    )
  }

  handleResponse(data,infiniteScroll)
  {
    
    this.loadingController.dismiss()
    this.data = data
    this.page_limit = data.page_count;
    this.data.brands.forEach((element) => {
      this.brands.push(element);
    });
    console.log(this.brands, "API called");
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
    console.log(data)
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    console.log(error)
  }

  navigateToBrandProducts(index:number)
  {
    console.log( this.data.brands[index],"index")
    let brand_id = this.brands[index].id
    let brand_name = this.brands[index].brand_name
    console.log(brand_id,"brand id")
    this.router.navigate(['brand-products',{brand_id,brand_name}])
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

  doRefresh(event) {
    this.page_count=1
        this.brands= []
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
