import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartcountService } from 'src/app/cartcount.service';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.page.html',
  styleUrls: ['./order-placed.page.scss'],
})
export class OrderPlacedPage implements OnInit {

  constructor(public router:Router,
    private cartCountService:CartcountService
    ) 
  { 
    localStorage.removeItem('cart_count')
    cartCountService.setCartCount(0)
  }

  ngOnInit() {
  }

}
