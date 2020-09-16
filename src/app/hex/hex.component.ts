import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Square } from './Square';

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
  private squares = new Array();
  counter = 0;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    /* setInterval(() => {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.squares.forEach((square: Square) => {
        square.moveRight();
      });
    }, 10);
    */
    this.animate();
  }

  addSquare(): void {
    this.squares.push(new Square(this.ctx));
  }

  protected animate() {
    console.log("render called");

    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.font = 'italic bold 48px serif';
    this.ctx.textBaseline = 'hanging';
    this.ctx.strokeText('Hello world', 0, 100);

    this.squares.forEach((square: Square) => {
      square.moveRight();
    });
  }
}
