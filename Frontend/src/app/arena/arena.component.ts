import { Component, OnInit } from '@angular/core';
import { Tree } from './Obstacles/Tree';
import { RedTree } from './Obstacles/RedTree';
import { Player } from './Player';
import { Rock } from './Obstacles/Rock';
import { BRock } from './Obstacles/BRock';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { RoundObstacle } from './Obstacles/RoundObstacle';

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

  private trees: Array<Tree>;
  private redtrees: Array<RedTree>;
  private rocks: Array<Rock>;
  private bRocks: Array<BRock>;

  private player: Player;

  private map = {};

  private fieldHeight = 2000; //canvas.height;
  private fieldWidth = 2000; // canvas.width;
  private gridSize = 80;
  private numTree1s = 0;
  private numRedTrees = 0;
  private numRocks = 20;
  private numBRocks = 0;

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
    if (blockingObstacle != null) {
      console.log(
        `Moving to (${newCenterX}, ${newCenterY}) is blocked by tree (${blockingObstacle.x}, ${blockingObstacle.y})`
      );
    } else {
      blockingObstacle = Player.isMoveAllowed(
        newCenterX,
        newCenterY,
        this.rocks
      );
      if (blockingObstacle != null) {
        console.log(
          `Moving to (${newCenterX}, ${newCenterY}) is blocked by rock`
        );
      } else {
        blockingObstacle = Player.isMoveAllowed(
          newCenterX,
          newCenterY,
          this.redtrees
        );
        if (blockingObstacle != null) {
          console.log(
            `Moving to (${newCenterX}, ${newCenterY}) is blocked by redtree`
          );
        } else {
          console.log(
            `Moving from (${this.player.x}, ${this.player.y}) to (${newCenterX}, ${newCenterY})`
          );
          this.player.x = newCenterX;
          this.player.y = newCenterY;
        }
      }
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
      rock.drawRock(this.player.x, this.player.y);
    }

    // for (let i = 0; i < this.bRocks.length; i++) {
    //   let rock = this.bRocks[i];
    //   rock.drawBRock(this.viewX, this.viewY);
    // }

    this.player.drawPlayer();

    // for (let i = 0; i < this.trees.length; i++) {
    //   let tree = this.trees[i];
    //   tree.drawTree(this.viewX, this.viewY);
    // }

    // for (let i = 0; i < this.redtrees.length; i++) {
    //   let tree = this.redtrees[i];
    //   tree.drawTree(this.viewX, this.viewY);
    // }

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

    this.trees = Tree.generateTrees(
      this.ctx,
      this.numTree1s,
      this.fieldWidth,
      this.fieldHeight
    );
    this.redtrees = RedTree.generateTrees(
      this.ctx,
      this.numRedTrees,
      this.fieldWidth,
      this.fieldHeight
    );
    this.rocks = Rock.generateRocks(
      this.ctx,
      this.numRocks,
      this.fieldWidth,
      this.fieldHeight,
      950,
      550
    );
    this.bRocks = BRock.generateBRocks(
      this.ctx,
      this.numBRocks,
      this.fieldWidth,
      this.fieldHeight
    );
    this.player = new Player(this.ctx, 950, 550, 950, 550);

    window.requestAnimationFrame(() => this.drawAll());
  }
}
