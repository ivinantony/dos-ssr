import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.page.html',
  styleUrls: ['./imagemodal.page.scss'],
})
export class ImagemodalPage implements OnInit {
  @Input() imgSrc: string;
  clientid:any
  productOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    zoom:{
      maxRatio:2
    }
  }
  
  constructor(private modalController: ModalController) { }

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
