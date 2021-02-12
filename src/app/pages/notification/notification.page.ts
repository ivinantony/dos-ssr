import { Component, OnInit } from "@angular/core";
import { Badge } from "@ionic-native/badge/ngx";
import {
  ActionSheetController,
  IonRouterOutlet,
  LoadingController,
  ModalController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { NotcountService } from "src/app/services/notcount.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { NotificationService } from "src/app/services/notification/notification.service";
import { UtilsService } from "src/app/services/utils.service";
import { NotificationdetailPage } from "../notificationdetail/notificationdetail.page";
const GET_DATA = 200;
const VIEW_NOTIFICATION = 210;
const DEL_DATA = 220;

@Component({
  selector: "app-notification",
  templateUrl: "./notification.page.html",
  styleUrls: ["./notification.page.scss"],
})
export class NotificationPage implements OnInit {
  notificationMsgs: Array<any>=[];
  s3url: any;
  notf_count: any;
  currentIndex: number;
  page_limit: number;
  page_count: number = 1;
  constructor(
    private notifications: NotificationService,
    private utils: UtilsService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private notcountService: NotcountService,
    private actionSheetController: ActionSheetController,
    private badge: Badge,
    private storage: Storage,
    private authservice: AuthenticationService
  ) {
    this.s3url = this.utils.getS3url();
    notcountService.getNotCount().subscribe((res) => {
      this.notf_count = res;
    });
    this.getData();
  }

  ngOnInit() {}

  getData(infiniteScroll?) {
    this.presentLoading().then(() => {
      this.authservice.isAuthenticated().then((val) => {
        if (val) {
          this.notifications.getNotifications(val,this.page_count,).subscribe(
            (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
            (error) => this.handleError(error)
          );
        } else {
          this.notifications.getNotifications(null,this.page_count).subscribe(
            (data) => this.handleResponse(data, GET_DATA, infiniteScroll),
            (error) => this.handleError(error)
          );
        }
      });
    });
  }

  viewNotification(index: any) {
    if (this.notf_count > 0) {
      this.notf_count = this.notf_count - 1;
      this.notcountService.setNotCount(this.notf_count);
      this.storage.set("notf_count", this.notf_count);
      this.badge.set(this.notf_count);
    }
    let notification_id = this.notificationMsgs[index].notification_id;
    let data = {
      notification_id: notification_id,
    };
    this.notifications.postNotification(data).subscribe(
      (data) => this.handleResponse(data, VIEW_NOTIFICATION),
      (error) => this.handleError(error)
    );
    let id = this.notificationMsgs[index].id;
    
    this.presentModal(id);
  }

  handleResponse(data, type, infiniteScroll?) {
    if (type == GET_DATA) {
      data.data.filter((msg)=>{
        this.notificationMsgs.push(msg)
      })
      // this.notificationMsgs = data.data;
      this.page_limit = data.page_count
      this.loadingController.dismiss();
    } else if (type == DEL_DATA) {
      if (this.notificationMsgs[this.currentIndex].push_notification_read_status) {
        this.badge.set(this.notf_count);
      } else {
        this.notf_count = this.notf_count - 1;
        this.notcountService.setNotCount(this.notf_count);
        this.storage.set("notf_count", this.notf_count);
        this.badge.set(this.notf_count);
      }
      this.notificationMsgs.splice(this.currentIndex, 1);
      this.loadingController.dismiss();
    } else {
      // console.log(data)
    }

    if (infiniteScroll) {
      infiniteScroll.target.complete();
    }
  }

  handleError(error) {
    this.loadingController.dismiss();
  }

  async presentModal(id) {
    const modal = await this.modalController.create({
      component: NotificationdetailPage,
      cssClass: "notification",
      componentProps: { id: id },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });

    await modal.present();

    await modal.onDidDismiss().then(() => {
      this.page_count=1;
    this.notificationMsgs=[]
      this.getData();
    });
  }

  async prsentOptions(index: number) {
    this.currentIndex = index;
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {
            this.presentLoading().then(() => {
              this.authservice.isAuthenticated().then((val) => {
                this.notifications
                  .deleteNotification(val, this.notificationMsgs[index].notification_id)
                  .subscribe(
                    (data) => this.handleResponse(data, DEL_DATA),
                    (error) => this.handleError(error)
                  );
              });
            });
          },
        },
      ],
    });
    await actionSheet.present();
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

  loadMoreContent(infiniteScroll) {
    if (this.page_count == this.page_limit) {
      infiniteScroll.target.disabled = true;
    } else {
      this.page_count += 1;

      this.getData(infiniteScroll);
    }
  }


  doRefresh(event) {
    this.page_count=1;
    this.notificationMsgs=[]
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
