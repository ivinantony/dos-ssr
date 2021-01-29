import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-paytabs',
  templateUrl: './paytabs.page.html',
  styleUrls: ['./paytabs.page.scss'],
})
export class PaytabsPage implements OnInit {
  @Input() url: any;
  redirectUrl: any;
  constructor(private sanitizer: DomSanitizer, private modalController: ModalController) {

  }


  ngOnInit() {

    this.redirectUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url)
    console.log('redirectUrl', this.url)



  }
  beforeunload() {
    alert(23)
  }
  dismiss() {
    this.modalController.dismiss()
  }
}
