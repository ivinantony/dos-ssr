import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { UtilsService } from 'src/app/services/utils.service';
const GET_DATA=200;
@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.page.html',
  styleUrls: ['./manufacturers.page.scss'],
})
export class ManufacturersPage implements OnInit {
data:any
s3url:any
  constructor(private manufacturerService:ManufacturerService,private utils:UtilsService,private router:Router) 
  { 
    this.s3url  = utils.getS3url()
  this.getData()
  }

  ngOnInit() {
  }


  getData()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.manufacturerService.getManufacturers().subscribe(
      (data)=>this.handleResponse(data,GET_DATA),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {this.data = data
    console.log(data)
  }
  handleError(error)
  {
    console.log(error)
  }

  navigateToBrandProducts(index:number)
  {
    let brand_id = this.data.brands[index].id
    let brand_name = this.data.brands[index].brand_name
    this.router.navigate(['brand-products',{brand_id,brand_name}])
  }
}
