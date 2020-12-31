import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.page.html',
  styleUrls: ['./recharge.page.scss'],
})
export class RechargePage implements OnInit {
  inputAmount:number
  balance:number=0
  temp:number
  constructor(private router:Router,private activatedRoute:ActivatedRoute) 
  { 
    this.inputAmount = activatedRoute.snapshot.params.balance
    // console.log(this.balance)
    // if(this.temp)
    // {
    //   console.log("hello")
    //   this.inputAmount = this.balance

    // }
  }

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
