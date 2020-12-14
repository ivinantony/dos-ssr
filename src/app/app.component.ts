import { Component, OnInit } from '@angular/core';

import { LoadingController, MenuController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClient } from '@angular/common/http';
import { CATEGORIES } from './pages/home/home.page';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { SwUpdate } from '@angular/service-worker';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ProductSearchService } from './services/product-search.service';
import { ProfileService } from './services/profile/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  categories = CATEGORIES
  searching: boolean = false
  public searchTerm: FormControl;
  searchItems: Array<any>;
  client_id:any = null
  user_name:any
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
    private profileService:ProfileService
  ) {
    this.client_id = localStorage.getItem('client_id')

    console.log(this.client_id)
    this.searchTerm = new FormControl();
    this.initializeApp();
    
    
    this.searchService.searchValues.subscribe(data => {
      console.log('data', data)
      if (data) {
        this.searchItems = data
        console.log(this.searchItems,"searchItems")
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
    this.searchItems = this.searchService.filterItems(search)
  }
  onSearchInput() {
    this.searching = true;
  }
  viewSearchProduct(index: number) {
    let id = this.searchItems[index].id
    let catId =this.searchItems[index].category_id
    this.router.navigate(['product', {id,catId}])
    this.searchItems = [];
  }
  onCancel() {
    this.searchItems = []
  }



  navigateToProducts(index: number) {
    this.selectedIndex = index;
    this.router.navigate(['products', this.categories[index].id, { name: this.categories[index].name }])
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
    console.log(data)
    this.user_name = data.client_Details.name
  }
  handleError(error){
    console.log(error)
  }
}
