import { Component, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private activatedRoute:ActivatedRoute,private sanitizer:DomSanitizer,private zone:NgZone) { 
   
  }


  ngOnInit() {
  let data = JSON.parse(this.activatedRoute.snapshot.params.data)
console.log('PAYTABS',this.activatedRoute.snapshot.params.data)
let url =`https://arba.mermerapps.com/iframe/${JSON.stringify({data:JSON.parse(this.activatedRoute.snapshot.params.data)})}`;
this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  // dismiss() {
  //   this.modalController.dismiss()
  // }
}
