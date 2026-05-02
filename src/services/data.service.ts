import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { IAnnouncement } from "src/models/announcement.model";
import { IDocument } from "src/models/document.model";
import { IMembershipConfig, IPaymentSettings } from "src/models/membership.model";
import { INewsItem } from "src/models/news-item.model";
import { IStatute } from "src/models/statute.model";

@Injectable({ providedIn: 'root' })
export class DataService {
 newsItems: BehaviorSubject<INewsItem[]> = new BehaviorSubject<INewsItem[]>([]);
 announcements: BehaviorSubject<IAnnouncement[]> = new BehaviorSubject<IAnnouncement[]>([]);
 documents: BehaviorSubject<IDocument[]> = new BehaviorSubject<IDocument[]>([]);
 statutes: BehaviorSubject<IStatute[]> = new BehaviorSubject<IStatute[]>([]);

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

 async readDocuments(): Promise<IDocument[]> {
  const res = await firstValueFrom(
   this.http.get<{ success: boolean, documents: { id: string | number, name: string, url: string }[] }>(
    '/api/documents.php', { withCredentials: true }
   )
  );
  const docs: IDocument[] = res.success
   ? res.documents.map(d => ({ id: Number(d.id), name: d.name, url: d.url }))
   : [];
  this.documents.next(docs);
  return docs;
 }

 async readStatutes(): Promise<IStatute[]> {
  const res = await firstValueFrom(
   this.http.get<{ success: boolean, statutes: { id: string | number, documentID: string | number, name: string, url: string, display_order: string | number, is_current: string | number | boolean }[] }>(
    '/api/statutes.php', { withCredentials: true }
   )
  );
  const stats: IStatute[] = res.success
   ? res.statutes.map(s => ({
    id: Number(s.id),
    documentID: Number(s.documentID),
    name: s.name,
    url: s.url,
    display_order: Number(s.display_order),
    is_current: !!Number(s.is_current)
   }))
   : [];
  this.statutes.next(stats);
  return stats;
 }

 async updateStatutes(items: { documentID: number, display_order: number, is_current: boolean }[]): Promise<{ success: boolean, message?: string }> {
  return await firstValueFrom(
   this.http.post<{ success: boolean, message?: string }>('/api/statutes.php', { action: 'update', items }, { withCredentials: true })
  );
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

 async readMembershipConfig(year?: number): Promise<IMembershipConfig | null> {
  const url = year != null ? `/api/membership.php?year=${year}` : '/api/membership.php';
  try {
   const res = await firstValueFrom(this.http.get<any>(url));
   if (!res.success) return null;
   return {
    year: res.year,
    enrollmentFeeEnabled: res.enrollment_fee_enabled,
    enrollmentFee: res.enrollment_fee,
    enrollmentFeeDiscounted: res.enrollment_fee_discounted ?? null,
    categories: (res.categories ?? []).map((c: any) => ({
     id: c.id,
     name: c.name,
     price: c.price,
     discountedPrice: c.discounted_price ?? null,
     displayOrder: c.display_order,
    })),
   };
  } catch {
   return null;
  }
 }

 async readMembershipYears(): Promise<number[]> {
  try {
   const res = await firstValueFrom(
    this.http.get<{ success: boolean; years: number[] }>('/api/membership.php?all=1', { withCredentials: true })
   );
   return res.success ? res.years : [];
  } catch {
   return [];
  }
 }

 async saveMembershipConfig(payload: {
  year: number;
  enrollment_fee_enabled: boolean;
  enrollment_fee: number;
  enrollment_fee_discounted: number | null;
  categories: { name: string; price: number; discounted_price: number | null }[];
 }): Promise<{ success: boolean; message?: string }> {
  try {
   return await firstValueFrom(
    this.http.post<{ success: boolean; message?: string }>('/api/membership.php', payload, { withCredentials: true })
   );
  } catch {
   return { success: false, message: 'Greška pri spremanju.' };
  }
 }

 async readPaymentSettings(): Promise<IPaymentSettings> {
  try {
   const res = await firstValueFrom(this.http.get<any>('/api/payment_settings.php'));
   return {
    iban: res.iban ?? '',
    swift: res.swift ?? '',
    admissionFormUrl: res.admission_form_url ?? null,
    admissionFormDocumentId: res.admission_form_document_id ?? null,
   };
  } catch {
   return { iban: '', swift: '', admissionFormUrl: null, admissionFormDocumentId: null };
  }
 }

 async savePaymentSettings(payload: {
  iban: string;
  swift: string;
  admission_form_document_id: number | null;
 }): Promise<{ success: boolean; message?: string }> {
  try {
   return await firstValueFrom(
    this.http.post<{ success: boolean; message?: string }>('/api/payment_settings.php', payload, { withCredentials: true })
   );
  } catch {
   return { success: false, message: 'Greška pri spremanju.' };
  }
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
