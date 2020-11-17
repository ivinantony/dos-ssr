import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.page.html',
  styleUrls: ['./imagemodal.page.scss'],
})
export class ImagemodalPage implements OnInit {
  constructor(private modalController: ModalController) { }

  ngOnInit() { }
  dismisModal() { this.modalController.dismiss() }


}
