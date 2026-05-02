import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { IStatute } from 'src/models/statute.model';

@Component({
  selector: 'app-statut',
  imports: [],
  templateUrl: './statut.component.html',
  styleUrl: './statut.component.scss',
})
export class StatutComponent implements OnInit {
  current: IStatute | null = null;
  archive: IStatute[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.statutes.subscribe(stats => {
      this.current = stats.find(s => s.is_current) ?? null;
      this.archive = stats.filter(s => !s.is_current);
    });
    this.dataService.trackVisit('/statut');
  }
}
