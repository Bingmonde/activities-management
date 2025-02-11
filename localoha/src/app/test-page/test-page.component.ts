import { Component } from '@angular/core';
import { MeetingService } from '../services/meeting.service';


@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent {

  constructor(private meetServe: MeetingService){}

  testPart(){}
  

}
