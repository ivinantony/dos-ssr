import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-location-unavailable',
  templateUrl: './location-unavailable.page.html',
  styleUrls: ['./location-unavailable.page.scss'],
})
export class LocationUnavailablePage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  whatsapp(){
    window.open(
      "https://api.whatsapp.com/send?phone=447417344825&amp;"  
    );
    this.modalController.dismiss();
  }

  mail(){
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=info@dealonstore.com"
    );
    this.modalController.dismiss();
  }

  cancel(){
    this.modalController.dismiss();
  }

}
