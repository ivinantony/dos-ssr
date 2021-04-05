import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoadingController, ToastController } from "@ionic/angular";
import { CategoryService } from "src/app/services/category/category.service";
import { UtilsService } from "src/app/services/utils.service";
@Component({
  selector: "app-categories",
  templateUrl: "./categories.page.html",
  styleUrls: ["./categories.page.scss"],
})
export class CategoriesPage implements OnInit {
  data: any;
  banners:any;
  s3url: any;
  page_count: number = 1;
  page_limit: number;
  result: any;
  categories: Array<any> = [];

  bannerSlideOpts = {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    updateOnWindowResize: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
  };

  constructor(
    public router: Router,
    private categoryService: CategoryService,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private toastController:ToastController
  ) {
    this.s3url = utils.getS3url();
    this.getData();
  }

  ngOnInit() {}

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.categoryService.getCategories(this.page_count).subscribe(
        (data) => this.handleResponse(data, infiniteScroll),
        (error) => this.handleError(error)
      );
    });
  }

  navigateToProducts(index: number) {
    this.router.navigate([
      "tabs/products",
      this.categories[index].id,
      { name: this.categories[index].category_name },
    ]);
  }

  onRoute(link) {
    this.result = [];
    if (link != null || link != undefined) {
      let data = link.split(".com").pop();

      this.router.navigateByUrl(data);
    }
  }

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count++;
      this.getData(infiniteScroll);
    }
  }

  handleResponse(data, infiniteScroll) {
    this.loadingController.dismiss();

    
    this.banners = data.banner
    data.categories.forEach((element) => {
      this.categories.push(element);
    });
    this.page_limit = data.page_count;
    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }
  handleError(error) {
    this.loadingController.dismiss();
    this.presentToast(error.error.message)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "crescent",
      cssClass: "custom-spinner",
      message: "Please wait...",
      showBackdrop: true,
    });
    await loading.present();
  }

  doRefresh(event) {
    this.page_count = 1;
    this.categories = [];
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: "custom-toast",
      position: "top",
      color: "dark",
      duration: 2000,
    });
    toast.present();
  }
}
