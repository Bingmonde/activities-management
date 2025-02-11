import { Component } from '@angular/core';
import { IActivities } from '../interfaces/interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  activities : IActivities[] = [
    {
      titre: $localize`Activité 1`,
      image: 'assets/images/alexander-kovacs-uo9TCt61o30-unsplash.jpg',
      desc: $localize`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ex suscipit obcaecati numquam aliquam, temporibus minima quia nihil repudiandae dignissimos. Tempore dicta ducimus et sed provident consequatur culpa quidem quas?`
    },

    {
      titre: $localize`Activité 2`,
      image: 'assets/images/unsplash-c59hEeerAaI-unsplash.jpg',
      desc: $localize`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo ex suscipit obcaecati numquam aliquam, temporibus minima quia nihil repudiandae dignissimos. Tempore dicta ducimus et sed provident consequatur culpa quidem quas?`
    }
  ];


  




}
