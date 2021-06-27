import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


  constructor() {


    let Range = function () {
      var numbers = /*Insert The Numbers Here --->*/[177, 444, 223, 523, 124, 220]
      var a = 0;
      var b = 100000;
      for (var i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] > a) {
          a = numbers[i];
        }
      }
      for (var j = 0; j < numbers.length - 1; j++) {
        if (numbers[j] < b) {
          b = numbers[j];
        }
      }

      var range = a - b;
      console.log(range);
    }
    Range();
  }


  // var a = 0;

  // if (numbers[0] > a) {
  //   a = numbers[0];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[1] > a) {
  //   a = numbers[1];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[2] > a) {
  //   a = numbers[2];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[3] > a) {
  //   a = numbers[3];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[4] > a) {
  //   a = numbers[4];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[5] > a) {
  //   a = numbers[5];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[6] > a) {
  //   a = numbers[6];
  // }
  // else {
  //   a = a
  // }
  // if (numbers[7] > a) {
  //   a = numbers[7];
  // }
  // else {
  //   a = a
  // }



  ngOnInit(): void {
  }

}
