import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { defineCustomElements } from "@teamhive/lottie-player/loader";
@Component({
  selector: 'app-successful',
  templateUrl: './successful.page.html',
  styleUrls: ['./successful.page.scss'],
})
export class SuccessfulPage implements OnInit {

  constructor(public router:Router) {
    defineCustomElements(window);
   }

  ngOnInit() {
  }

}
