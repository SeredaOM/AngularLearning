import { Component, OnInit } from '@angular/core';
import { Tree } from './Obstacles/Tree';
import { RedTree } from './Obstacles/RedTree';
import { Player } from './Player';
import { BRock, NormalRock } from './Obstacles/BRock';
import { RoundObstacle } from './Obstacles/RoundObstacle';
import { ViewScreen } from './Obstacles/ViewScreen';

@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css'],
})
export class ArenaComponent implements OnInit {
  private canvasVisible: HTMLCanvasElement;
  private ctxVisible: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private trees: Array<RoundObstacle>;
  private redtrees: Array<RoundObstacle>;
  private rocks: Array<RoundObstacle>;
  private bRocks: Array<RoundObstacle>;

  private player: Player;

  private map = {};

  private fieldHeight = 10000; //canvas.height;
  private fieldWidth = 10000; // canvas.width;
  private gridSize = 80;
  private numTree1s = 500;
  private numRedTrees = 500;
  private numRocks = 200;
  private numBRocks = 50;

  constructor() {}

  private move(code, keyAction) {
    this.map[code] = keyAction == 'keydown';

    let newCenterX: number = this.player.x;
    let newCenterY: number = this.player.y;

    if (this.map['KeyA']) {
      newCenterX = newCenterX - 5; //Move Left
      if (this.map['KeyW'] || this.map['KeyS']) {
        newCenterX = newCenterX + 3;
      }
    }

    if (this.map['KeyD']) {
      newCenterX = newCenterX + 5; //Move Right
      if (this.map['KeyW'] || this.map['KeyS']) {
        newCenterX = newCenterX - 3;
      }
    }

    if (this.map['KeyW']) {
      newCenterY = newCenterY - 5; //Move Up
      if (this.map['KeyA'] || this.map['KeyD']) {
        newCenterY = newCenterY + 3;
      }
    }

    if (this.map['KeyS']) {
      newCenterY = newCenterY + 5; //Move Down
      if (this.map['KeyA'] || this.map['KeyD']) {
        newCenterY = newCenterY - 3;
      }
    }

    //console.log(`newCenterX = ${newCenterX},newCenterY = ${newCenterY} `);

    let blockingObstacle: RoundObstacle = null;

    blockingObstacle = Player.isMoveAllowed(newCenterX, newCenterY, this.trees);
    if (blockingObstacle == null) {
      blockingObstacle = Player.isMoveAllowed(
        newCenterX,
        newCenterY,
        this.redtrees
      );
    }
    if (blockingObstacle == null) {
      blockingObstacle = Player.isMoveAllowed(
        newCenterX,
        newCenterY,
        this.rocks
      );
    }

    if (blockingObstacle == null) {
      blockingObstacle = Player.isMoveAllowed(
        newCenterX,
        newCenterY,
        this.bRocks
      );
    }

    if (blockingObstacle == null) {
      this.player.x = newCenterX;
      this.player.y = newCenterY;
    }
  }

