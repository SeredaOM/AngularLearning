import { Component, OnInit } from '@angular/core';
import { Tree } from './Obstacles/Tree';
import { Player } from './Player';
import { Rock } from './Obstacles/Rock';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit {

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private trees: Array<Tree>;
  private rocks: Array<Rock>;
  private player: Player;

  private map = {};
  private centerX: number = 0;
  private centerY: number = 0;


  private fieldHeight = 4000;//canvas.height;
  private fieldWidth = 4000;// canvas.width;

  private numTree1s = 200;
  private numRocks = 50;

  constructor() { }

  private move(code, keyAction) {
    console.log(`moved: code=${code}`);

    this.map[code] = keyAction == 'keydown';

    let newCenterX: number = this.centerX;
    let newCenterY: number = this.centerY;

    if (this.map['KeyA']) {
      newCenterX = this.centerX + 8; //right arrow add 20 from current
      if (this.map['KeyW'] || this.map['KeyS']) {
        newCenterX = newCenterX - 2;
      }
    }

    if (this.map['KeyD']) {
      newCenterX = this.centerX - 8; //left arrow subtract 20 from current
      if (this.map['KeyW'] || this.map['KeyS']) {
        newCenterX = newCenterX + 2;
      }
    }

    if (this.map['KeyW']) {
      newCenterY = this.centerY + 8; //bottom arrow add 20 from current
      if (this.map['KeyA'] || this.map['KeyD']) {
        newCenterY = newCenterY - 2;
      }
    }

    if (this.map['KeyS']) {
      newCenterY = this.centerY - 8; //top arrow subtract 20 from current
      if (this.map['KeyA'] || this.map['KeyD']) {
        newCenterY = newCenterY + 2;
      }
    }

    //console.log(`newCenterX = ${newCenterX},newCenterY = ${newCenterY} `);

    let moveIsAllowed = true;

    moveIsAllowed = this.player.isMoveAllowed(newCenterX, newCenterY, this.trees);
    if (moveIsAllowed) {
      moveIsAllowed = this.player.isMoveAllowed(newCenterX, newCenterY, this.rocks);
    }
    if (moveIsAllowed) {
      this.centerX = newCenterX;
      this.centerY = newCenterY;
    }
  }

  // Keyboard input with customisable repeat (set to 0 for no key repeat)
  private KeyboardController(keys, repeat) {
    //  https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript

    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function (event) {
      //console.log(`'onkeydown' was called:`);
      //console.log(event);

      var key = event.code;
      if (!(key in keys)) {
        console.log('key is not in keys');
        return true;
      }

      if (!(key in timers)) {
        console.log('key is not in timers');

        timers[key] = null;
        keys[key]('keydown');
        if (repeat !== 0)
          timers[key] = setInterval(() => keys[key]('keydown'), repeat);
      }

      return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function (event) {
      //console.log(`'onkeyup' was called, event:`);
      //console.log(event);

      var key = event.code;
      if (key in timers) {
        if (timers[key] !== null)
          clearInterval(timers[key]);
        delete timers[key];
      }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    /*  window.onblur = function () {
        for (key in timers)
          if (timers[key] !== null)
            clearInterval(timers[key]);
        timers = {};
      };*/
    console.log(`Controller was called`);
  };

  private drawAll() {
    this.ctx.fillStyle = "lime";
    this.ctx.fillRect(0, 0, this.canvas.width, this.fieldHeight);

    for (let i = 0; i < this.fieldWidth; i += 70) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(this.centerX + i, 0);
      this.ctx.lineTo(this.centerX + i, + this.fieldHeight);
      this.ctx.stroke();
    }
    for (let i = 0; i < this.fieldWidth; i += 70) {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(0, i + this.centerY);
      this.ctx.lineTo(this.fieldWidth, i + this.centerY);
      this.ctx.stroke();
    }

    for (let i = 0; i < this.numRocks; i++) {
      this.rocks[i].drawRock(this.centerX, this.centerY);
    }

    this.player.drawPlayer();

    for (let i = 0; i < this.numTree1s; i++) {
      this.trees[i].drawTree(this.centerX, this.centerY);
    }

  }

  ngOnInit(): void {
    let _this = this;
    this.KeyboardController({
      KeyA: function (keyAction) { _this.move('KeyA', keyAction); },
      KeyS: function (keyAction) { _this.move('KeyS', keyAction); },
      KeyD: function (keyAction) { _this.move('KeyD', keyAction); },
      KeyW: function (keyAction) { _this.move('KeyW', keyAction); }
    }, 200);

    this.canvas = <HTMLCanvasElement>document.getElementById('cnv'); // Get the canvas element by Id
    this.ctx = this.canvas.getContext('2d'); // Canvas 2d rendering context

    this.ctx.strokeStyle = 'black'; // Fill color of rectangle drawn
    this.ctx.fillStyle = 'green'; // Fill color of rectangle drawn
    this.ctx.lineWidth = 1;

    this.trees = Tree.generateTrees(this.ctx, this.numTree1s, this.fieldWidth, this.fieldHeight);
    this.rocks = Rock.generateRocks(this.ctx, this.numRocks, this.fieldWidth, this.fieldHeight);
    this.player = new Player(this.ctx, 950, 480);

    setInterval(() => this.drawAll(), 50);
  }
}
