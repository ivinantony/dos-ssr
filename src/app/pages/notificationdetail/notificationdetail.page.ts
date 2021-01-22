import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-notificationdetail',
  templateUrl: './notificationdetail.page.html',
  styleUrls: ['./notificationdetail.page.scss'],
})
export class NotificationdetailPage implements OnInit {
  @Input() id: any;
  data:any
  s3url:any
 
  constructor(private notifications:NotificationService,
    private utils:UtilsService,
    private loadingController:LoadingController,
    private modalController:ModalController) 
    { 
      this.s3url = this.utils.getS3url()
      this.getData()
    }

  ngOnInit() {
  }

  getData()
  {
    this.presentLoading().then( ()=>{
      let client_id = Number(localStorage.getItem('client_id'))
      this.notifications.getNotificationDetails(this.id,client_id).subscribe(
        (data)=>this.handleResponse(data),
        (error)=>this.handleError(error)
      )
    })
    
  }

  close()
  {
    this.modalController.dismiss()
  }
  handleResponse(data)
  {
    this.loadingController.dismiss()
    // console.log(data)
    this.data = data
    // console.log(this.data)
  }
  handleError(error)
  {
    // console.log(error)
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
