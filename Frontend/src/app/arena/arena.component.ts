import { Component, OnInit } from '@angular/core';
import { Tree } from './Tree';
import { Player } from './Player';

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

    var trees: Array<Tree> = Tree.generateTrees(ctx, numTree1s, fieldWidth, fieldHeight);
    var player = new Player(ctx, canvas.width / 2, canvas.height / 2);

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

      player.drawPlayer();

      for (let i = 0; i < numTree1s; i++)
        trees[i].drawTree(centerX, centerY);
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
