import { Component, OnInit } from '@angular/core';
import { CartcountService } from 'src/app/cartcount.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
cart_count:any
  constructor(private cartcountService:CartcountService) {
 this.cartcountService.getCartCount().subscribe((val)=>{
  this.cart_count=val
    })
   }

  ngOnInit() {
  }

}
