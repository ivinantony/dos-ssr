import { Component, OnInit } from '@angular/core';
import { UpdateService } from 'src/app/services/update/update.service';

import { AngularFireMessaging } from '@angular/fire/messaging';
import { FCM } from '@ionic-native/fcm/ngx';
import { Platform } from '@ionic/angular';

const algoliasearch = require("algoliasearch");
const client = algoliasearch("NU5WU3O0O2","9ceabd5fdddf3f2a3cdfa970032d4ff9", { protocol: 'https:' });

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  pushes: any = [];
  data:any
  constructor(private update:UpdateService,
    private afMessaging: AngularFireMessaging,
    private fcm: FCM,
    public plt: Platform) { 

    // this.getData()

    this.plt.ready()
    .then(() => {
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        // Register your new token in your back-end if you want
        // backend.registerToken(token);
      });
    })
    
  }

  ngOnInit() {
  }


  getData()
  {
    this.update.getData().subscribe(
      (data)=>this.handleResponse(data),
      (error)=>this.handleError(error)
    )
  }

  handleResponse(data)
  {
    console.log(data)
    this.data = data
  }
  handleError(error)
  {
    console.log(error)
  }

  upload()
  {
    console.log(this.data)

    this.data.data.filter(item => {
   
      let name = item.name
      let record = item.record
      console.log(item)
      let index = client.initIndex(name);
     
        index
      .replaceAllObjects(record,{autoGenerateObjectIDIfNotExist: true })
      .then(({ objectIDs }) => {
        console.log(objectIDs);
      });
   
    });


  }


  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  getToken() {
    this.fcm.getToken().then(token => {
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }

}