  // Keyboard input with customisable repeat (set to 0 for no key repeat)
  private KeyboardController(keys, repeat) {
    //  https://stackoverflow.com/questions/3691461/remove-key-press-delay-in-javascript

    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers = {};
    let _this = this;

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function (event) {
      var key = event.code;
      if (!(key in keys)) {
        return true;
      }

      if (!(key in timers)) {
        console.log('key is not in timers');

        timers[key] = null;
        keys[key]('keydown');
        if (repeat !== 0) {
          timers[key] = setInterval(() => keys[key]('keydown'), repeat);
        }
      }

      return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function (event) {
      _this.map[event.code] = false;

      var key = event.code;
      if (key in timers) {
        if (timers[key] !== null) {
          clearInterval(timers[key]);
        }
        delete timers[key];
      }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys

    window.onblur = function () {
      _this.map = {};

      for (let key in timers)
        if (timers[key] !== null) {
          clearInterval(timers[key]);
        }
      timers = {};
    };
  }

  private drawAll() {
    this.ctx.fillStyle = 'lime';
    this.ctx.fillRect(0, 0, this.canvas.width, this.fieldHeight);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#a6a5a2';
    for (let i = 0; i < this.fieldWidth; i += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
      this.ctx.stroke();
    }
    for (let i = 0; i < this.fieldHeight; i += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
      this.ctx.stroke();
    }

    for (let i = 0; i < this.rocks.length; i++) {
      let rock = this.rocks[i];
      rock.draw(this.player.x, this.player.y);
    }

    for (let i = 0; i < this.bRocks.length; i++) {
      let rock = this.bRocks[i];
      rock.draw(this.player.x, this.player.y);
    }

    this.player.drawPlayer();

    for (let i = 0; i < this.trees.length; i++) {
      let tree = this.trees[i];
      tree.draw(this.player.x, this.player.y);
    }

    for (let i = 0; i < this.redtrees.length; i++) {
      let tree = this.redtrees[i];
      tree.draw(this.player.x, this.player.y);
    }

    this.ctxVisible.drawImage(this.canvas, 0, 0);
    window.requestAnimationFrame(() => this.drawAll());
  }

  ngOnInit(): void {
    let _this = this;
    this.KeyboardController(
      {
        KeyA: function (keyAction) {
          _this.move('KeyA', keyAction);
        },
        KeyS: function (keyAction) {
          _this.move('KeyS', keyAction);
        },
        KeyD: function (keyAction) {
          _this.move('KeyD', keyAction);
        },
        KeyW: function (keyAction) {
          _this.move('KeyW', keyAction);
        },
      },
      25
    );

    this.canvasVisible = <HTMLCanvasElement>document.getElementById('cnv'); // Get the canvas element by Id
    this.ctxVisible = this.canvasVisible.getContext('2d'); // Canvas 2d rendering context

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvasVisible.width;
    this.canvas.height = this.canvasVisible.height;

    this.ctx = this.canvas.getContext('2d'); // Canvas 2d rendering context
    this.ctx.font = '30px Georgia';

    this.ctx.strokeStyle = 'black'; // Fill color of rectangle drawn
    this.ctx.fillStyle = 'green'; // Fill color of rectangle drawn
    this.ctx.lineWidth = 1;

    ViewScreen.centerX = 950;
    ViewScreen.centerY = 550;

    this.trees = this.generateObjects(
      this.numTree1s,
      (ctx: CanvasRenderingContext2D, x: number, y: number, name: string) =>
        new Tree(ctx, x, y)
    );
    this.redtrees = this.generateObjects(
      this.numRedTrees,
      (ctx: CanvasRenderingContext2D, x: number, y: number, name: string) =>
        new RedTree(ctx, x, y)
    );
    this.rocks = this.generateObjects(
      this.numRocks,
      (ctx: CanvasRenderingContext2D, x: number, y: number, name: string) =>
        new NormalRock(ctx, x, y, name)
    );
    this.bRocks = this.generateObjects(
      this.numBRocks,
      (ctx: CanvasRenderingContext2D, x: number, y: number, name: string) =>
        new BRock(ctx, x, y, name)
    );

    this.player = new Player(this.ctx, 950, 950);

    window.requestAnimationFrame(() => this.drawAll());
  }

  private generateObjects(
    obstaclesCount: number,
    createObstacle: (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      i: string
    ) => RoundObstacle
  ): Array<RoundObstacle> {
    let obstacles: Array<RoundObstacle> = [];

    for (let i = 0; i < obstaclesCount; i++) {
      let x = Math.floor(Math.random() * (this.fieldWidth - 200) + 100);
      let y = Math.floor(Math.random() * (this.fieldHeight - 200) + 100);

      obstacles.push(createObstacle(this.ctx, x, y, i.toString()));
    }
    return obstacles;
  }
}
