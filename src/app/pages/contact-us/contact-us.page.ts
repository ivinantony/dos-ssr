import { Component, OnInit } from '@angular/core';
import { ContactUsService } from 'src/app/services/contactUs/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  data:any
  constructor(private contactService:ContactUsService) 
  { 
    this.getData()
  }

  ngOnInit() {
  }


  getData()
  {
    this.contactService.getContact().subscribe(
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
