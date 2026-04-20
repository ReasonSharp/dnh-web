import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-codex',
  imports: [],
  templateUrl: './codex.component.html',
  styleUrl: './codex.component.scss',
})
export class CodexComponent implements OnInit {
 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/codex');
 }
}
