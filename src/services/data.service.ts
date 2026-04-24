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

 trackVisit(page: string) {
  this.http.get(`/api/counter.php?page=${encodeURIComponent(page)}`).subscribe({ error: () => {} });
 }

 isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

 async login(username: string, password: string): Promise<{success: boolean, message?: string}> {
  try {
   const res = await firstValueFrom(
    this.http.post<{success: boolean, message?: string}>(
     '/api/login.php',
     { username, password },
     { withCredentials: true }
    )
   );
   if (res.success) {
    this.isLoggedIn.next(true);
   }
   return res;
  } catch (e) {
   return { success: false, message: 'Error during login' };
  }
 }

 logout() {
  this.http.get('/api/logout.php', { withCredentials: true }).subscribe();
  this.isLoggedIn.next(false);
 }

 async changePassword(oldPassword: string, newPassword: string): Promise<{success: boolean, message?: string}> {
  try {
   return await firstValueFrom(
    this.http.post<{success: boolean, message?: string}>(
     '/api/change_password.php',
     { old_password: oldPassword, new_password: newPassword },
     { withCredentials: true }
    )
   );
  } catch (e) {
   return { success: false, message: 'Error changing password' };
  }
 }
}
