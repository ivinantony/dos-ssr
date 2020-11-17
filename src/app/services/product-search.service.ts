import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PRODUCTS } from '../pages/home/home.page';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  public items: any = PRODUCTS;
  searchValues = new BehaviorSubject(null);
  constructor() {
  }

  filterItems(searchTerm) {
    if (searchTerm) {
      return this.items.filter(item => {
        return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });
    }

  }
  // getSearchItemsData(searchTerm) {
  //   console.log(this.filterItems(searchTerm))
  //   this.searchValues.next(this.filterItems(searchTerm))
  // }
}
