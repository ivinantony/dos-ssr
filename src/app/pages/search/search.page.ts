import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from "rxjs/operators";
import { SearchService } from 'src/app/services/search/search.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searching: any = false;
  result:Array<any>=[]
  public searchTerm: FormControl;

  constructor(private searchService:SearchService,private router:Router) { 
    this.searchTerm = new FormControl();

  }

  ngOnInit() {
    this.searchTerm.valueChanges.pipe(debounceTime(700)).subscribe((searchTerm) => {
      this.searching = false;
      console.log(searchTerm)
      if(searchTerm)
        {
          this.result=[]
          this.searchService.getSearchResult(searchTerm).subscribe(
            (data)=>this.handleResponseSearch(data),
            (error)=>this.handleErrorSearch(error)
          )
        }
      
      // this.setFilteredItems(search);
    });
  }

  onSearchInputMobile() {
    this.searching = true;
  }

  handleResponseSearch(data) {
    console.log(data)
    data.data.filter(item => {
      this.result.push(item)
      }) 
    console.log(this.result,"result")
  }
  handleErrorSearch(error) {
    console.log(error)
  }

  viewSearchProduct(index: number) {
    console.log("type",this.result[index].type)
    let id = this.result[index].id
    let catId =this.result[index].category_id
    let type = this.result[index].type
    
    if(type == "P")
    {
      this.router.navigate(['product',id, {catId}])
    }
    else if(type == "B")
    {
      let brand_id = id
      let brand_name = this.result[index].brand_name
      this.router.navigate(['brand-products',brand_id,{brand_name}])
    }
    else if(type == "C")
    {
      let catId = id
      let category_name = this.result[index].category_name
      
      this.router.navigate(['products', catId, {category_name}])

    }
    
    
  }

  
  onCancel() {
    this.result = [];
  }

}
