import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  data:any
  s3url:any
  constructor(private notifications:NotificationService,
    private utils:UtilsService,private loadingController:LoadingController) 
  {
    this.s3url = utils.getS3url()
    console.log(this.s3url)
    this.getData()
  }

  ngOnInit() {
  }


  getData()
  {
    this.presentLoading().then( ()=>{
      let client_id = Number(localStorage.getItem('client_id'))
      this.notifications.getNotifications(client_id).subscribe(
        (data)=>this.handleResponse(data),
        (error)=>this.handleError(error)
      )
    })
    
  }

  handleResponse(data)
  {
    this.loadingController.dismiss()
    console.log(data)
    this.data = data.data
    console.log(this.data)
  }
  handleError(error)
  {
    console.log(error)
  }

  doRefresh(event) {
   
    this.getData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
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
