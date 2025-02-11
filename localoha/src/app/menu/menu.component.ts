import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IAide, IConnexion, IEventCode } from '../interfaces/interface';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  meetingCodeHistory: string[] = [];
  meetingIdHistory: string[] = [];
  actualUser = "montreal1111";

  constructor(public router: Router, private accountServe: AccountService){}

  ngOnInit(): void {
    this.accountServe.connecte$.subscribe({
      next : (data : boolean) => {
        this.loginStatus = data;
      }
    });

    this.accountServe.user$.subscribe({
      next: (data: IConnexion) => {
        this.userActual = data;
      }
    })


    //this.getVisitedMeetings();

    // get local meeting history
    const keys_meetCode = this.getAllKeysWithSubstring("localoha_");
    const keys_meetId = this.getAllKeysWithSubstring("tokenIds_meets");
    
    keys_meetCode.forEach(
      (d)=>{
        this.meetingCodeHistory.push(d.split('_')[1]);
      }
    )
    keys_meetId.forEach(
      (d)=>{
        this.meetingIdHistory.push(d.split('-')[1]);
      }
    )
    console.log(this.meetingCodeHistory, this.meetingIdHistory);
  
    
  }

  @Input()   list_aide_forMenu: IAide[] = [];

  @Output() showAideMenu = new EventEmitter<void>()

  @Output() sendCurrentRouter = new EventEmitter<string>();

  loginStatus: boolean = false;
  userActual! : IConnexion;
  logoutError: string = "";



  showAide(){
    if (this.findAideForSection(this.router.url)){
      this.showAideMenu.emit();
      if (localStorage.getItem(this.router.url)){
        localStorage.removeItem(this.router.url);
      }
    }
  }

  getLink(url:string){
    this.sendCurrentRouter.emit(url);   
  }

  findAideForSection(url: string): boolean {
    for(let aide of this.list_aide_forMenu) {
      if (url === aide.section){
        return true;
      }
    }
    return false;
  }

  logout(){
    setTimeout(()=>{    
      this.accountServe.logout();
      this.loginStatus = false;}, 
      500)
  }


  getAllKeysWithSubstring(substring: string): string[] {
    const keys = Object.keys(localStorage);
    const keysWithSubstring = keys.filter(key => key.includes(substring));
    return keysWithSubstring;
  }

  



}
