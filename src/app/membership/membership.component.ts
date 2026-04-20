import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-membership',
  imports: [],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss',
})
export class MembershipComponent implements OnInit {
 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/join');
 }
}
