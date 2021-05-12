import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

//import { version } from '../../../package.json';
//import { version2 } from '../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  public production = environment.production;
  public version = environment.version;

  constructor() {}

  ngOnInit(): void {}
}
