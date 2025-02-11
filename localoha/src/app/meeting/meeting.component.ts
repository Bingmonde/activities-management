import { Component, OnInit } from '@angular/core';
import { AccountService } from '../services/account.service';
import { IConnexion, IDate, IDateAPI, IDatePart, IDateStats, IEvent, IEventAPI, IEventAPIStandard, IEventAdminAPI, IEventBase, IEventToken, IListChoicePart, ILocalChoix, IParticipantBase, IParticipantChoixDate } from '../interfaces/interface';
import { MeetingService } from '../services/meeting.service';
import { ActivatedRoute, ParamMap, Router} from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InfoParticipantComponent } from '../info-participant/info-participant.component';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  meetingActual!: IEvent;
  linkAdmin: string = "";
  linkVisiter: string = "";
  shareLinkAdmin: string = "";
  shareLinkVisiter: string = "";
  domainAdr: string = "https://bingwebtp2.web.app/fr-CA/"
  meeting_id!: number;
  actualUser: string = "";
  meeting_token: string = "";
  loginStatus: boolean = false;
  estVisiter: boolean = true;
  userActual! : IConnexion;
  myMeetingsToken!: IEventToken;
  myMeeting!: IEventAdminAPI;
  meetingForAffichage!: IEventAPIStandard;
  lesDateProp!: IDateStats[];
  parts! : IParticipantChoixDate[];
  listParts!: IListChoicePart[];
  partChoice! : ILocalChoix;
  visiterChoice: boolean[] = [];


  linkSubcription!: Subscription;

  constructor(private accountServe: AccountService, private meetServe: MeetingService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog){}

  ngOnInit(): void {
    // initializer
    this.meetingForAffichage = {
      meeting_id: 0,
      title: "",
      describe: "",
      location: "",
      deadline: new Date(0)
    }

    // test when not login
    this.loginStatus = true;
    this.userActual = {
      username: 'montreal1111',
      password: '12345678'
    }

    // this.testMeeting = {
    //   title: "Test_meeting",
    //   describe: "un description",
    //   location: "Montreal",
    //   dates: '[{"start":"2023-12-20T05:36:00.000Z","end":"2023-12-20T06:36:00.000Z"},{"start":"2023-12-23T05:36:00.000Z","end":"2023-12-23T06:36:00.000Z"}]',
    //   deadline: new Date("2023-12-19 05:36:00 UTC")
    // }


    // subscribe link
    this.linkSubcription = this.route.paramMap.subscribe(
      {
        next: (params: ParamMap) =>{
          const param_id = params.get('id');
          const param_user = params.get('username');
          const param_code = params.get('code');
          console.log('param',param_id, param_user);

          // attention !! maybe username will get later from DB
          if (param_id && param_user) {
            this.meeting_token = this.findToken(param_id);
            console.log(this.meeting_token);
            
            this.getMeetingByIdToken();
          }
          else if (param_code) {
            let aCode = this.route.snapshot.url[this.route.snapshot.url.length - 1].path; 
            console.log(aCode);
            this.getMeetingByShareCode(aCode);

          }
          else {
            this.router.navigate(['/erreur']);
          }
        }
      }
    )

    

    // errors !!
    // this.meetServe.getTempMeetings.pipe(
    //   filter( m => m.token_id.id === this.myMeetingsToken.id)
    // )

    // get token and id from localStorage
    // let token_ids = localStorage.getItem('tokenIds_meets');
    // console.log(token_ids);
    
    // if (token_ids !== null){
    //   // get the newest token and id just created
    //   this.myMeetingsToken = JSON.parse(token_ids).pop();
    // }

    // using username + id
    //this.getMeeting();

    //using share code
    //this.getMeetingByShareCode();
    
  }

  // ngAfterViewInit() {
    // setTimeout(() => {
    //   this.openModalParticipantInfo();;
    // }, 1000);
  // }


  getMeetingByIdToken(){
    this.meetServe.getMeetingByID(this.myMeetingsToken.id, this.meeting_token).subscribe(
      {
        next: (data) => {
          console.log("get meeting by id");
          console.log(data);
          console.log(typeof data);
          this.myMeeting = data;
          console.log("link:", this.myMeeting.editor_link);
          
        },
        error: (err) => {
          console.log("get meeting by id error");
          console.log(err);
        },
        complete: ()=>{
          console.log("get meeting by id complete");
        }
      }
    );
  }

  generateLinks(){
    console.log('getlink');
    
    if (this.shareLinkAdmin.length!==0){
      this.getShareLinkAdmin();
    }
    this.getShareLinkVisiter();
    
  }

  getShareLinkAdmin(){
    //this.linkAdmin = this.domainAdr + 'reunion/' + this.shareLinkAdmin;
    this.copyLink(this.linkAdmin);  
    console.log('linkadmin', this.linkAdmin);
    
  }
  

  getShareLinkVisiter(){
    //this.linkVisiter = this.domainAdr + 'reunion/' + this.shareLinkVisiter; 
    this.copyLink(this.linkVisiter);
    console.log('linkvisiter', this.linkVisiter);
  }

  copyLink(link: string){
    console.log("copylink");
    navigator.clipboard.writeText(link);
    alert("Lien copié");
  }
  // resetLink(){
  //   this.shareLinkAdmin ="";
  //   this.shareLinkVisiter = "";
  // }
  // not sure how
  hintForcopy(){}

  findToken(id: string):string {
    let token_id = localStorage.getItem('tokenIds_meets-' + id);
    if (token_id){
      return token_id;
    }
    else {
      return "";
    }
    
  }

  getMeetingByShareCode(code: string){
    this.meetServe.getMeetingByShareCode(code).subscribe(
      {
        next: (data) => {
       // this.testMeeting = data;
       this.estVisiter = false;
          this.meetingForAffichage.meeting_id = data.meet_info.meeting_id;
          this.meetingForAffichage.title = data.meet_info.title;
          this.meetingForAffichage.describe = data.meet_info.describe;
          this.meetingForAffichage.location = data.meet_info.location;
          this.meetingForAffichage.deadline = new Date(data.meet_info.deadline);

          this.lesDateProp = this.getDateFomat(data.vote_dates);
          console.log('lesDateProp',this.lesDateProp);
          //console.log(data);
       // parts_info only for admin
        if ('parts_info' in data){
          this.parts = data.parts_info;
          console.log('parts',this.parts);
          this.shareLinkAdmin = code;
          console.log('adminlink', this.shareLinkAdmin);
          this.linkAdmin = this.domainAdr + 'reunion/' + this.shareLinkAdmin;
          this.linkVisiter = this.domainAdr + 'reunion/' + this.shareLinkVisiter; 
        }
        // for visiter
        else{
          this.estVisiter = true;
          this.shareLinkVisiter = code;
          console.log('visiterlink', this.shareLinkVisiter);
          this.linkVisiter = this.domainAdr + 'reunion/' + this.shareLinkVisiter; 

          // check participant choices
          // let key = 'localoha--' + code; 
          // console.log(key);
          // let localData = localStorage.getItem(key);
          // if (localData){
          //   const localDateObject = JSON.parse(localData);
          //   this.visiterChoice = this.getChoiceOfParticipant(localDateObject.dates); 
          // }
          // get local pariticipant
          let localPartInfo = this.getHistory(code);
          this.visiterChoice = this.getChoiceOfParticipant(localPartInfo.dates); 
          console.log('visiter choice', this.visiterChoice);
          
            
        }
        // open modal for participant info form
        if ( this.getParticipant() == 0|| !this.loginStatus){
          this.openModalParticipantInfo();
        }

        

        console.log("get meeting by share code");
        },
        error: (err) => {
          console.log("get meeting by share code error");
          console.log(err);
        },
        complete: ()=>{
          console.log("get meeting by share code complete");
        }
      }
    )
  }


  // voterDate(){}
  voterDate(index: number){
    let partID = this.getParticipant();
    if (partID !== 0){
      console.log(partID);
      console.log(this.lesDateProp[index]);

      let toInsertDB: IDatePart = {
        date_part_id: 0,
        date_id: this.lesDateProp[index].date_id,
        part_id: partID
      }
      // vote a date
      if (!this.visiterChoice[index]){
        this.meetServe.postPartVoteDate(toInsertDB).subscribe(
          {
            next: (data) => {
              console.log(data);
              if (data === true){
                console.log('localstorage, sharelink', this.shareLinkVisiter);
                
                let visiter_choice = this.getHistory(this.shareLinkVisiter);
                console.log('visiter_choice should have', visiter_choice);
                
                visiter_choice.dates.push(toInsertDB.date_id)
                this.saveHistory(visiter_choice);
                this.visiterChoice[index] = !this.visiterChoice[index];
                this.lesDateProp[index].vote++;
              }
            }
          }
        )
      }
      // delete a voted date
      else{
        this.meetServe.deletePartVoteDate(this.lesDateProp[index].date_id, partID).subscribe(
          {next: (data)=>{
            console.log(data);
            if (data === true){
              let visiter_choice = this.getHistory(this.shareLinkVisiter);
              console.log('visiter_choice', visiter_choice);
                let placeDateID = visiter_choice.dates.indexOf(this.lesDateProp[index].date_id)
                visiter_choice.dates.splice(placeDateID, 1);
                this.saveHistory(visiter_choice);
                this.visiterChoice[index] = !this.visiterChoice[index];
                this.lesDateProp[index].vote--;
            }
          }
          }
        )
      }

    }
  }


  openModalParticipantInfo(){    
    const form_participant = this.dialog.open(InfoParticipantComponent);
    form_participant.afterClosed().subscribe(
      f => {
      console.log("info participant modal closed");}
    )
  }


  getDateFomat(dates: IDateAPI[]): IDateStats[] {
    console.log('dates form api', dates);

    
    
    let dates_convert : IDateStats[] = [];

    for (let i=0; i< dates.length; i++){
      let vote_num = dates[i].vote !== undefined ? dates[i].vote : 0;
      let a_date: IDateStats = {
        date_id: dates[i].date_id,
        d_start: new Date(dates[i].d_start.value),
        d_end: new Date(dates[i].d_end.value),
        vote: vote_num
      }
      console.log(a_date);
      
      dates_convert.push(a_date);
    }
    return dates_convert;
  }

  // create an array for listing the choices of participant
  listChoiceParticipant(dates: IDate[], choices : IParticipantChoixDate[]): IListChoicePart[]{
    let listes: IListChoicePart[] = [];
    for (let i=0; i<choices.length; i++){
      let aPart = choices[i].name;
      let someDatesId = choices[i].selected_dates;
      let partChoice = [];
      for (let j=0; j<dates.length; j++){
        if (someDatesId.indexOf(dates[j].date_id) != -1){
          partChoice.push(true);
        }
        else{
          partChoice.push(false);
        }
      }
    }
    return listes;
  }
  
  getChoiceOfParticipant(date_ids: number[]) : boolean[]{
    let choices : boolean[] = [];
    for (let j=0; j<this.lesDateProp.length; j++){
      if (date_ids.indexOf(this.lesDateProp[j].date_id) == -1){
        // if date_id not found in history
        choices.push(false);
      }
      else{
        choices.push(true);
      }
    }
    return choices;
  }

  
  
  getHistory(meet_code: string): ILocalChoix{
    let key = 'localoha_' + meet_code; 
    console.log(key);
    
    let localData = localStorage.getItem(key);
    let oneHistory : ILocalChoix = {
      code: meet_code,
      dates: []
    };
    if (localData){
      oneHistory = JSON.parse(localData);
      console.log('get history',oneHistory);
    }
    else{
      this.saveHistory(oneHistory);
    }
    return oneHistory;
    
  }

  saveHistory(oneHistory: ILocalChoix){
    let key = 'localoha_' + oneHistory.code;
    localStorage.setItem(key, JSON.stringify(oneHistory));
  }


  getParticipant(): number{
    let partID = 0;
    let info_partcipant = localStorage.getItem("localohaParticipant");
    if (info_partcipant){
      partID = JSON.parse(info_partcipant).part_id;
      console.log('get part id',partID);
      
    }
    return partID;
  }

  resetAlll(){
    this.linkAdmin = "";
    this.linkVisiter = "";

  }



}
