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

    var fieldHeight = canvas.height;
    var fieldWidth = canvas.width;

    ctx.strokeStyle = 'black'; // Fill color of rectangle drawn
    ctx.fillStyle = 'green'; // Fill color of rectangle drawn
    ctx.lineWidth = 1;


    let numTree1s = 200;

    var playersX = [Math.floor((Math.random() * 1800) + 50), Math.floor((Math.random() * 1800) + 50), Math.floor((Math.random() * 1800) + 50), Math.floor((Math.random() * 1800) + 50)];
    var playersY = [Math.floor((Math.random() * 750) + 50), Math.floor((Math.random() * 750) + 50), Math.floor((Math.random() * 750) + 50), Math.floor((Math.random() * 750) + 50)];

    var tree1X = [];
    var tree1Y = [];

    for (let i = 0; i < numTree1s; i++) {
      tree1X[i] = [Math.floor((Math.random() * fieldWidth - 100) + 100)];
      tree1Y[i] = [Math.floor((Math.random() * fieldHeight - 100) + 100)];
    }

    function drawPlayer(index) {
      var R = 30;
      ctx.beginPath();
      ctx.arc(playersX[index], playersY[index], R, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.fillStyle = '#ebe6a7';
      ctx.strokeStyle = '#14140e';
      ctx.stroke();
      ctx.fill();
    }

    function drawTree(index) {
      var R = 30;
      ctx.beginPath();
      ctx.arc(tree1X[index], tree1Y[index], R, 0, 2 * Math.PI, false);
      ctx.lineWidth = 3;
      ctx.fillStyle = '#CD853F';
      ctx.strokeStyle = '#A0522D';
      ctx.stroke();
      ctx.fill();
      var RR = 80;
      ctx.beginPath();
      ctx.arc(tree1X[index], tree1Y[index], RR, 0, 2 * Math.PI, false);
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
        ctx.lineWidth = 0.5;
        ctx.moveTo(i, 0);
        ctx.lineTo(i, fieldHeight);
        ctx.stroke();
      }

      for (let i = 0; i < fieldWidth; i += 70) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.moveTo(0, i);
        ctx.lineTo(fieldWidth, i);
        ctx.stroke();

      }

      for (let i = 0; i < 4; i++) {
        drawPlayer(0);
      }

      for (let i = 0; i < numTree1s; i++) {
        drawTree(i);
      }
    }

    setInterval(drawAll, 5);

    //move rectangle inside the canvas using arrow keys
    window.onkeydown = function (event) {
      var keyPr = event.keyCode; //Key code of key pressed

      if (keyPr === 68) {
        playersX[0] = playersX[0] + 8; //right arrow add 20 from current
      }

      else if (keyPr === 68 && 65) {
        playersX[0] = playersX[0] + 8;
        playersY[0] = playersY[0] + 8;
      }

      else if (keyPr === 65) {
        playersX[0] = playersX[0] - 8; //left arrow subtract 20 from current
      }
      else if (keyPr === 87) {
        playersY[0] = playersY[0] - 8; //top arrow subtract 20 from current
      }
      else if (keyPr === 83) {
        playersY[0] = playersY[0] + 8; //bottom arrow add 20 from current
      }
    }
  }

}
