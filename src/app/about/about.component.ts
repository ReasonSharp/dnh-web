import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  standalone: true
})
export class AboutComponent implements OnInit {
 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/about');
 }
}
