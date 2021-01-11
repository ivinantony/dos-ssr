import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HomeService } from "./home/home.service";
import { ProductService } from "./products/product.service";
// import { PRODUCTS } from '../pages/home/home.page';
const algoliasearch = require("algoliasearch");
@Injectable({
  providedIn: "root",
})
export class ProductSearchService {
  public items: any;
  isFetching: boolean;
  algolia_name:"products";
  algolia_id: "NU5WU3O0O2";
  search_key: "727d93c14b9d3d3467cc450603ca4f45";
  searchValues = new BehaviorSubject(null);
  constructor(private productService: ProductService) {
    this.getData();
  }

  filterItems(searchTerm) {
    console.log(searchTerm, "items filter search");
    this.isFetching = false;
    
      console.log("dfgfd",this.algolia_name)
      const client = algoliasearch('NU5WU3O0O2', '727d93c14b9d3d3467cc450603ca4f45');
      const index = client.initIndex('products');
      index.search(searchTerm, {
        attributesToRetrieve: ['name','objectID'],
        hitsPerPage: 50,
      }).then(({ hits }) => {
        console.log(hits);
        return hits
      });

      // else{
      //  this.searchService
      //   .searchData(this.todo.title, this.tokenService.getShopId())
      //   .subscribe(
      //     (data) => this.handleResponseData(data),
      //     (error) => this.handleError(error)
      //   );

      //   }
    
  }

  // old search code
  // return this.items.filter(item => {
  //   // console.log(item.name.toLowerCase().indexOf(searchTerm.toLowerCase()),"search resultsssss")
  //   return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  // });

  getData() {
    this.productService.getProducts().subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data) {
    // console.log(data)
    this.items = data.products;
  }
  handleError(error) {
    // console.log(error)
  }
}
