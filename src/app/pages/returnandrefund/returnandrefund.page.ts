import { Component, OnInit } from '@angular/core';
import { ReturnandrefundService } from 'src/app/services/returnandrefund.service';

@Component({
  selector: 'app-returnandrefund',
  templateUrl: './returnandrefund.page.html',
  styleUrls: ['./returnandrefund.page.scss'],
})
export class ReturnandrefundPage implements OnInit {

  data:any
  constructor(private returnPolicy:ReturnandrefundService) {
    this.getData()
   }

  ngOnInit() {
  }


  getData()
  {
    this.returnPolicy.getReturnAndRefundPolicy().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    console.log(data)
    this.data=data
  }
  handleError(error)
  {
    console.log(error)
  }
}
