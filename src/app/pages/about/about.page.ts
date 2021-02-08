import { Component, OnInit } from '@angular/core';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
data:any
  constructor(private aboutService:AboutService) {
    this.getData()
   }

  ngOnInit() {
  }


  getData()
  {
    this.aboutService.getAbout().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {

    this.data=data
  }
  handleError(error)
  {

  }

}
