import { Component, OnInit } from '@angular/core';

import { LoadingController, MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { SwUpdate } from '@angular/service-worker';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, pairwise } from 'rxjs/operators';
import { ProductSearchService } from './services/product-search.service';
import { ProfileService } from './services/profile/profile.service';
import { Storage } from '@ionic/storage';
import { CartcountService } from './cartcount.service';
import { NotcountService } from './notcount.service';
// import { NavigationEnd, Router, RoutesRecognized } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;

  searching: boolean = false
  public searchTerm: FormControl;
  searchItems: Array<any>;
  client_id:any = null
  user_name:any
  cart_count:any
  notf_count:any
  cart_count_initial:any
  notf_count_initial:any
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuController: MenuController,
    private authService: AuthenticationService,
    private menu: MenuController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public router: Router,
    private swUpdate: SwUpdate,
    private searchService: ProductSearchService,
    private profileService:ProfileService,
    private storage: Storage,
    private cartCountService:CartcountService,
    private notCountService:NotcountService
  ) {
    this.client_id = localStorage.getItem('client_id')
    this.cart_count_initial = localStorage.getItem('cart_count')
    console.log(this.cart_count_initial)
    cartCountService.setCartCount(this.cart_count_initial)
    cartCountService.getCartCount().subscribe(res => {
      this.cart_count=res}
      )
    this.notf_count_initial = localStorage.getItem('notf_count')
    notCountService.setNotCount(this.notf_count_initial)
    notCountService.getNotCount().subscribe(res => {
      this.notf_count=res}
      )
    // console.log(this.cart_count)
    

    // console.log(this.client_id)
    this.searchTerm = new FormControl();
    this.initializeApp();
    
    
    this.searchService.searchResult.subscribe(data => {
      // console.log('data', data)
      if (data) {
        this.searchItems = data
        // console.log(this.searchItems,"searchItems")
      } else {
        this.searchItems = []
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
     
    });
  }


  async ngOnInit() {


    this.router.events
    .pipe(filter((e: any) => e instanceof NavigationEnd),
      pairwise()
    ).subscribe((e: any) => {
      // console.log(e,"array")
      if (e[0].urlAfterRedirects.startsWith('/login') || e[0].urlAfterRedirects.startsWith('/otp') || e[0].urlAfterRedirects.startsWith('/recharge') || e[0].urlAfterRedirects.startsWith('/checkout-pay')) 
      {

      } else {
        this.storage.set('prev_url', e[0].urlAfterRedirects);
      }
    });
 

    this.searchTerm.valueChanges
      .pipe(debounceTime(700))
      .subscribe(search => {
        this.searching = false;
        this.setFilteredItems(search);
      });


    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastController.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }


  setFilteredItems(search) {
    this.searchService.filterItems(search)
  }
  onSearchInput() {
    this.searching = true;
  }
  viewSearchProduct(index: number) {
    let id = this.searchItems[index].id
    let catId =this.searchItems[index].category_id
    let type = this.searchItems[index].type
    
    if(type == "product")
    {
      this.router.navigate(['product',id, {catId}])
    }
    else if(type == "brand")
    {
      let brand_id = id
      let brand_name = this.searchItems[index].brand_name
      this.router.navigate(['brand-products',brand_id,{brand_name}])
    }
    else if(type == "category")
    {
      let catId = id
      let category_name = this.searchItems[index].category_name
      
      this.router.navigate(['products', catId, {category_name}])

    }
    
    this.searchItems = [];
  }
  onCancel() {
    this.searchItems = []
  }



  navigateToProducts(index: number) {
    this.selectedIndex = index;
  }
  logout() {
    this.presentLoading().then(() => {
      this.authService.logout().then(() => {
        this.presentToast().finally(() => {
          this.menu.close()
        })

      })
    })


  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait... ',
      duration: 100,
      spinner: 'bubbles'
    });
    await loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Logged out Succesfully',
      cssClass: 'custom-toast',
      duration: 2000
    });
    toast.present();
  }

  getData()
  {
  
    this.profileService.getProfileDetails(this.client_id).subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    // console.log(data)
    this.user_name = data.client_Details.name
  }
  handleError(error){
    // console.log(error)
  }



  goToOffer()
  {this.menuController.close()
    this.router.navigate(['offer'])
  }
  goToHome()
  {this.menuController.close()
    this.router.navigate(['home'])
  }
  goToCategories()
  {this.menuController.close()
    this.router.navigate(['categories'])
  }
  goToManufacturers()
  {this.menuController.close()
    this.router.navigate(['manufacturers'])
  }
  goToProfile()
  {this.menuController.close()
    this.router.navigate(['profile'])
  }
  goToCart()
  {this.menuController.close()
    this.router.navigate(['cart'])
  }
  goToNotification()
  {
    this.menuController.close()
    this.router.navigate(['notification'])
  }


}
