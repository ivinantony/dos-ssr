import { Component, OnInit } from '@angular/core';
import { PrivacyPolicyService } from 'src/app/services/privacy-policy.service';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.page.html',
  styleUrls: ['./privacypolicy.page.scss'],
})
export class PrivacypolicyPage implements OnInit {

  data:any
  constructor(private privacyPolicy:PrivacyPolicyService) 
  {
  this.getData()
  }
  ngOnInit() {
  }

  getData()
  {
    this.privacyPolicy.getPrivacyPolicy().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    // console.log(data)
    this.data=data
  }
  handleError(error)
  {
    // console.log(error)
  }

}
