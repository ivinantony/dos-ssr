import { Component, OnInit } from '@angular/core';
import { TermsandconditionsService } from 'src/app/services/termsandconditions.service';

@Component({
  selector: 'app-termsandconditions',
  templateUrl: './termsandconditions.page.html',
  styleUrls: ['./termsandconditions.page.scss'],
})
export class TermsandconditionsPage implements OnInit {

  data:any
  constructor(private termsPolicy:TermsandconditionsService) {
    this.getData()
   }

  ngOnInit() {
  }


  getData()
  {
    this.termsPolicy.getTerms().subscribe(
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
