import { Component, OnInit } from '@angular/core';
import { IMessage, IMessageRecu } from '../interfaces/interface';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  forUser: string = "";
  newMessage!: IMessage;
  messageSaved!: boolean;
  messageError: string = "";


  constructor(private router: Router, private accountService: AccountService){}
  ngOnInit(): void {
    this.messageSaved = false;
    this.newMessage = {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      message: ""
    }
    this.messageError = "";
  }

  saveMessage(){
    console.log(this.newMessage);
    console.log(this.forUser);
    
    this.accountService.saveMessage(this.forUser, this.newMessage).subscribe(
      {
        next: (data) => {
          console.log("save message");
          console.log(data);  
          this.messageSaved = data.data;
        },
        error: (err) => {
          console.log("save message error");
          console.log(err);
          this.messageError = err.error.message;
        },
        complete: ()=>{
          console.log("save message complete");
        }
      }
    )
  }



}
