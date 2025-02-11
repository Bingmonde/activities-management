import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/interface';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-creat-account',
  templateUrl: './creat-account.component.html',
  styleUrls: ['./creat-account.component.css']
})
export class CreatAccountComponent implements OnInit {
  
  newUser!: IUser;
  
  valideKey = "cal41202";

  showCreateUser = true;
  passwordConfirm = "";
  conditionsChecked = false;
  createUserStatus = "";
  createUserError = "";
  

  constructor(private router: Router, private account_service : AccountService){}
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.showCreateUser = true;
    this.conditionsChecked = false;
    this.newUser = {
      username: "",
      password: "",
      email: "",
      key:""
    }
  }
  
  createUser(){
    this.showCreateUser = false;
    console.log(this.newUser);
    this.account_service.createUser(this.newUser).subscribe({
      next: (data) => {
        console.log("create");
        console.log(data);  
        this.createUserStatus = data.data;
      },
      error: (err) => {
        console.log("create error");
        this.createUserError = err.error.message;
        console.log(err);
        
      },
      complete: ()=>{
        console.log("create complete");
      }

    });
  }
  // goConsultEvent(){
  //   this.router.navigate(['/creerEvenement']);
  // }



}
