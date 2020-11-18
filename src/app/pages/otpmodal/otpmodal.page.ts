import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VerifyOtpService } from 'src/app/services/otp/verify-otp.service';

@Component({
  selector: 'app-otpmodal',
  templateUrl: './otpmodal.page.html',
  styleUrls: ['./otpmodal.page.scss'],
})
export class OtpmodalPage implements OnInit {

  inputOtp:number
  constructor(private modalController:ModalController,private otpService:VerifyOtpService) { }

  ngOnInit() {
  }

  dismissModal()
  {
    this.modalController.dismiss()
  }

  continue()
  {
    
  }

}
