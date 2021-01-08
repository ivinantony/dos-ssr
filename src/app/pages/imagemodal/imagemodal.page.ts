import { getLocaleDateFormat } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HomeService } from 'src/app/services/home/home.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.page.html',
  styleUrls: ['./imagemodal.page.scss'],
})
export class ImagemodalPage implements OnInit {
  @Input() imgSrc: string;
  clientid:any
  list:any
  data:any
  s3url:any

  productSlides = window.matchMedia("(max-width: 320px)").matches ? {
    slidesPerView: 1,
    
    spaceBetween:2,
    autoplay:true,
    speed:900,

  } : window.matchMedia("(max-width: 576px)").matches ? {
    slidesPerView:2,
    spaceBetween:5,
    autoplay:true,
    speed:900,
    

      //spaceBetween: 2
  } : window.matchMedia(" (max-width: 768px)").matches ? {
    slidesPerView: 4,
    spaceBetween: 8,
    autoplay:true,
    speed:900,
    
  } : window.matchMedia(" (max-width: 992px)").matches ? {
    slidesPerView: 4,
      spaceBetween: 10,
      autoplay:true,
      speed: 900,
      
  } : {
        slidesPerView: 4,
        spaceBetween: 10,
        autoplay:true,
        speed:900,

      }
  productOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    zoom:{
      maxRatio:2
    }
  }
  
  constructor(private modalController: ModalController,
    private homeService:HomeService,
    private utils:UtilsService) 
  { 
    this.list = [1,2,3,4,5,6,7]
    this.s3url = utils.getS3url()
    this.getData()
  }
getData()
{
  let client_id = localStorage.getItem('client_id')
  this.homeService.getHomeDetails(client_id).subscribe(
    (data) => this.handleResponse(data),
    (error) => this.handleError(error)
  )
}

handleResponse(data)
{
  this.data = data
}
handleError(error)
{
  console.log(error)

}
  ngOnInit() { }
  dismisModal() 
  { 
    this.modalController.dismiss()
  }

  close()
  {
    this.modalController.dismiss()
  }

}
