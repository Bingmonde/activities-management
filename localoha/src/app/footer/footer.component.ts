import { Component } from '@angular/core';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger} from '@angular/cdk/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItem]
})
export class FooterComponent {

  constructor(private router :Router){}

  selectLang(lang : string){
    switch(lang){
      case 'fr':
        window.location.href = 'https://bingwebtp2.web.app/fr-CA/';
        break;
      case 'en':
        window.location.href = 'https://bingwebtp2.web.app/en-CA/';
        break;
      case 'zh':
        window.location.href = 'https://bingwebtp2.web.app/zh-CN/';
        break;
      default:
        window.location.href = 'https://bingwebtp2.web.app/fr-CA/';
    }

  }

}
