import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, LoadingController, ModalController } from '@ionic/angular';
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
  constructor(private notifications:NotificationService,
    private utils:UtilsService,
    private loadingController:LoadingController,
    private modalController:ModalController,
    private routerOutlet: IonRouterOutlet,) 
  {
    this.s3url = utils.getS3url()
    console.log(this.s3url)
    this.getData()
  }



  ngOnInit() {
  }

  viewNotification(index:any)
  {
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

  delete(){
    let client_id = Number(localStorage.getItem('client_id'))
    this.notifications.deleteNotification(client_id).subscribe(
      (data)=>this.handleResponse(data,DEL_DATA),
      (error)=>this.handleError(error)
    )
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
      console.log(data)
      this.data = data.data
      console.log(this.data)
    }
    else if(type == DEL_DATA)
    {
      this.getData()
    }
    else{
      console.log(data)
    }
    
  }
  handleError(error)
  {
    this.loadingController.dismiss()
    console.log(error)
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

}
