import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { IMembershipConfig } from 'src/models/membership.model';

@Component({
  selector: 'app-membership',
  imports: [],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss',
})
export class MembershipComponent implements OnInit {
  config: IMembershipConfig | null = null;
  currentYear = new Date().getFullYear();
  loading = true;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    this.dataService.trackVisit('/join');
    this.config = await this.dataService.readMembershipConfig();
    this.loading = false;
  }
}
