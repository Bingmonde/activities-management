import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AidesServiceService } from '../services/aides-service.service';
import { Router } from '@angular/router';
import { IAide } from '../interfaces/interface';

@Component({
  selector: 'app-aide',
  templateUrl: './aide.component.html',
  styleUrls: ['./aide.component.css']
})
export class AideComponent {

  // actualAide!: IAide;

  @Input() aideFromApp: string = ''; 

  @Output() hideAide = new EventEmitter<void>();


  constructor(public router: Router){
  }

  closeAide(){
    if (this.aideFromApp !== ''){
      localStorage.setItem(this.router.url, "1"); 
    }
    this.hideAide.emit();
  }

    
  }

