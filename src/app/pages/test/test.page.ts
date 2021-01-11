import { Component, OnInit } from '@angular/core';
import { UpdateService } from 'src/app/services/update/update.service';
const algoliasearch = require("algoliasearch");
const client = algoliasearch("NU5WU3O0O2","9ceabd5fdddf3f2a3cdfa970032d4ff9", { protocol: 'https:' });

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  data:any
  constructor(private update:UpdateService) { 

    this.getData()
  }

  ngOnInit() {
  }


  getData()
  {
    this.update.getData().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    console.log(data)
    this.data = data
  }
  handleError(error)
  {
    console.log(error)
  }

  upload()
  {
    console.log(this.data)

    this.data.data.filter(item => {
   
      let name = item.name
      let record = item.record
      console.log(item)
      let index = client.initIndex(name);
     
        index
      .saveObjects(record,{autoGenerateObjectIDIfNotExist: true })
      .then(({ objectIDs }) => {
        console.log(objectIDs);
      });
   
    });


  }
}
