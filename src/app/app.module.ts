import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { Component, ViewChild } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { FilterComponent} from './pages/filter/filter.component';
import { AngularFireModule } from '@angular/fire';  
import { AngularFireMessagingModule } from '@angular/fire/messaging';
// import { IonicImageZoomer } from 'ionic-image-zoomer';


@NgModule({
  declarations: [AppComponent,FilterComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    IonicModule.forRoot({
      mode:'ios',
      swipeBackEnabled: true,
    }),
    IonicStorageModule.forRoot(),
   
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    
    ServiceWorkerModule.register('combined-sw.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Badge,
    Geolocation,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule 
{
  constructor(library: FaIconLibrary) { 
		library.addIconPacks(fas, fab, far);
	}
}
