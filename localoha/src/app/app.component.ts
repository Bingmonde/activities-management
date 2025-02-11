import { AfterContentChecked, AfterContentInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AidesServiceService } from './services/aides-service.service';
import { IAide } from './interfaces/interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterContentChecked{
  title = 'localoha';
  showAide = true;
  currentRouter!: string;
  currentAide!: string;

  constructor(public router: Router){}


  ngAfterContentChecked(): void {
    this.currentRouter = this.router.url;
    this.currentAide = this.findAideForSection(this.currentRouter); 
    this.receiveUrl(this.currentRouter);

    if (this.currentAide.length === 0){
      this.showAide =false;
    }
  }


  receiveShowAide(){
    this.showAide = true;
  }

  receiveHideAide(){
    this.showAide = false;   
  }

  receiveUrl(url: string){
    this.currentRouter = url;
    this.currentAide = this.findAideForSection(this.currentRouter);
   
    if ( !localStorage.getItem(this.currentRouter) ){
      this.showAide = true;
      
    }
    else{
      this.showAide = false;
    }
    
  }

  findAideForSection(url: string): string {
    for(let aide of this.list_aides) {
      if (url === aide.section){
        return aide.content;
      }
    }
    this.showAide = true;
    return '';
    // return 'Votre url n\'est pas correct';
  }

  
    list_aides : IAide [] = [
      {
        section: '/',
        content: $localize`Bienvenu à Localoha!`
      },
      // {
      //   section: '/home',
      //   content: $localize`Bienvenu à home`
      // },
      {
        section: $localize`/creerUtilisateur`,
        content: $localize`Vous pourriez créer un compte!`
      },
      {
        section: $localize`/documentation`,
        content: $localize`Voici nos articles, bonne lecture !`
      },
      {
        section: $localize`/messages`,
        content: $localize`Vous pourriez laisser un message`
      },
      {
        section: $localize`/reunion`,
        content: $localize`Des réunions s'en viennent!`
      }
  
    ];


}
