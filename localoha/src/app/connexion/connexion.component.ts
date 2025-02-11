import { Component, OnInit } from '@angular/core';
import { IConnexion } from '../interfaces/interface';
import { NgModel } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  user_connex: IConnexion = {
    username: "",
    password: ""
  };
  connex_error: string = "";
  connexSucces = false;
  //connexModelShow = false;

  constructor(private connexService: AccountService){}

  ngOnInit(): void {
    this.connex_error = "";
    this.connexSucces = false;
    this.user_connex = {
      username: "",
      password: ""
    };
  }

  connex(){
    this.connex_error = "";
    console.log("connexion: " , this.user_connex.username, 'mot de pass: ', this.user_connex.password);
    this.connexService.login(this.user_connex).subscribe({
      next: (data) => {
        console.log("connexion");
        console.log(data); 
        this.connexService.monToken = data.data;
        localStorage.setItem("sessionLocaloha", data.data);
        this.connexSucces = true;
        this.connexService.setConnexStatus(this.connexSucces);
        this.connexService.setUser(this.user_connex);
      },
      error: (err) => {
        console.log("connexion error");
        console.log(err);
        this.connex_error = err.error.message;
      },
      complete: ()=>{
        console.log("connexion complete");
      }
    }

    )

  }

  resetAll(){
    this.connex_error = "";
    this.connexSucces = false;
    this.user_connex = {
      username: "",
      password: ""
    };
  }
  



}
