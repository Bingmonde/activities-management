import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../services/meeting.service';
import { IConnexion, IEventBase, IEventBref, IEventBrefAPI } from '../interfaces/interface';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-all-meetings',
  templateUrl: './all-meetings.component.html',
  styleUrls: ['./all-meetings.component.css']
})
export class AllMeetingsComponent  {

  // constructor(private accountServe: AccountService, private meetServe: MeetingService){}

  // ngOnInit(): void {
  //   this.accountServe.connecte$.subscribe({
  //     next : (data : boolean) => {
  //       this.loginStatus = data;
  //     }
  //   });

  //   this.accountServe.user$.subscribe({
  //     next: (data: IConnexion) => {
  //       this.userActual = data;
  //     }
  //   })
  //   this.getAllMeeting();


  // }

  // loginStatus: boolean = false;
  // userActual! : IConnexion;
  // allMeetings: IEventBref[] = [];
  // meetingsAPI:IEventBrefAPI[] = [];
  // testMeetings!: any;


  // getAllMeeting(){
  //   this.meetServe.getMeetingForCreator().subscribe(
  //     {
  //       next: (data) => {
  //         console.log("get all meeting");
  //         console.log(data);
  //         //this.allMeetings = data;
  //         this.testMeetings = data
          
  //         console.log(typeof data[0].meeting_id);          
  //         // for(let i=0;i<data.length;i++){
  //         //   let meet: IEventBref = {
  //         //     meeting_id: data[i].meeting_id,
  //         //     title: data[i].title,
  //         //     location: data[i].location,
  //         //     deadline: new Date(data[i].deadline.value)
  //         //   }
  //         //   this.allMeetings.push(meet);
  //         // }
  //         // console.log(this.allMeetings);
          
      
  //       },
  //       error: (err) => {
  //         console.log("get meeting by id error");
  //         console.log(err);
  //       },
  //       complete: ()=>{
  //         console.log("get meeting by id complete");
  //       }
  //     }
  //   );
  // }

}
