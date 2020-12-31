import { Component, OnInit } from '@angular/core';

function ownJS() {
  console.log(
    'Hello from pingball.component.ts: ' +
      document.getElementById('p1').innerHTML
  );

  var canvas = <HTMLCanvasElement>document.getElementById('cnv'); // Get the canvas element by Id
  var ctx = canvas.getContext('2d'); // Canvas 2d rendering context

  var fieldHeight = canvas.height;
  var fieldWidth = canvas.width;

  const pi = 3.1415926;
  const border = 10;
  const cX = 400;
  const cY = 400;
  const width = 200;
  const height = width;
  const step = 10;
  const ds = 0.1;
  var zMap = new Map(); //Array(2 * width + 1);

  ctx.strokeStyle = 'black'; // Fill color of rectangle drawn
  ctx.fillStyle = 'green'; // Fill color of rectangle drawn
  ctx.lineWidth = 1;

  var x = 10; //intial horizontal position of drawn rectangle
  var y = 10; //intial vertical position of drawn rectangle
  var wid = 20; //width of the drawn rectangle
  var hei = 20; //height of the drawn rectangle

  var t2 = new Map();
  console.log(t2[2] === undefined ? 'undefined' : 'no');

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

  function drawPixel(x: number, y: number) {
    ctx.fillRect(cX + x, cY - y, 1, 1);
  }

  function drawPixel3d(x3, y3, z3) {
    let x2 = (x3 + y3) * Math.sin((60 * pi) / 180);
    let y2 = z3 - ((x3 - y3) * Math.sin((30 * pi) / 180)) / 4;

    //console.log(`(${x},${y3},${z3})=>(${x2},${y2})`);

    let visible = false;

    let n = Math.round(x2);
    if (zMap[n] === undefined) {
      zMap[n] = z3;
      visible = true;
    } else {
      if (z3 > zMap[n]) {
        visible = z3 > zMap[n];
        zMap[n] = z3;
      }
    }

    // let nx = Math.round(x2);
    // let ny = Math.round(y2);
    
    // if (zMap[nx] === undefined) {
    //   console.log(`New nx=${nx}`);
    //   zMap[nx] = new Map();
    //   zMap[nx][ny] = true;
    //   visible = true;
    // } else {
    //   //console.log(`Existing nx=${nx}`);
    //   if (zMap[nx][ny] === undefined) {
    //     //console.log(`New ny=${ny}`);
    //     zMap[nx][ny] = true;
    //     visible = true;
    //     // console.log(`Draw nx=${nx}, ny=${ny}?`);
    //   } else {
    //     //console.log(`Existing ny=${ny}`);
    //     visible = false;
    //     //console.log('Ever visible?');
    //   }
    // }

    if (visible)
    drawPixel(x2, y2);
  }

  function myFunc(x, y) {
    let x2 = x * x;
    let y2 = y * y;
    let zHyperbola4 = ((x2 * x2 + y2 * y2) / 1200 - (x2 + y2) * 10) / height;
    let zHyperbola3 =
      ((x2 * x + y2 * y) / 1200 + 0.5 * (x2 + y2) + 10 * (x + y)) / height;
    let zHyperbola2 = (x2 + y2) / 2 / height;
    let zRipple =
      Math.pow(2, -0.005 * (Math.abs(x) + Math.abs(y))) *
      Math.cos(((x * x + y * y) * 2 * pi) / 180 / width) *
      height *
      1;

    //return zHyperbola3;
    return zRipple;
  }

  function drawGrid() {
    ctx.strokeRect(
      cX - 2 * width - border,
      cY - 2 * height - border,
      2 * (2 * width + border),
      2 * (2 * height + border)
    );

    ctx.beginPath();
    ctx.moveTo(cX - width * Math.sin(30), cY - height * Math.sin(60));
    ctx.lineTo(cX + width * Math.sin(30), cY + height * Math.sin(60));
    ctx.moveTo(cX + width * Math.sin(30), cY - height * Math.sin(60));
    ctx.lineTo(cX - width * Math.sin(30), cY + height * Math.sin(60));

    ctx.moveTo(cX - 2 * width * Math.sin(30), cY);
    ctx.lineTo(cX, cY - 2 * height * Math.sin(60));
    ctx.lineTo(cX + 2 * width * Math.sin(30), cY);
    ctx.lineTo(cX, cY + 2 * height * Math.sin(60));
    ctx.lineTo(cX - 2 * width * Math.sin(30), cY);

    ctx.stroke();

    //for (let x3 = -width; x3 <= width; x3 += step) {
    for (let x3 = width; x3 >= -width; x3 -= step) {
      //console.log(`New Line: (${x3})`);
      for (let y3 = -height; y3 <= height; y3 += step) {
        //for (let y3 = 1 * height; y3 >= 1 * height - 20 * step; y3 -= step) {
        //console.log(`New Point: (${x3}, ${y3})`);
        for (let s = 0; s < step; s += ds) {
          let x = x3 + s;
          if (x < width) {
            let z3 = myFunc(x, y3);
            drawPixel3d(x, y3, z3);
          }
        }

        for (let s = 0; s < step; s += ds) {
          let y = y3 + s;
          if (y < height) {
            let z3 = myFunc(x3, y);
            drawPixel3d(x3, y, z3);
          }
        }
      }
    }
  }

  drawGrid(); //setInterval(drawGrid, 10);
  //setInterval(moveRect, 10);

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
  styleUrls: ['./pingball.component.css'],
})
export class PingballComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    ownJS();
    pingball_Test2();
    /*initMethod();
    helloPB();*/
  }
}
