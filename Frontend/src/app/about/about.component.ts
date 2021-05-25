import { Component, OnInit } from '@angular/core';
import { version } from '../../../package.json';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor(    private apiService: ApiService) {}

  public appVersion = version;
  public webApiVersion='';
  public webApiDotNetVersion='';

  ngOnInit(): void {
    this.apiService.getVersion().subscribe((response: string) => {
      console.log(response);
      this.webApiVersion=response['item1'];
      let rv2 = response['item2'];
      this.webApiDotNetVersion=`${rv2['major']}.${rv2['minor']}.${rv2['build']}`;
    });
  }
}
