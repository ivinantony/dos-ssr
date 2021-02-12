import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartcountService } from "src/app/services/cartcount.service";
import { NotcountService } from "src/app/services/notcount.service";
import { FormControl } from "@angular/forms";
import { SearchService } from "src/app/services/search/search.service";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "desktop-header",
  templateUrl: "./desktop-header.component.html",
  styleUrls: ["./desktop-header.component.scss"],
})
export class DesktopHeaderComponent implements OnInit {
  categories: Array<any> = [
    {
      id: 1,
      name: "Home",
      url: "/tabs/home",
      icon: "../assets/imgs/icons/home.svg",
    },
    {
      id: 2,
      name: "Offers",
      url: "/offers",
      icon: "../assets/imgs/icons/tag.svg",
    },
    {
      id: 3,
      name: "Shop by Category",
      url: "/categories",
      icon: "../assets/imgs/icons/categories.svg",
    },
    {
      id: 4,
      name: "Shop by Brand",
      url: "/manufacturers",
      icon: "../assets/imgs/icons/brand.svg",
    },
  ];
  selectedCategoryIndex: number = 0;
  notf_count: any;
  cart_count: any;
  searching: any = false;
  public searchTerm: FormControl;
  result: Array<any> = [];
  isSearchResult: boolean = false;

  constructor(
    public router: Router,
    private notificationCountService: NotcountService,
    private cartCountService: CartcountService,
    private searchService: SearchService
  ) {
    this.searchTerm = new FormControl();
    
    this.notificationCountService.getNotCount().subscribe((res) => {
      this.notf_count = res;
    });
    this.cartCountService.getCartCount().subscribe((res) => {
      this.cart_count = res;
    });
  }

  ngOnInit() {
    // const path = window.location.pathname.split('folder/')[1];
    const path = window.location.pathname;
    
    if (path !== undefined) {
      this.selectedCategoryIndex = this.categories.findIndex(
        (page) => page.url.toLowerCase() === path.toLowerCase()
      );
    }
    this.searchTerm.valueChanges
      .pipe(debounceTime(700))
      .subscribe((searchTerm) => {
        this.searching = false;

        if (searchTerm) {
          this.isSearchResult = false;
          this.result = [];
          this.searchService.getSearchResult(searchTerm).subscribe(
            (data) => this.handleResponseSearch(data),
            (error) => this.handleErrorSearch(error)
          );
        } else {
          this.result = [];
        }
      });
  }

  navigateByUrl(index: number) {
    this.selectedCategoryIndex = index;

    this.router.navigate([this.categories[index].url],{replaceUrl:true});
  }
  onNavigate(url) {
    this.router.navigate([url]);
  }

  onSearchChange() {
    this.searching = true;
  }
  handleResponseSearch(data) {
    data.data.filter((item) => {
      this.result.push(item);
     
    });

    this.isSearchResult = true;
  }
  handleErrorSearch(error) {
    // console.log(error)
  }

  viewSearchProduct(index: number) {
    let id = this.result[index].id;
    let catId = this.result[index].category_id;
    let type = this.result[index].type;

    if (type == "P") {
      this.router.navigate(["product", id, { catId }]);
    } else if (type == "B") {
      let brand_id = id;
      let brand_name = this.result[index].brand_name;
      this.router.navigate(["brand-products", brand_id, { brand_name }]);
    } else if (type == "C") {
      let catId = id;
      let category_name = this.result[index].category_name;

      this.router.navigate(["products", catId, { category_name }]);
    }
  }
}
