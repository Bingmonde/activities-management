import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { IMessageRecu } from '../interfaces/interface';

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.css']
})
export class MyMessagesComponent implements OnInit {

  messagesRecu: IMessageRecu[] = [];
  messageError: string = "";
  loginStatus: boolean = false;

  constructor(private accountServe: AccountService){
    this.accountServe.connecte$.subscribe({
      next : (data : boolean) => {
        this.loginStatus = data;
      }
    });
  }

  ngOnInit(): void {
    this.accountServe.getContact().subscribe({
        next: (data) => {
          console.log("get contact");
          console.log(data);
          this.messagesRecu = data.data;
        },
        error: (err) => {
          console.log("get contact error");
          console.log(err);
          this.messageError = err.error.message
        },
        complete: ()=>{
          console.log("get contact complete");
        }
      })
  }

  deleteMessage(index: number){
    this.accountServe.deleteMessage(this.messagesRecu[index].create_date.value);
  }

}
