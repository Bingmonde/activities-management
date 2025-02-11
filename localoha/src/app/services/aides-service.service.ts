import { Injectable } from '@angular/core';
import { IAide } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class AidesServiceService {

  list_aides : IAide [] = [
    {
      section: 'home',
      content: 'Bienvenu à Localoha!',
    }
  ];

  constructor() {}
}
