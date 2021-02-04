import { Injectable, ɵConsole } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ProductService } from "./products/product.service";
import { SearchService } from "./search/search.service";
@Injectable({
  providedIn: "root",
})
export class ProductSearchService {
  public items: any;
  isFetching: boolean;
  searchValues = new BehaviorSubject(null);
  searchResult = new BehaviorSubject([]);
  result: Array<any> = [];

  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) {
    // this.getData();
  }

  filterItems(searchTerm) {
    if (searchTerm) {
      this.searchService.getSearchResult(searchTerm).subscribe(
        (data) => this.handleResponse(data),
        (error) => this.handleError(error)
      );
    } else {
      this.searchResult.next([]);
    }
  }

  handleResponse(data) {
    data.data.filter((item) => {
      this.result.push(item);
    });

    this.searchResult.next(this.result);
    // this.items = data.products;
  }
  
  handleError(error) {}
}
