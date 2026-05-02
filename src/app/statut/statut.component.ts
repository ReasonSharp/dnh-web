import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { HttpClient } from '@angular/common/http';

interface StatuteData {
  current: { name: string; url: string } | null;
  archive: { name: string; url: string }[];
}

@Component({
  selector: 'app-statut',
  imports: [],
  templateUrl: './statut.component.html',
  styleUrl: './statut.component.scss',
})
export class StatutComponent implements OnInit {
  statuteData: StatuteData = { current: null, archive: [] };

  constructor(private dataService: DataService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get<StatuteData>('/api/statutes.php').subscribe({
      next: res => this.statuteData = res,
      error: () => this.statuteData = { current: null, archive: [] }
    });
    this.dataService.trackVisit('/statut');
  }
}
