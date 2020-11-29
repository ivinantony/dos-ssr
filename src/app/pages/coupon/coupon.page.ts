import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { PromoService } from 'src/app/services/promo/promo.service';
const GET_CODES = 200;
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.page.html',
  styleUrls: ['./coupon.page.scss'],
})
export class CouponPage implements OnInit {

  promoSelected:any
  data:any
  constructor(private modalController: ModalController,private promoService:PromoService,private toastController:ToastController) 
  {
    this.getData()
   }

  ngOnInit() {
  }
  dismissModal() {
    this.modalController.dismiss()
  }
  onSearchChange($event) {

  }
  getData()
  {
    let client_id = Number(localStorage.getItem('client_id'))
    this.promoService.getPromoCodes(client_id).subscribe(
      (data)=>this.handleResponse(data,GET_CODES),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data,type)
  {
  if(type == GET_CODES)
  {
    console.log(data)
    this.data = data
  }

  }
  handleError(error)
  {
    console.log(error)
  }
  apply(i)
  {
    let data={
      promo_Id :this.data.promo_codes[i].id ,
      discount_amount:this.data.promo_codes[i].discount_amount,
      
    }
    this.modalController.dismiss(data)
    this.showToastSuccess("Coupon applied successfully")
  }


  async showToastSuccess(message) {
    let toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "middle",
      color: "success",
    });
    toast.present();
  }
}
