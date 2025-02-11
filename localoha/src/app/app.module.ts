import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { LogoComponent } from './logo/logo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { AideComponent } from './aide/aide.component';
import { DocumentComponent } from './document/document.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { MeetingComponent } from './meeting/meeting.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CreatAccountComponent } from './creat-account/creat-account.component';
import { MessagesComponent } from './messages/messages.component';
import { MyMessagesComponent } from './my-messages/my-messages.component';
import { CreateMeetingComponent } from './create-meeting/create-meeting.component';
import { TestPageComponent } from './test-page/test-page.component';
import { AllMeetingsComponent } from './all-meetings/all-meetings.component';
import { InfoParticipantComponent } from './info-participant/info-participant.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LogoComponent,
    PageNotFoundComponent,
    ConnexionComponent,
    AideComponent,
    DocumentComponent,
    // FooterComponent,
    //MeetingComponent,
    HomeComponent,
    CreatAccountComponent,
    MessagesComponent,
    MyMessagesComponent,
    MeetingComponent,
    CreateMeetingComponent,
    TestPageComponent,
    AllMeetingsComponent,
    InfoParticipantComponent,   
    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FooterComponent,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
