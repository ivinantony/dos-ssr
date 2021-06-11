import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactUsService } from 'src/app/services/contactUs/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  data:any
  constructor(private contactService:ContactUsService,
    public router:Router) 
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

  facebook() {
    window.open("https://www.facebook.com/deal-on-store-103110191641253", "_self");
  }
  twitter() {
    window.open("https://twitter.com/dealonstore", "_self");
  }
  insta() {
    window.open("https://www.instagram.com/deal_on_store/", "_self");
  }

  whatsapp() {
    window.open(
      "https://api.whatsapp.com/send?phone=447417344825&amp;"
      
    );
  }
  ios_App(){
    window.open(this.data.app_store_url);
    
  }

  android_App(){
 
      window.open(this.data.play_store_url);

  }


}
