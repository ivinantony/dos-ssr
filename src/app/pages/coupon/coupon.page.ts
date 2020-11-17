import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  dismissModal() {
    this.modalController.dismiss()
  }
  onSearchChange($event) {

  }
}
