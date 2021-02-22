import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
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
    private modalController:ModalController,
    private authservice:AuthenticationService) 
    { 
      this.s3url = this.utils.getS3url()
      this.getData()
    }

  ngOnInit() {
    if (!window.history.state.modal) {
      const modalState = { modal: true };
      history.pushState(modalState, null);
      }
  }

  getData()
  {
    this.presentLoading().then( ()=>{
      this.authservice.isAuthenticated().then(val=>{
        this.notifications.getNotificationDetails(this.id,val).subscribe(
          (data)=>this.handleResponse(data),
          (error)=>this.handleError(error)
        )
      })
      
    })
    
  }

  close()
  {
    this.modalController.dismiss()
  }

  handleResponse(data)
  {
    this.loadingController.dismiss()
    this.data = data
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
