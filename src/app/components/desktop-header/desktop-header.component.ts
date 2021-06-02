import { Component, OnInit, HostListener,ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CartcountService } from "src/app/services/cartcount.service";
import { NotcountService } from "src/app/services/notcount.service";
import { FormControl } from "@angular/forms";
import { SearchService } from "src/app/services/search/search.service";
import { debounceTime } from "rxjs/operators";
import { WishlistService } from "src/app/services/wishlist/wishlist.service";
import { UtilsService } from "src/app/services/utils.service";
import { IonContent ,AlertController } from "@ionic/angular";

@Component({
  selector: "desktop-header",
  templateUrl: "./desktop-header.component.html",
  styleUrls: ["./desktop-header.component.scss"],
})
export class DesktopHeaderComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    if(event.key  ===  'ArrowDown'  ||  event.key  ===  'ArrowLeft'){
      if(this.selected<this.result.length-1){
        this.selected +=1;
        this.content.scrollByPoint(0, 55,200)
      }
      
    }
    else if(event.key  ===  'ArrowUp' ||  event.key  ===  'ArrowRight'){
      if(this.selected>0){
        this.selected -=1;
        this.content.scrollByPoint(0, -55,200)
      }
    }
    if(event.key  ===  'Enter'){
    this.viewSearchProduct(this.selected)
    }
  }
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
  wish_count: any;
  searching: any = false;
  selected:any=0;
  public searchTerm: FormControl;
  result: Array<any> = [];
  isSearchResult: boolean = false;
  s3url: string;

  constructor(
    public router: Router,
    private notificationCountService: NotcountService,
    private cartCountService: CartcountService,
    private searchService: SearchService,
    private wishlistService: WishlistService,
    private utils: UtilsService,
    private alertController:AlertController
  ) {
    this.searchTerm = new FormControl();
    this.s3url = utils.getS3url();

    this.notificationCountService.getNotCount().subscribe((res) => {
      this.notf_count = res;
    });
    this.cartCountService.getCartCount().subscribe((res) => {
      this.cart_count = res;
    });

    this.wishlistService.getWishCount().subscribe((res) => {
      this.wish_count = res;
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

    this.router.navigate([this.categories[index].url], { replaceUrl: true });
  }
  onNavigate(url) {
    this.router.navigate([url]);
  }

  onSearchChange() {
    this.searching = true;
  }
  handleResponseSearch(data) {
   if(data.data.length==0){
    this.presentAlert()
   }
   this.selected = 0;
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
      this.router.navigate(["product", id]);
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

  goToHome(){
    this.router.navigate(["/tabs/home"]);
  }

  

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: "alert-class",
      header: "Item Not Found",

      message:'Sorry, no item found in the database. Send your enquiry by email or WhatsApp',
      buttons: [
      {
        text: "Whatsapp",
      
        handler: () => {
          window.open(
            "https://api.whatsapp.com/send?phone=447417344825&amp;"  
          );
        }
      },
      {
        text: "E-Mail",
  
        handler: () => {
          window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=info@dealonstore.com"
          ); 
          
        },
      },
      {
        text: "Cancel",
        role:"cancel"
      },
    ],
    });

    await alert.present();
  }

 

}
