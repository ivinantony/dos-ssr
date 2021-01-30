import { Component, HostListener, NgZone, OnInit } from "@angular/core";
import {
  LoadingController,
  MenuController,
  ModalController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HttpClient } from "@angular/common/http";
import { NavigationEnd, Router, RoutesRecognized } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { SwUpdate } from "@angular/service-worker";
import { FormControl } from "@angular/forms";
import { debounceTime, filter, pairwise } from "rxjs/operators";
import { ProductSearchService } from "./services/product-search.service";
import { ProfileService } from "./services/profile/profile.service";
import { Storage } from "@ionic/storage";
import { CartcountService } from "./cartcount.service";
import { NotcountService } from "./notcount.service";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { InstallPage } from "./pages/install/install.page";
import { AutocloseOverlayService } from "./services/autoclose-overlay.service";
import { AuthGuard } from "./guards/auth.guard";
import { INotificationPayload } from "cordova-plugin-fcm-with-dependecy-updated/typings/INotificationPayload";
import { Badge } from "@ionic-native/badge/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public pushPayload: INotificationPayload;
  public hasPermission: boolean;
  token: any;
  searching: boolean = false;
  public searchTerm: FormControl;
  searchItems: Array<any>;
  user_name: any;
  cart_count: any;
  notf_count: any;
  deferredPrompt: any;
  loggedIn: boolean = false;
  categories: Array<any> = [
    { id: 1, name: "Home", url: "/tabs/home", icon: "home-outline" },
    { id: 1, name: "Offers", url: "/offers", icon: "flash-outline" },
    {
      id: 1,
      name: "Shop by Category",
      url: "/categories",
      icon: "grid-outline",
    },
    {
      id: 1,
      name: "Shop by Brand",
      url: "/manufacturers",
      icon: "construct-outline",
    },
  ];
  selectedCategoryIndex: number = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public menuController: MenuController,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public router: Router,
    private swUpdate: SwUpdate,
    private searchService: ProductSearchService,
    private profileService: ProfileService,
    private storage: Storage,
    private cartCountService: CartcountService,
    private notCountService: NotcountService,
    private fcm: FCM,
    private afMessaging: AngularFireMessaging,
    private autocloseOverlaysService: AutocloseOverlayService,
    private modalController: ModalController,
    private authguard: AuthGuard,
    private badge: Badge
  ) {
    this.initializeApp();
    this.searchTerm = new FormControl();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#565656");
      this.setupFCM();

      this.searchService.searchResult.subscribe((data) => {
        if (data) {
          this.searchItems = data;
        } else {
          this.searchItems = [];
        }
      });

      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallPromotion();
        console.log("show banne");
      });

      this.swUpdate.available.subscribe(async (res) => {
        const toast = await this.toastController.create({
          message: "Update available!",
          position: "bottom",
          cssClass: "update-toast",
          buttons: [
            {
              role: "cancel",
              text: "Reload",
            },
          ],
        });

        await toast.present();

        toast
          .onDidDismiss()
          .then(() => this.swUpdate.activateUpdate())
          .then(() => window.location.reload());
      });
    });
  }

  async ngOnInit() {
    this.authService.isAuthenticated().then((data) => {
      console.log(data);
      if (data) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });
    this.cartCountService.setCartCount(localStorage.getItem('cart_count'));
    this.notCountService.setNotCount( localStorage.getItem('notf_count'))

    this.router.events
      .pipe(
        filter((e: any) => e instanceof NavigationEnd),
        pairwise()
      )
      .subscribe((e: any) => {
        if (
          e[0].urlAfterRedirects.startsWith("/login") ||
          e[0].urlAfterRedirects.startsWith("/otp") ||
          e[0].urlAfterRedirects.startsWith("/recharge") ||
          e[0].urlAfterRedirects.startsWith("/checkout-pay")
        ) {
        } else {
          this.storage.set("prev_url", e[0].urlAfterRedirects);
        }
      });

    this.searchTerm.valueChanges.pipe(debounceTime(700)).subscribe((search) => {
      this.searching = false;
      this.setFilteredItems(search);
    });
  }

  setFilteredItems(search) {
    this.searchService.filterItems(search);
  }

  onSearchInput() {
    this.searching = true;
  }

  viewSearchProduct(index: number) {
    console.log("type", this.searchItems[index].type);
    let id = this.searchItems[index].id;
    let catId = this.searchItems[index].category_id;
    let type = this.searchItems[index].type;

    if (type == "P") {
      this.router.navigate(["product", id, { catId }]);
    } else if (type == "B") {
      let brand_id = id;
      let brand_name = this.searchItems[index].brand_name;
      this.router.navigate(["brand-products", brand_id, { brand_name }]);
    } else if (type == "C") {
      let catId = id;
      let category_name = this.searchItems[index].category_name;
      this.router.navigate(["products", catId, { category_name }]);
    }

    this.searchItems = [];
  }

  onCancel() {
    this.searchItems = [];
  }

  logout() {
    this.badge.clear();
    this.presentLoading().then(() => {
      this.authService.logout().then(() => {
        this.presentToast().finally(() => {
          this.loggedIn = false;
          this.menuController.close();
        });
      });
    });
  }

  login() {
    this.authguard.canActivate();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Please wait... ",
      duration: 100,
      spinner: "bubbles",
    });
    await loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Logged out Succesfully",
      cssClass: "custom-toast",
      duration: 2000,
    });
    toast.present();
  }

  @HostListener("window:popstate")
  onPopState(): void {
    this.autocloseOverlaysService.trigger();
  }

  async showInstallPromotion() {
    const modal = await this.modalController.create({
      component: InstallPage,
      cssClass: "install",
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data.data) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("User accepted the install prompt");
          } else {
            console.log("User dismissed the install prompt");
          }
        });
      }
    });
    return await modal.present();
  }

  navigateByUrl(index: number) {
    this.selectedCategoryIndex = index;
    this.menuController.close().then(() => {
      this.router.navigate([this.categories[index].url]);
    });
  }

  onNavigate(url) {
    this.menuController.close().then(() => {
      this.router.navigate([url]);
    });
  }
  private async setupFCM() {
    await this.platform.ready();

    if (!this.platform.is("cordova")) {
      await this.afMessaging.messages.subscribe(async (msg: any) => {
        console.log("msgafMessaging", msg);
        let notifi_count:number = Number(localStorage.getItem("notf_count")) ;
        localStorage.setItem("notf_count", JSON.stringify(notifi_count + 1));
        this.presentToastWithOptions(msg.notification);
      });
      return;
    }

    this.fcm.onNotification().subscribe((payload) => {
      this.pushPayload = payload;
      this.notCountService.setNotCount(payload.count);
      if (payload.wasTapped) {
        this.badge.set(payload.badge);
        this.router.navigate(["notification"]);
        console.log("Received in background");
      } else {
        this.badge.set(payload.badge);
        console.log("Received in foreground");
        this.presentToastWithOptions(payload);
      }
      console.log("onNotification received event with: ", payload);
    });

    this.hasPermission = await this.fcm.requestPushPermission();
    console.log("requestPushPermission result: ", this.hasPermission);

    this.pushPayload = await this.fcm.getInitialPushPayload();
    console.log("getInitialPushPayload result: ", this.pushPayload);
  }

  async presentToastWithOptions(payload) {
    const toast = await this.toastController.create({
      header: payload.title,
      message: payload.body,
      color: "dark",
      position: "top",
      animated: true,
      duration: 2000,
      buttons: [
        {
          text: "View",
          handler: () => {
            this.router.navigate(["/notification"]);
            console.log("Cancel clicked");
          },
        },
      ],
    });
    toast.present();
  }
}
