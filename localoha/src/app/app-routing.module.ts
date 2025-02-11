import { NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './document/document.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home.component';
import { AideComponent } from './aide/aide.component';
import { MessagesComponent } from './messages/messages.component';
import { CreatAccountComponent } from './creat-account/creat-account.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { AllMeetingsComponent } from './all-meetings/all-meetings.component';
import { InfoParticipantComponent } from './info-participant/info-participant.component';
import { TestPageComponent } from './test-page/test-page.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  // {path: 'createEvent', redirectTo: '/creerEvenement', pathMatch: 'full'},
  // {path: 'consultEvent', redirectTo: '/consulterEvenement', pathMatch: 'full'},
  // {path: 'document', redirectTo: '/documentation', pathMatch: 'full'},
  // {path: 'comment', redirectTo: '/commentaire', pathMatch: 'full'},
  // {path: 'meeting', redirectTo: '/reunion', pathMatch: 'full'},
  {path: 'creerUtilisateur', component: CreatAccountComponent },
  {path: 'documentation', component: DocumentComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'mesMessages', component: MyMessagesComponent},
  {path: 'creerReunion', component: CreateMeetingComponent},
  {path: 'reunion', component: MeetingComponent},
  {path: 'mesReunions', component: AllMeetingsComponent},
  {path: 'test', component: TestPageComponent},
  {path: 'reunion/:username/:id', component: MeetingComponent},
  {path: 'reunion/:code', component: MeetingComponent},
  {path: 'participantInfo', component: InfoParticipantComponent},
  {path: 'erreur', component: PageNotFoundComponent },

  //pour version anglaise
  {path: 'createUser', component: CreatAccountComponent },
  {path: 'document', component: DocumentComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'meeting', component: MeetingComponent},
  
  // pour version chinoise
  {path: 'chuanjianyonghu', component: CreatAccountComponent },
  {path: 'wenzhang', component: DocumentComponent},
  {path: 'xinxi', component: MessagesComponent},
  {path: 'huiyi', component: MeetingComponent},

  {path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
