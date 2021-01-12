import { Component, OnInit } from '@angular/core';
import { UpdateService } from 'src/app/services/update/update.service';

import { AngularFireMessaging } from '@angular/fire/messaging';

const algoliasearch = require("algoliasearch");
const client = algoliasearch("NU5WU3O0O2","9ceabd5fdddf3f2a3cdfa970032d4ff9", { protocol: 'https:' });

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

  data:any
  constructor(private update:UpdateService,private afMessaging: AngularFireMessaging) { 

    this.getData()
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


  requestPushNotificationsPermission() { 
    let firebase_server_key= "AAAAzW3q9WQ:APA91bFF1MPEVt25UZuiRcnlV3t-CFVXeCfeEOJwBZwy8Ng6DMIbo-tEisdA9n1IbtXHRVn6kf-zWjxpyb7kTDu2WXlscMVxSLtIyDPBiuzAXDl8y5XKCDMljsrGLAJzHMerh9Md-WPW"
    // requesting permission
    this.afMessaging.requestToken // getting tokens
      .subscribe(
        (token) => { // USER-REQUESTED-TOKEN
          console.log('Permission granted! Save to the server!', token);
          // this.subscribeTokenToTopic(token,'id',firebase_server_key)
          this.test(token,firebase_server_key)
          
        },
        (error) => {
          console.error(error);
        }
      );
  }
  subscribeTokenToTopic(token, topic, firebase_server_key?) {
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key=' + firebase_server_key
      })
    }).then(response => {
      if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
      }
      // console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }

  // subscribeTokenToTopic(token, firebase_server_key?) {
  //   fetch('https://fcm.googleapis.com/fcm/send/' + token, {
  //     method: 'POST',
  //     headers: new Headers({
  //       'Authorization': 'key=' + firebase_server_key
  //     })
  //   }).then(response => {
  //     if (response.status < 200 || response.status >= 400) {
  //       throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
  //     }
  //     // console.log('Subscribed to "'+topic+'"');
  //   }).catch(error => {
  //     console.error(error);
  //   })
  // }
  test(token,firebase_server_key){

   fetch('https://fcm.googleapis.com/fcm/send/' + token, {
      method: 'POST',
      headers: new Headers({
        'Authorization': 'key=' + firebase_server_key,
        'Content-Type': 'application/json',
      })
    }).then(response => {

            if (response.status < 200 || response.status >= 400) {
        throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
      }
      // console.log('Subscribed to "'+topic+'"');
    }).catch(error => {
      console.error(error);
    })
  }



}
