import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { IAnnouncement } from "src/models/announcement.model";
import { INewsItem } from "src/models/news-item.model";

@Injectable({ providedIn: 'root' })
export class DataService {
 newsItems: BehaviorSubject<INewsItem[]> = new BehaviorSubject<INewsItem[]>([]);
 announcements: BehaviorSubject<IAnnouncement[]> = new BehaviorSubject<IAnnouncement[]>([]);

 constructor(private http: HttpClient) { }

 setNewsItems(items: INewsItem[]) {
  this.newsItems.next(items);
 }

 setAnnouncements(items: IAnnouncement[]) {
  this.announcements.next(items);
 }

 async readNewsItems() : Promise<INewsItem[]> {
  this.newsItems.next(await firstValueFrom(this.http.get<INewsItem[]>("/api/main.php?type=news")));
  return this.newsItems.getValue();
 }
 async readAnnouncements() : Promise<IAnnouncement[]> {
  this.announcements.next(await firstValueFrom(this.http.get<IAnnouncement[]>("/api/main.php?type=announcements")));
  return this.announcements.getValue();
 }
}