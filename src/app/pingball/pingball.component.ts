import { Component, OnInit } from '@angular/core';

function ownJS() {
  console.log("Hello from pingball.component.ts: " + document.getElementById('p1').innerHTML);

  var canvas = <HTMLCanvasElement>document.getElementById('cnv'); // Get the canvas element by Id
  var ctx = canvas.getContext('2d'); // Canvas 2d rendering context

  var fieldHeight = canvas.height;
  var fieldWidth = canvas.width;

  var x = 10; //intial horizontal position of drawn rectangle
  var y = 10; //intial vertical position of drawn rectangle
  var wid = 20; //width of the drawn rectangle
  var hei = 20; //height of the drawn rectangle

  //Draw Rectangle function		
  function drawRect(x, y, w, h) {
    ctx.fillStyle = '#999'; // Fill color of rectangle drawn
    ctx.fillStyle = 'green'; // Fill color of rectangle drawn
    ctx.fillRect(x, y, w, h); //This will draw a rectangle of 20x20

  }

  function moveRect() {
    ctx.clearRect(0, 0, fieldWidth, fieldHeight);

    if (x < fieldWidth / 2) {
      x += 1;
    }
    if (x >= fieldWidth / 2) {
      if (y < fieldHeight / 2) {
        y += 0.1;
      }
    }

    drawRect(x, y, wid, hei); //Drawing rectangle on initial load
  }

  setInterval(moveRect, 10);

  /* //move rectangle inside the canvas using arrow keys
   window.onkeydown = function (event) {
     var keyPr = event.keyCode; //Key code of key pressed
 
     if (keyPr === 39 && x <= 460) {
       x = x + 20; //right arrow add 20 from current
     }
     else if (keyPr === 37 && x > 10) {
       x = x - 20; //left arrow subtract 20 from current
     }
     else if (keyPr === 38 && y > 10) {
       y = y - 20; //top arrow subtract 20 from current
     }
     else if (keyPr === 40 && y <= 460) {
       y = y + 20; //bottom arrow add 20 from current
     }
 
     //  clearing anything drawn on canvas comment this below do draw path
     ctx.clearRect(0, 0, 500, 500);
 
     //Drawing rectangle at new position
     drawRect(x, y, wid, hei);
   };*/
}

import './pingball.js';
import '../../assets/custom.js';

//let pingballJsTest2: any;
declare const pingball_Test2: any;

@Component({
  selector: 'app-pingball',
  templateUrl: './pingball.component.html',
  styleUrls: ['./pingball.component.css']
})
export class PingballComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    ownJS();
    pingball_Test2();
    /*initMethod();
    helloPB();*/
  }

}
