import { Component, NgZone, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { url } from 'inspector';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.page.html',
  styleUrls: ['./iframe.page.scss'],
})
export class IframePage implements OnInit {
  orderData: any;
  constructor(private storage: Storage) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const data = urlParams.get('data')

    this.orderData = JSON.parse(data);

    this.storage.set('client_id', this.orderData.client_id);
    // this.storage.set('tran_ref', this.orderData.tran_ref).finally(()=>{
    //   this.openUrl()
    // })
    console.log(JSON.parse(data));

    this.setStorage(data).finally(() => {
      // this.openUrl();
    })
  }

  ngOnInit() {
   
  }
  async setStorage(data) {
    await localStorage.setItem('tran_ref', this.orderData.tran_ref)
    await localStorage.set('client_id', this.orderData.client_id);
  }

  openUrl() {
    window.open(this.orderData.redirect_url, "_self")
  }

  ngAfterViewInit(): void {
  
    alert(JSON.stringify(localStorage.getItem('client_id')))
  }
}