import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {
  public form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }
  onCatChange(event) {
    console.log(event.detail.value)
  }
  dismiss() {
    this.modalController.dismiss()
  }
  submit() {
    this.modalController.dismiss()
  }
}
