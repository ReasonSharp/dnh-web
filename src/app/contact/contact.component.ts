import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { IContactCategory } from 'src/models/contact.model';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  categories: IContactCategory[] = [];

  constructor(private dataService: DataService) {}

  async ngOnInit() {
    this.dataService.trackVisit('/contact');
    this.categories = await this.dataService.readContactInfo();
  }
}
