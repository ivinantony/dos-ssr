import { Injectable, ɵConsole } from "@angular/core";
import { Console } from "console";
import { BehaviorSubject, Observable } from "rxjs";
import { HomeService } from "./home/home.service";
import { ProductService } from "./products/product.service";
// import { PRODUCTS } from '../pages/home/home.page';
const algoliasearch = require("algoliasearch");
import * as ElasticAppSearch from "@elastic/app-search-javascript";
import { SearchService } from "./search/search.service";
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
  searchResult = new BehaviorSubject([]);
  result:Array<any>=[];

  constructor(private productService: ProductService,private searchService:SearchService) {
    this.getData();
  }

   filterItems(searchTerm) {

    if(searchTerm)
    {
      // console.log(searchTerm,"search term");

      // this.result=[]
      // console.log(searchTerm, "items filter search");
      // this.isFetching = false;

      //   console.log("dfgfd",this.algolia_name)
      //   const client = algoliasearch('NU5WU3O0O2', '727d93c14b9d3d3467cc450603ca4f45');
      //   // const index = client.initIndex('products');
      //   const queries = [{
      //     indexName: 'categories',
      //     query: searchTerm,
      //     params: {
      //       hitsPerPage: 10,
      //       attributesToRetrieve: ['category_name','id','type'],
      //     }
      //   }, {
      //     indexName: 'products',
      //     query: searchTerm,
      //     params: {
      //       hitsPerPage: 10,
      //       attributesToRetrieve: ['name','id','type','category_id'],
      //     }
      //   }, {
      //     indexName: 'brands',
      //     query: searchTerm,
      //     params: {
      //       hitsPerPage: 10,
      //       attributesToRetrieve: ['brand_name','type','id'],
      //     }
      //   }];

      //   client.multipleQueries(queries).then(({ results }) => {
      //     console.log(results);

      //     results.filter(item => {

      //       this.result = this.result.concat(item.hits);
      //     })
      //     this.searchResult.next(this.result)
      //     console.log("results",this.result)
      //   });
      //   console.log(this.result)

      // this.searchService.getSearchResult(searchTerm).subscribe(
      //   (data)=>this.handleResponse(data),
      //   (error)=>this.handleError(error)
      // )

      this.result=[]
      var client = ElasticAppSearch.createClient({
        searchKey: "search-512otrevnf44vfqgyrvkyezs",
        endpointBase: "https://b3ad9be270e248bd8c485d3eb6c783d0.ent-search.ap-southeast-1.aws.cloud.es.io",
        engineName: "dos-search"
      });

      var options = {
        search_fields: { city: {} },
        result_fields: { name: { raw:{} }, city: { raw: {} } }
      };

      client
      .search(searchTerm, options)
      .then(resultList => {
        resultList.results.forEach(result => {
          // console.log(`name: ${result.getRaw("name")} raw: ${result.getRaw("city")}`);
          // console.log(result)
          this.result.push(result)
          
        });
        // console.log(resultList)
        // console.log(this.result);
        
        this.searchResult.next(this.result)
      })
      .catch(error => {
        // console.log(`error: ${error}`);
      });
    }
    else{
      this.searchResult.next([])
    }


      // return this.searchResult.asObservable()
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
    // this.items = data.products;
  }
  handleError(error) {
    // console.log(error)
  }
}
