import { Component, OnInit } from '@angular/core';
import { UpdateService } from 'src/app/services/update/update.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { INotificationPayload } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/typings';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
const algoliasearch = require("algoliasearch");
const client = algoliasearch("NU5WU3O0O2","9ceabd5fdddf3f2a3cdfa970032d4ff9", { protocol: 'https:' });
import * as ElasticAppSearch from "@elastic/app-search-javascript";

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  pushes: any = [];
  data:any;
  public hasPermission: boolean;
  public token: string;
  public pushPayload: INotificationPayload;
  constructor(private update:UpdateService,
  private afMessaging: AngularFireMessaging,
    private fcm: FCM,
    public platform: Platform,
    public router:Router) { 
      
    // this.getData()

    var client = ElasticAppSearch.createClient({
      searchKey: "search-512otrevnf44vfqgyrvkyezs",
      endpointBase: "https://b3ad9be270e248bd8c485d3eb6c783d0.ent-search.ap-southeast-1.aws.cloud.es.io",
      engineName: "dos-search"
    });

    

    this.run(client)
    

  }


  private async setupFCM() {
    await this.platform.ready();
    console.log('FCM setup started');

    if (!this.platform.is('cordova')) {
       // requesting permission
        this.afMessaging.requestToken // getting tokens
          .subscribe(
            (token) => { // USER-REQUESTED-TOKEN
              console.log('Permission granted! Save to the server!', token);
            },
            (error) => {
              console.error(error);
            }
          );
      
    }
    console.log('In cordova platform');

    console.log('Subscribing to token updates');
    this.fcm.onTokenRefresh().subscribe((newToken) => {
      this.token = newToken;
      // this.loginForm.controls['fcm_token'].setValue(newToken);
      console.log('onTokenRefresh received event with: ', newToken);
    });

    console.log('Subscribing to new notifications');
    this.fcm.onNotification().subscribe((payload) => {
      this.pushPayload = payload;
      if (payload.wasTapped) {
        this.router.navigate(['notifications',{data:payload}]);
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
        this.router.navigate(['notifications',{data:payload}]);
      }
    });

    this.hasPermission = await this.fcm.requestPushPermission();
    console.log('requestPushPermission result: ', this.hasPermission);

    this.token = await this.fcm.getToken();
    // this.loginForm.controls['fcm_token'].setValue(this.token);
    console.log('getToken result: ', this.token);

    this.pushPayload = await this.fcm.getInitialPushPayload();
    console.log('getInitialPushPayload result: ', this.pushPayload);
  }

  ngOnInit() {
  }

  async run (client) {
    // Let's start by indexing some data
    await client.index({
      index: 'game-of-thrones',
      // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
      body: {
        character: 'Ned Stark',
        quote: 'Winter is coming.'
      }
    })
   
    await client.index({
      index: 'game-of-thrones',
      // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
      body: {
        character: 'Daenerys Targaryen',
        quote: 'I am the blood of the dragon.'
      }
    })
   
    await client.index({
      index: 'game-of-thrones',
      // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
      body: {
        character: 'Tyrion Lannister',
        quote: 'A mind needs books like a sword needs a whetstone.'
      }
    })
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
      console.log(token,"token")
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }


  // requestPushNotificationsPermission() { // requesting permission
  //   this.afMessaging.requestToken // getting tokens
  //     .subscribe(
  //       (token) => { // USER-REQUESTED-TOKEN
  //         console.log('Permission granted! Save to the server!', token);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  // }



  
}


// this.plt.ready()
// .then(() => {
//   this.fcm.onNotification().subscribe(data => {
//     if (data.wasTapped) {
//       console.log("Received in background");
//     } else {
//       console.log("Received in foreground");
//     };
//   });

//   this.fcm.onTokenRefresh().subscribe(token => {
//     // Register your new token in your back-end if you want
//     // backend.registerToken(token);
//     console.log("token cordova",token)
//   });
// })