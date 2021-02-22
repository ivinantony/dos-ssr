import { Component, OnInit } from '@angular/core';
import { ShippingPolicyService } from 'src/app/services/shippingPolicy/shipping-policy.service';

@Component({
  selector: 'app-shippingpolicy',
  templateUrl: './shippingpolicy.page.html',
  styleUrls: ['./shippingpolicy.page.scss'],
})
export class ShippingpolicyPage implements OnInit {
  data: any
  constructor(private deliverypolicy: ShippingPolicyService) {
    this.getData()
  }

  ngOnInit() {
  }

  getData() {
    this.deliverypolicy.getShippingpolicy().subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    )
  }

  handleResponse(data) {
    this.data = data
  }
  handleError(error) {
    // console.log(error)
  }
}
