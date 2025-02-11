import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IConnexion, IMessage, IUser } from '../interfaces/interface';
import { BehaviorSubject, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http_client: HttpClient ) {
    this.notifyConnex$ = new BehaviorSubject<boolean>(false);
    this.connecte$ = this.notifyConnex$.asObservable();
    this.notifyUser$ = new BehaviorSubject<IConnexion>(
      this.userActual
    );
    this.user$ = this.notifyUser$.asObservable();
   }
   
  cegepServer = 'https://cegep.fdtt.space/v1/';

  monHeader = new HttpHeaders({
    'Content-type':'application/json',
  });
  
  private userActual: IConnexion = {
    username: "",
    password: ""
  };

  
  monToken: string = "";
  
  private notifyConnex$: BehaviorSubject<boolean>;
  private notifyUser$: BehaviorSubject<IConnexion>;
  connecte$: Observable<boolean>;
  user$: Observable<IConnexion>;
  

  createUser( newUser: IUser): Observable<any>{
    return this.http_client.post<string>(
    `${this.cegepServer}create_user`,
    newUser
    )
  }

  login(connex : IConnexion): Observable<any> {
    //this.userActual = connex;
    return this.http_client.post<string>(
      `${this.cegepServer}session`,
      connex
    )
  }
  
  logout(): void{
    this.http_client.delete<string>(
      `${this.cegepServer}session`,
      {headers: this.monHeader.set('Authorization',  this.monToken)}
    ).subscribe(
      {
        next: (data) => {
          console.log("logout");
          console.log(data);
          this.monToken ="";
          this.userActual.username = "";
          this.userActual.password = "";
        },
        error: (err) => {
          console.log("logout error");
          console.log(err);
        },
        complete: ()=>{
          console.log("logout complete");
        }
      }
    )
  }

  getContact(): Observable<any>{
    return this.http_client.get(
      `${this.cegepServer}contact/${this.userActual.username}`,
      {headers: this.monHeader.set('Authorization',  this.monToken)}
    )
  }

  saveMessage(user:string, message: IMessage): Observable<any>{
    console.log(`${this.cegepServer}contact/${user}`);
    console.log(user, message);
    
    return this.http_client.put<string>(
      `${this.cegepServer}contact/${user}`,
      JSON.stringify(message),
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'accept': 'application/json',
        })
      }
    )
  }

  deleteMessage(date: string): void{
    this.http_client.delete(
      `${this.cegepServer}${this.userActual.username}/${date}`,
      {headers: this.monHeader.set('Authorization',  this.monToken)}
    );      
  }

  setConnexStatus(login: boolean){
    this.notifyConnex$.next(login);
  }

  setUser(user: IConnexion){
    this.notifyUser$.next(user);
    this.userActual = user;
  }


}
