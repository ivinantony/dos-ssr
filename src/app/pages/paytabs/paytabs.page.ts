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
  safeUrl:any;
  constructor(private sanitizer: DomSanitizer, private modalController: ModalController) {

  }


  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
      }
  let url ="https://arba.mermerapps.com/paypal"
  this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    console.log('redirectUrl', this.url)



  }

  dismiss() {
    this.modalController.dismiss()
  }
}
