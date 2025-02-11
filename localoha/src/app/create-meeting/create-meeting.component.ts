import { Component, OnInit } from '@angular/core';
import {NgIf, JsonPipe} from '@angular/common';
import { AccountService } from '../services/account.service';
import { IConnexion, IDate, IEvent, IEventToken, IOrganizer } from '../interfaces/interface';
import {FormControl, FormGroup, FormsModule, NgForm} from '@angular/forms';
import { MeetingService } from '../services/meeting.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {


  constructor(private accountServe: AccountService, private meetServe : MeetingService, private router: Router){}

  ngOnInit(): void {
    this.resetAll();

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
  }

  loginStatus: boolean = false;
  userActual! : IConnexion;
  username: string = 'montreal1111';

  meeting!: IEvent;

  showAdd: boolean = false;
  showCustomedDate: boolean = false;
  //errorInfo:string = "";
  fromDate: string = "";
  toDate: string = "";
  dateSelected!: Date;
  dateNull: Date = new Date(0)
  duration: string = "0";
  dates!: IDate[]; 
  
  dateLimite!:Date;


  selectDate(){
    this.getNowTime();
    this.showAdd = true;
    this.dateSelected = this.dateNull;
    this.duration = "0";
  }

  addDate(){
    const oneDate: IDate = {
      date_id: 0,
      d_start: this.dateNull,
      d_end: this.dateNull,
    };
    
    oneDate.d_start = new Date(this.dateSelected);
    oneDate.d_end = new Date(this.dateSelected);    
    //console.log(typeof oneDate.start);
    
    
    oneDate.d_end.setMinutes(oneDate.d_end.getMinutes() + parseInt(this.duration, 10));    
    this.dates.push(oneDate);
    this.dates.sort((a, b) => a.d_start.valueOf() - b.d_start.valueOf());
    //console.log(this.dates);
    this.showAdd = false;
  }


  getNowTime(){
    if (this.fromDate == ""){
      let now = new Date();
      now.setHours(now.getHours() + 24); // la date doit etre au moins 24 heures avant la reunion
      //console.log(now);
      
      let minutes = now.getMinutes() < 10 ? "0"+now.getMinutes() : now.getMinutes()+"";
      this.fromDate = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+"T"+now.getHours()+":"+ minutes;
    }
    if (this.dates.length !== 0 ){
      let limite = new Date(this.dates[this.dates.length - 1].d_start);   
      let minutes = limite.getMinutes() < 10 ? "0"+limite.getMinutes() : limite.getMinutes()+"";
      this.toDate = limite.getFullYear()+"-"+(limite.getMonth()+1)+"-"+limite.getDate()+"T"+limite.getHours()+":"+ minutes;
    }
    //console.log("from date", this.fromDate);
    //console.log("to date", this.toDate);
    
  }

  deleteDate(index: number){
    this.dates.splice(index, 1);
  }

  resetAll(){
    this.meeting = {
      title: "",
      describe: "",
      location: "",
      dates: [],
      deadline: this.dateNull // in hours
    }
    this.dateLimite = this.dateNull;
    this.fromDate = "";
    this.toDate ="";
    this.dates = [];
  }

  saveMeeting(){
    const aDeadline = new Date (this.dateLimite);
    this.meeting.deadline = aDeadline;    
    this.meeting.dates = this.dates;
    //using put  + path variable
    // const organizer : IOrganizer = {
    //   username: this.userActual.username,
    //   events: []
    // }
    // organizer.events.push(this.meeting);
    // let dateJson=  JSON.stringify(this.dates);
    // this.meeting.dates = dateJson;    
    console.log(this.meeting);
    this.meetServe.createMeeting(this.meeting).subscribe(
      {
        next: (data) => {
          console.log("create meeting");
          console.log(data);
          let event_tokenId = {id: data.id, token: data.token};
          console.log(event_tokenId);
          this.saveTokenToLocal(event_tokenId);
          setTimeout(() => {
            this.router.navigate([`/reunion/${this.username}/${event_tokenId.id}`]);
          }, 1000);
        },
        error: (err) => {
          console.log("creat meeting error");
          console.log(err);
        },
        complete: ()=>{
          console.log("create meeting complete");
        }
      }
    );

    this.resetAll();
    
  }

  saveTokenToLocal(oneTokenId: IEventToken){
    let token_key = 'tokenIds_meets-' + oneTokenId.id
    localStorage.setItem(token_key, oneTokenId.token)
    
    // another way to save token
    // let token_ids = localStorage.getItem('tokenIds_meets');
    // console.log("get token",token_ids);
    // if (!token_ids){
    //   let tokenArray = [];
    //   tokenArray.push(oneTokenId);
    //   localStorage.setItem('tokenIds_meets', JSON.stringify(tokenArray))
    // }
    // else{
    //   // let newTokenArray = [];
    //   // newTokenArray = JSON.parse(token_ids);
    //   // console.log("parsed new token",newTokenArray);
    //   // newTokenArray.push(token_ids);
    //   // console.log("after push to new array",newTokenArray);
    //   // localStorage.setItem('tokenIds_meets', JSON.stringify(newTokenArray));
    //   // console.log("after save", localStorage.getItem('tokenIds_meets'));

    //   let some = JSON.parse(token_ids);
    //   some.push(oneTokenId);
    //   localStorage.setItem('tokenIds_meets', JSON.stringify(some))
    //   console.log("after", localStorage.getItem('tokenIds_meets') );
    //   }
  }

  // testToken(){
  //   let token1 = {
  //     id: 3,
  //     token: "e93542f4031b9119d0c77c905348ab78015ddf9126f4b871ed19a80739877c37"
  //   }
  //   this.saveTokenToLocal(token1);
        
  // }





  

}
