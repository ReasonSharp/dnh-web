import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DataService } from 'src/services/data.service';
import { INewsItem } from 'src/models/news-item.model';
import { IAnnouncement } from 'src/models/announcement.model';
import { ArticleModalComponent } from '../shared/article-modal/article-modal.component';

@Component({
  selector: 'app-index',
  imports: [CommonModule, ArticleModalComponent],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss',
})
export class IndexComponent implements OnInit {
 newsItems: INewsItem[] = [];
 announcements: IAnnouncement[] = [];
 selectedArticle: INewsItem | IAnnouncement | null = null;

 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/');
  this.dataService.newsItems.subscribe(items => this.newsItems = items);
  this.dataService.announcements.subscribe(items => this.announcements = items);
 }

 openArticle(item: INewsItem | IAnnouncement) { this.selectedArticle = item; }
 closeArticle() { this.selectedArticle = null; }
}
