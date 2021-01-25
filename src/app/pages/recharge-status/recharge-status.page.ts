import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-recharge-status',
  templateUrl: './recharge-status.page.html',
  styleUrls: ['./recharge-status.page.scss'],
})
export class RechargeStatusPage implements OnInit {
  client_id:any
  ref:any
  status:boolean

  constructor(private storage:Storage,private paymentService:PaymentService,
    private alertController:AlertController,private router:Router,
    private ngZone:NgZone) 
  { 
    this.client_id = localStorage.getItem("client_id")

    this.storage.get('tran_ref').then((val) => {
      this.ref = val
      paymentService.confirmPayment(this.ref,this.client_id).subscribe(
       (data)=>this.handleResponse(data),
       (error)=>this.handleError(error)
     )
   })
  }

  ngOnInit() {
  }


  handleResponse(data)
  {
    console.log(data)
    if(data.details.response_status == "A")
    {
      this.status = true
    }
    else if(data.details.response_status != "A")
    {
      this.status = false
      this.presentAlert(data.details.response_message)
    }
    
  }
  handleError(error)
  {
    console.log(error)
  }


  async presentAlert(msg:string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Recharge Failed',
     
      message:msg,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['wallet'])
          }
        }
      ]
    });

    await alert.present();
  }

  continue()
  {
    this.storage.get('prev_url').then((val) => {
      // console.log(val,"prev url")
      this.ngZone.run(()=>{
      this.router.navigate([val] || ['/wallet'], { replaceUrl: true })
      });
    })
  }
}
