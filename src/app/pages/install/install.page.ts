import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-install',
  templateUrl: './install.page.html',
  styleUrls: ['./install.page.scss'],
})
export class InstallPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  onCancel() {
    this.modalController.dismiss(null)
  }
  onInstall() {
    this.modalController.dismiss(true)
  }

}
