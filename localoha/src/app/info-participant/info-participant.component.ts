import { Component, OnInit } from '@angular/core';
import { IParticipantAPI, IParticipantBase } from '../interfaces/interface';
import { MeetingService } from '../services/meeting.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-info-participant',
  templateUrl: './info-participant.component.html',
  styleUrls: ['./info-participant.component.css']
})
export class InfoParticipantComponent implements OnInit {

  constructor(private meetServe: MeetingService,  private dialog: MatDialog){}
  
  ngOnInit(): void {
    this.participant = {
      part_id: 0,
      first_name: "",
      last_name: "",
      email: "",
      telephone: "",
    }
  }

  participant!: IParticipantBase;
  conditionsChecked: boolean = false;


  saveParticipantInfo(){
    console.log(this.participant);
    localStorage.setItem("localohaParticipant", JSON.stringify(this.participant));
    this.meetServe.createParticipant(this.participant).subscribe(
      {
        next: (data: string) => {
          this.participant.part_id = +data;
          console.log("create part");
          localStorage.setItem("localohaParticipant", JSON.stringify(this.participant));
          this.dialog.closeAll();
        },
        error: (err) => {
          console.log("create part error");
          console.log(err);
        },
        complete: ()=>{
          console.log("create part complete");
        }
      }
    );
    
  }

}
