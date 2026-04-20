import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent implements OnInit {
 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/privacy-policy');
 }
}
