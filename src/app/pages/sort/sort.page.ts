import { Component, OnInit } from '@angular/core';
import { eventNames } from 'process';


@Component({
  selector: 'app-sort',
  templateUrl: './sort.page.html',
  styleUrls: ['./sort.page.scss'],
})

export class SortPage implements OnInit {

  img: any
  glass: any;
  w: any;
  h: any;
  bw: any;
  pos: any;
  x: any;
  y: any;
  result:any;
 zoom:number = 3
  constructor() {

  }
  

  ngOnInit() {
  }

    
  magnify(imgID, zoom) {
    this.img = document.getElementById(imgID);
    /*create magnifier glass:*/
    this.glass = document.createElement("DIV");
    this.glass.setAttribute("class","img-magnifier-glass");
    /*insert magnifier glass:*/
    this.img.parentElement.insertBefore(this.glass, this.img);
    /*set background properties for the magnifier glass:*/
    this.glass.style.backgroundImage = "url('" + this.img.src + "')";
    this.glass.style.backgroundRepeat = "no-repeat";
    this.glass.style.backgroundSize = (this.img.width * zoom) + "px " + (this.img.height * zoom) + "px";
    this.bw = 3;
    this.w = this.glass.offsetWidth / 2;
    this.h = this.glass.offsetHeight / 2;
    /*execute a function when someone moves the magnifier glass over the image:*/
    this.glass.addEventListener("mousemove", this.moveMagnifier.bind(this));
    this.img.addEventListener("mousemove", this.moveMagnifier.bind(this));
    /*and also for touch screens:*/
    this.glass.addEventListener("touchmove", this.moveMagnifier.bind(this));
    this.img.addEventListener("touchmove", this.moveMagnifier.bind(this));

  }

  moveMagnifier(e) {
    console.log('e', this.getCursorPos(e))

    /*prevent any other actions that may occur when moving over the image*/
    e.preventDefault();

    /*get the cursor's x and y positions:*/
    // this.getCursorPos(e);
    this.pos = this.getCursorPos(e);
    this.x = this.pos.x;
    this.y = this.pos.y;
    /*prevent the magnifier glass from being positioned outside the image:*/
    if (this.x > this.img.width - (this.w / this.zoom)) { this.x = this.img.width - (this.w / this.zoom); }
    if (this.x < this.w / this.zoom) { this.x = this.w / this.zoom; }
    if (this.y > this.img.height - (this.h / this.zoom)) { this.y = this.img.height - (this.h / this.zoom); }
    if (this.y < this.h / this.zoom) { this.y = this.h / this.zoom; }
    /*set the position of the magnifier glass:*/
    this.glass.style.left = (this.x - this.w) + "px";
    this.glass.style.top = (this.y - this.h) + "px";
    /*display what the magnifier glass "sees":*/
    this.glass.style.backgroundPosition = "-" + ((this.x * this.zoom) - this.w + this.bw) + "px -" + ((this.y * this.zoom) - this.h + this.bw) + "px";
  }
   


  getCursorPos(e) {
    console.log('eeee', e)
    var a, x = 0, y = 0;
    e = e || window.event;

    /*get the x and y positions of the image:*/
    a = this.img.getBoundingClientRect();

    /*calculate the cursor's x and y coordinates, relative to the image:*/
    x = e.pageX - a.left;
    y = e.pageY - a.top;

    /*consider any page scrolling:*/
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    console.log(x, y)
    return { x: x, y: y };
  }
  

  zoomIn()
  {
    this.magnify("myimage", this.zoom);
  }

}
