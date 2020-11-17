import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-loginmodal',
  templateUrl: './loginmodal.page.html',
  styleUrls: ['./loginmodal.page.scss'],
})
export class LoginmodalPage implements OnInit {

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
  }
  async navigateToLogin() {
    await this.modalController.dismiss().then(() => {
      this.router.navigate(['login'])
    })
  }
  async dismissModal() {
    await this.modalController.dismiss()
  }
}
