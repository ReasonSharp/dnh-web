import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DataService } from 'src/services/data.service';
import { INewsItem } from 'src/models/news-item.model';
import { IAnnouncement } from 'src/models/announcement.model';

@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit {
 newsItems: INewsItem[] = [];
 announcements: IAnnouncement[] = [];

 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.newsItems = this.dataService.newsItems;
  this.announcements = this.dataService.announcements;
 }
}
