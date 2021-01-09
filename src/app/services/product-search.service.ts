import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HomeService } from './home/home.service';
import { ProductService } from './products/product.service';
// import { PRODUCTS } from '../pages/home/home.page';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  public items: any
  searchValues = new BehaviorSubject(null);
  constructor(private productService:ProductService) {
    this.getData()
  }

  filterItems(searchTerm) {
    // console.log(this.items,"items filter search")
    if (searchTerm) {
      return this.items.filter(item => {
        // console.log(item.name.toLowerCase().indexOf(searchTerm.toLowerCase()),"search resultsssss")
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
       
      });
    }

  }

  getData()
  {
    
    this.productService.getProducts().subscribe(
      (data)=> this.handleResponse(data),
      (error)=>this.handleError(error),
    )
    
  }

  handleResponse(data)
  {
    // console.log(data)
    this.items = data.products
  }
  handleError(error)
  {
    // console.log(error)
  }

  // getSearchItemsData(searchTerm) {
  //   console.log(this.filterItems(searchTerm))
  //   this.searchValues.next(this.filterItems(searchTerm))
  // }


  
}
