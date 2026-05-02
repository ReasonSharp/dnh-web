import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { IMembershipConfig, IPaymentSettings } from 'src/models/membership.model';

@Component({
  selector: 'app-membership',
  imports: [],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.scss',
})
export class MembershipComponent implements OnInit {
  config: IMembershipConfig | null = null;
  paymentSettings: IPaymentSettings | null = null;
  currentYear = new Date().getFullYear();
  loading = true;

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    this.dataService.trackVisit('/join');
    [this.config, this.paymentSettings] = await Promise.all([
      this.dataService.readMembershipConfig(),
      this.dataService.readPaymentSettings(),
    ]);
    this.loading = false;
  }
}
