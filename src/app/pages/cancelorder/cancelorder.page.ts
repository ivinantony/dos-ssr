import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cancelorder',
  templateUrl: './cancelorder.page.html',
  styleUrls: ['./cancelorder.page.scss'],
})
export class CancelorderPage implements OnInit {

  constructor(private modalController:ModalController) { }

  ngOnInit() {
  }

  close()
  {
    this.modalController.dismiss()
  }
  orderCancel()
  {
    this.modalController.dismiss()
  }
}
