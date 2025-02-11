import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDate, IDatePart, IDateVote, IEvent, IEventAdminAPI, IEventToken, IEventUpdate, IMeetingAPI, IParticipantAPI, IParticipantBase } from '../interfaces/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(private http_client: HttpClient) { }

  monHeader = new HttpHeaders({
    'Content-type':'application/json'
  });

  //meetingServ = "http://localhost:8080/";
  meetingServ = "https://us-central1-bing345tps.cloudfunctions.net/"
  particpantServ = "https://us-central1-bing345tps.cloudfunctions.net/"
  //particpantServ = "http://localhost:8080/"

  // meetings : IMeetingAPI[] = [];
  // meetings_temp$ = new BehaviorSubject<IMeetingAPI[]>(
  //   this.meetings
  // );



  //for test, without username
  createMeeting(meeting: IEvent): Observable<IEventToken>{
    let username = "montreal1111";
    return this.http_client.post<IEventToken>(
      `${this.meetingServ}meeting/${username}`,
      meeting
    )
  }

  updateMeeting(meetingID: number, token: string, meeting: IEventUpdate): Observable<string>{
    return this.http_client.put<string>(
      `${this.meetingServ}meeting/${meetingID}`,
      meeting,
      {headers: this.monHeader.set('Authorization',  token)}
    )
  }

  // getTest(): Observable<any>{
  //   return this.http_client.get<string>(
  //     `${this.meetingServ}meeting`
  //   )
  // }

  getMeetingByID(id: number, token: string): Observable<any>{
    let username = "montreal1111";
    return this.http_client.get<any>(
      `${this.meetingServ}meeting/u/${username}/${id}`,
      {headers: this.monHeader.set('Authorization',  token)}
    )
  }


  // return <IEventBref>
  // getMeetingForCreator(): Observable<any>{
  //   let username = "montreal1111";
  //   return this.http_client.get<any>(
  //     `${this.meetingServ}meeting/u/${username}`
  //   )
  // }

  // return 2 types depending type of share code
  getMeetingByShareCode(code: string): Observable<any>{
    return this.http_client.get<any>(
      `${this.meetingServ}meeting/s/${code}`
    )
  }

  deleteMeeting(username: string, meetingID: string, token: string): Observable<string>{
    return this.http_client.delete<string>(
      `${this.meetingServ}meeting/${username}/${meetingID}`,
      {headers: this.monHeader.set('Authorization',  token)}
    )
  }

  // for /participant
  createParticipant(part: IParticipantBase): Observable<string>{
    return this.http_client.post<string>(
      `${this.particpantServ}participant`,
      part
    )
  }

  updateParticipant(part: IParticipantBase, part_id : number): Observable<string>{
    return this.http_client.put<string>(
      `${this.particpantServ}participant/${part_id}`,
      part
    )    
  }


  postPartVoteDate(choix: IDatePart): Observable<boolean>{
    return this.http_client.post<boolean>(
      `${this.particpantServ}participant/d/${choix.part_id}`,
      choix
    )
  }

  deletePartVoteDate(date_id: number, part_id: number): Observable<boolean>{
    return this.http_client.delete<boolean>(
      `${this.particpantServ}participant/${part_id}/${date_id}`
    )
  }




}
