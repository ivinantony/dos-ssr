import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { WalletService } from 'src/app/services/wallet/wallet.service';
const GET_WALLET=200;

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  client_id:any
  data:any
  constructor(public router:Router,private loadingController:LoadingController,private walletService:WalletService) 
  { 
    this.client_id = Number(localStorage.getItem('client_id'))

  }

  ionViewWillEnter()
  {
    this.getData()
  }

  ngOnInit() {
  }


  getData() {
    this.presentLoading().then(()=>{
      this.walletService.getWalletDetails(this.client_id).subscribe(
        (data) => this.handleResponse(data,GET_WALLET),
        (error) => this.handleError(error)
      )})
  }


   handleResponse(data,type)
    {
    this.loadingController.dismiss()
    console.log(data)
    this.data = data
    }
    handleError(error)
    {
    this.loadingController.dismiss()

    console.log(error)
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
