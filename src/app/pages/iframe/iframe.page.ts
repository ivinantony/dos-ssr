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

    console.log(JSON.parse(data));

    this.setStorage().finally(() => {
      this.openUrl();
    })
  }

  ngOnInit() {

  }
  async setStorage() {
    await localStorage.setItem('tran_data', JSON.stringify(this.orderData));
  }

  openUrl() {
    window.open(this.orderData.redirect_url, "_self")
  }

  ngAfterViewInit(): void {

  }
}