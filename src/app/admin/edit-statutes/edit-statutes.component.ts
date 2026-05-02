import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

interface Document {
 id: number;
 name: string;
 url: string;
}

interface Statute {
 id: number;
 documentID: number;
 name: string;
 url: string;
 display_order: number;
 is_current: boolean;
}

@Component({
 selector: 'app-edit-statutes',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './edit-statutes.component.html',
 styleUrl: './edit-statutes.component.scss'
})
export class EditStatutesComponent implements OnInit {
 documents: Document[] = [];
 statutes: Statute[] = [];
 availableDocuments: Document[] = [];
 selectedDocumentId: number = 0;
 message = '';
 success = false;

 constructor(private http: HttpClient) { }

 async ngOnInit() {
  try {
   const resDocs = await firstValueFrom(this.http.get<{ success: boolean, documents: Document[] }>('/api/documents.php', { withCredentials: true }));
   if (resDocs.success) this.documents = resDocs.documents;

   const resStats = await firstValueFrom(this.http.get<{ success: boolean, statutes: Statute[] }>('/api/statutes.php', { withCredentials: true }));
   if (resStats.success) this.statutes = resStats.statutes;

   this.updateAvailable();
  } catch {
   this.message = 'Greška pri učitavanju podataka.';
   this.success = false;
  }
 }

 updateAvailable() {
  this.availableDocuments = this.documents.filter(d => !this.statutes.some(s => s.documentID === d.id));
 }

 addToArchive() {
  if (this.selectedDocumentId === 0) return;
  const doc = this.documents.find(d => d.id === this.selectedDocumentId);
  if (!doc) return;
  this.statutes.push({
   id: 0,
   documentID: doc.id,
   name: doc.name,
   url: doc.url,
   display_order: this.statutes.length,
   is_current: false
  });
  this.updateAvailable();
  this.selectedDocumentId = 0;
 }

 remove(statuteId: number) {
  const index = this.statutes.findIndex(s => s.id === statuteId);
  if (index > -1) {
   this.statutes.splice(index, 1);
   this.updateOrders();
  }
  this.updateAvailable();
 }

 moveUp(index: number) {
  if (index <= 0) return;
  const temp = this.statutes[index - 1];
  this.statutes[index - 1] = this.statutes[index];
  this.statutes[index] = temp;
  this.updateOrders();
 }

 moveDown(index: number) {
  if (index >= this.statutes.length - 1) return;
  const temp = this.statutes[index + 1];
  this.statutes[index + 1] = this.statutes[index];
  this.statutes[index] = temp;
  this.updateOrders();
 }

 updateOrders() {
  this.statutes.forEach((s, i) => s.display_order = i);
 }

 setCurrent(statuteId: number) {
  this.statutes.forEach(s => s.is_current = (s.id === statuteId));
 }

 async saveChanges() {
  if (this.statutes.filter(s => s.is_current).length !== 1) {
   this.message = 'Točno jedan statut mora biti označen kao trenutni.';
   this.success = false;
   return;
  }
  const items = this.statutes.map(s => ({
   documentID: s.documentID,
   display_order: s.display_order,
   is_current: s.is_current
  }));
  try {
   const res = await firstValueFrom(
    this.http.post<{ success: boolean, message?: string }>('/api/statutes.php', { action: 'update', items }, { withCredentials: true })
   );
   this.success = res.success;
   this.message = res.message ?? (res.success ? 'Promjene spremljene.' : 'Greška pri spremanju.');
   if (res.success) {
    const resStats = await firstValueFrom(this.http.get<{ success: boolean, statutes: Statute[] }>('/api/statutes.php', { withCredentials: true }));
    if (resStats.success) this.statutes = resStats.statutes;
    this.updateAvailable();
   }
  } catch {
   this.success = false;
   this.message = 'Greška pri spremanju promjena.';
  }
 }
}