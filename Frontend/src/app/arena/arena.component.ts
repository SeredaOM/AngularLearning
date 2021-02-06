import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {

  constructor() { }




  ngOnInit(): void {


    var canvas = <HTMLCanvasElement>document.getElementById('cnv'); // Get the canvas element by Id
    var ctx = canvas.getContext('2d'); // Canvas 2d rendering context

    var fieldHeight = 4000;//canvas.height;
    var fieldWidth = 4000;// canvas.width;

    var centerX: number = 0;
    var centerY: number = 0;

    ctx.strokeStyle = 'black'; // Fill color of rectangle drawn
    ctx.fillStyle = 'green'; // Fill color of rectangle drawn
    ctx.lineWidth = 1;


    let numTree1s = 200;

    var playersX = canvas.width / 2;
    var playersY = canvas.height / 2;

    var tree1X: Array<number> = [];
    var tree1Y: Array<number> = [];

    for (let i = 0; i < numTree1s; i++) {
      tree1X[i] = Math.floor((Math.random() * (fieldWidth - 200)) + 100);
      tree1Y[i] = Math.floor((Math.random() * (fieldHeight - 200)) + 100);
    }

    function drawPlayer() {
      var R = 30;
      ctx.beginPath();
      ctx.arc(playersX, playersY, R, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.fillStyle = '#ebe6a7';
      ctx.strokeStyle = '#14140e';
      ctx.stroke();
      ctx.fill();
    }

    function drawTree(index) {
      var R = 30;
      ctx.beginPath();
      ctx.arc(centerX + tree1X[index], centerY + tree1Y[index], R, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.fillStyle = '#CD853F';
      ctx.strokeStyle = '#A0522D';
      ctx.stroke();
      ctx.fill();

      var RR = 80;
      ctx.beginPath();
      ctx.arc(centerX + tree1X[index], centerY + tree1Y[index], RR, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#8080A97D';
      ctx.strokeStyle = '#8084c586';
      ctx.stroke();
      ctx.fill();

    }

    function drawAll() {
      ctx.fillStyle = "lime";
      ctx.fillRect(0, 0, canvas.width, fieldHeight);

      for (let i = 0; i < fieldWidth; i += 70) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(centerX + i, 0);
        ctx.lineTo(centerX + i, + fieldHeight);
        ctx.stroke();
      }
      for (let i = 0; i < fieldWidth; i += 70) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(0, i + centerY);
        ctx.lineTo(fieldWidth, i + centerY);
        ctx.stroke();

      }

      drawPlayer();


      for (let i = 0; i < numTree1s; i++)
        drawTree(i);
    }

    setInterval(drawAll, 5);
    var map = {};
    onkeydown = onkeyup = function (e) {
      map[e.code] = e.type == 'keydown';
      /* insert conditional here */
      if (map['KeyA']) {
        centerX = centerX + 8; //right arrow add 20 from current
        if (map['KeyW'] || map['KeyS']) {
          centerX = centerX - 2;
        }
      }

      if (map['KeyD']) {
        centerX = centerX - 8; //left arrow subtract 20 from current
        if (map['KeyW'] || map['KeyS']) {
          centerX = centerX + 2;
        }
      }

      if (map['KeyW']) {
        centerY = centerY + 8; //bottom arrow add 20 from current
        if (map['KeyA'] || map['KeyD']) {
          centerY = centerY - 2;
        }
      }

      if (map['KeyS']) {
        centerY = centerY - 8; //top arrow subtract 20 from current
        if (map['KeyA'] || map['KeyD']) {
          centerY = centerY + 2;
        }
      }
    }
  }
}
