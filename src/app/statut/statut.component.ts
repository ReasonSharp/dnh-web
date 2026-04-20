import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-statut',
  imports: [],
  templateUrl: './statut.component.html',
  styleUrl: './statut.component.scss',
})
export class StatutComponent implements OnInit {
 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/statut');
 }
}
