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

   let uri = decodeURIComponent(this.activatedRoute.snapshot.paramMap.get("redirect_url"))
   console.log(uri)
   let url =`http://localhost:8102/iframe?id=${this.activatedRoute.snapshot.paramMap.get("id")}&url=${this.activatedRoute.snapshot.paramMap.get("redirect_url")}`;
// console.log('PAYTABS',this.activatedRoute.snapshot.params.data)
this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }


  ngOnInit() {
// let url =`https://arba.mermerapps.com/iframe/${JSON.stringify({data:JSON.parse(this.activatedRoute.snapshot.params.data)})}`;
// console.log('PAYTABS',this.activatedRoute.snapshot.params.data)
// this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  // dismiss() {
  //   this.modalController.dismiss()
  // }
}
