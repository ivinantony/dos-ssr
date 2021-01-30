import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.page.html',
  styleUrls: ['./iframe.page.scss'],
})
export class IframePage implements OnInit {
  redirectUrl: any;
  constructor(private activatedRoute:ActivatedRoute,private sanitizer:DomSanitizer,private zone:NgZone) { 
    let values={
      redirect_url:this.activatedRoute.snapshot.params.redirect_url,
      tran_ref:this.activatedRoute.snapshot.params.tran_ref,
      client_id:this.activatedRoute.snapshot.params.client_id
    }
    console.log(values)
    this.setLocal(values)
  }

  ngOnInit() {

  this.redirectUrl = this.activatedRoute.snapshot.params.redirect_url;
    
  }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
  async setLocal(data){
    await localStorage.setItem('cred_initial',JSON.stringify(data))
    }
}
