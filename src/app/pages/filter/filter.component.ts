import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  option_id:any="hey"
  constructor(private popCtrl:PopoverController) { }

  ngOnInit() {}

  closePopover(){
    this.popCtrl.getTop().then( p => p.dismiss(this.option_id) ) 
  }
  select(id:number)
  {
    this.option_id = id;
    this.closePopover()
  }

}
