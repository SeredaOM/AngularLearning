import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Hex } from './hex';
import { Map } from './map';
import { Tile } from './tile';

@Component({
  selector: 'app-hex',
  templateUrl: './hex.component.html',
  styleUrls: ['./hex.component.css']
})

export class HexComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  constructor() { }

  private ctx: CanvasRenderingContext2D;
  private map: Map;

  private squares = new Array();
  counter = 0;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.map = new Map(this.ctx);

    this.animate();
  }

  addHex(): void {
    this.squares.push(new Hex(this.ctx));
  }

  protected animate() {
    console.log("render called");

    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.font = 'italic bold 48px serif';
    this.ctx.textBaseline = 'hanging';
    this.ctx.strokeText('Hello world', 0, 100);

    this.squares.forEach((hex: Hex) => {
      hex.moveRight();
    });

    this.map.drawHex(10, 10, 10, "red", "blue", 2);
    var tile = new Tile(0, 0, "water", "");
    this.map.drawTile(tile);
    var tile = new Tile(2, 0, "water", "fish");
    this.map.drawTile(tile);
  }
}
