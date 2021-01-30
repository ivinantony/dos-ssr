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
  
    
  }


  ngOnInit() {
  console.log(JSON.parse(this.activatedRoute.snapshot.params.data))
  let encodedData = JSON.parse(this.activatedRoute.snapshot.params.data)
 this.setLocal(encodedData)
  this.redirectUrl = encodedData.data.redirect_url;
    
  }


  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
} 


async setLocal(data){
    await localStorage.setItem('cred_initial',JSON.stringify(data))
    }
  
}
