import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {
  inputAmount:number
 
  constructor(private router:Router) { }

  ngOnInit() {
  }

  recharge()
  {
    let amount = this.inputAmount.toString();
    localStorage.setItem("total_amount",amount)
    let type = "recharge"
    this.router.navigate(['checkout-pay',{type}])

  }

}
