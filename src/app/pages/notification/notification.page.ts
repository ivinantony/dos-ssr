import { Component, OnInit } from '@angular/core';
import { Badge } from '@ionic-native/badge/ngx';
import { ActionSheetController, IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
import { NotcountService } from 'src/app/notcount.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NotificationdetailPage } from "../notificationdetail/notificationdetail.page";
const GET_DATA = 200;
const VIEW_NOTIFICATION = 210;
const DEL_DATA = 220;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  data:any
  s3url:any
  notf_count:any
  client_id:any
  constructor(private notifications:NotificationService,
    private utils:UtilsService,
    private loadingController:LoadingController,
    private modalController:ModalController,
    private routerOutlet: IonRouterOutlet,
    private notcountService:NotcountService,
    private actionSheetController:ActionSheetController,
    private badge:Badge) 
  {
    this.s3url = utils.getS3url()
    // console.log(this.s3url)
    notcountService.getNotCount().subscribe(res=>{
      this.notf_count = res
    })
    this.getData()
    this.client_id = localStorage.getItem('client_id')
  }



  ngOnInit() {
  }

  viewNotification(index:any)
  {
   if(this.notf_count>0)
   {
    this.notf_count -=1
    this.notcountService.setNotCount(this.notf_count)
    localStorage.setItem("notf_count",this.notf_count)
    this.badge.set(this.notf_count);
   } 
    let notification_id = this.data[index].notification_id
    let data={
      notification_id : notification_id
    }
  this.notifications.postNotification(data).subscribe(
    (data)=>this.handleResponse(data,VIEW_NOTIFICATION),
    (error)=>this.handleError(error)
  )
  let id = this.data[index].id
  this.presentModal(id)
  }


  getData()
  {
    this.presentLoading().then( ()=>{
      let client_id = Number(localStorage.getItem('client_id'))
      this.notifications.getNotifications(client_id).subscribe(
        (data)=>this.handleResponse(data,GET_DATA),
        (error)=>this.handleError(error)
      )
    })
    
  }

  handleResponse(data,type)
  {
    if(type == GET_DATA)
    {
      this.loadingController.dismiss()
      // console.log(data)
      this.data = data.data
      // console.log(this.data)
    }
    else if(type == DEL_DATA)
    {
      this.loadingController.dismiss()
      this.notf_count -=1
    this.notcountService.setNotCount(this.notf_count)
    localStorage.setItem("notf_count",this.notf_count)
    this.badge.set(this.notf_count);
      this.getData()
    }
    else{
      // console.log(data)
    }
    
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    // console.log(error)
  }

  doRefresh(event) {
   
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  async presentModal(id) {
    const modal = await this.modalController.create({
      component: NotificationdetailPage,
      cssClass:'notification',
      componentProps: { id: id },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });

    await modal.present();

    await modal.onDidDismiss().then(() => {
      this.getData()
    }); 
    
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      cssClass:'custom-spinner',
      message: 'Please wait...',
      showBackdrop: true
    });
    await loading.present();
  }

 


  async prsentOptions(index: number) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: "my-custom-class",
      buttons: [
        {
          text: "Delete",
          icon: "trash-outline",
          handler: () => {

            this.presentLoading()
            this.notifications.deleteNotification(this.client_id,this.data[index].notification_id).subscribe(
              (data)=>this.handleResponse(data,DEL_DATA),
              (error)=>this.handleError(error)
            )
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
