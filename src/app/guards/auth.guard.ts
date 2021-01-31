import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { LoginmodalPage } from '../pages/loginmodal/loginmodal.page';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public ModalController: ModalController,
    public authservice: AuthenticationService
  ) {
  }



  canActivate():Promise<boolean>  {
    return this.authservice.isAuthenticated().then(res => {
      if (res) {
        return true;
      }
      this.presentModal();
      return false;
    });
  }

  async presentModal() {
    const modal = await this.ModalController.create({
      component: LoginmodalPage,
      cssClass: 'my-custom-login',
      swipeToClose: true,
    });
    return await modal.present();
  }
}

