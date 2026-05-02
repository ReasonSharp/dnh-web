import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/services/data.service';
import { IDocument } from 'src/models/document.model';
import { IStatute } from 'src/models/statute.model';

@Component({
 selector: 'app-edit-statutes',
 standalone: true,
 imports: [CommonModule, FormsModule],
 templateUrl: './edit-statutes.component.html',
 styleUrl: './edit-statutes.component.scss'
})
export class EditStatutesComponent implements OnInit {
 documents: IDocument[] = [];
 statutes: IStatute[] = [];
 availableDocuments: IDocument[] = [];
 selectedDocumentId: number = 0;
 message = '';
 success = false;

 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.documents.subscribe(docs => {
   this.documents = docs;
   this.updateAvailable();
  });
  this.dataService.statutes.subscribe(stats => {
   this.statutes = stats.map(s => ({ ...s }));
   this.updateAvailable();
  });
 }

 updateAvailable() {
  this.availableDocuments = this.documents.filter(d => !this.statutes.some(s => s.documentID === d.id));
 }

 addToArchive() {
  if (this.selectedDocumentId === 0) return;
  const doc = this.documents.find(d => d.id === this.selectedDocumentId);
  if (!doc) return;
  this.statutes = [...this.statutes, {
   id: 0,
   documentID: doc.id,
   name: doc.name,
   url: doc.url,
   display_order: this.statutes.length,
   is_current: false
  }];
  this.updateAvailable();
  this.selectedDocumentId = 0;
 }

 remove(selected: IStatute) {
  this.statutes = this.statutes.filter(s => s !== selected);
  this.updateOrders();
  this.updateAvailable();
 }

 moveUp(index: number) {
  if (index <= 0) return;
  const next = [...this.statutes];
  [next[index - 1], next[index]] = [next[index], next[index - 1]];
  this.statutes = next;
  this.updateOrders();
 }

 moveDown(index: number) {
  if (index >= this.statutes.length - 1) return;
  const next = [...this.statutes];
  [next[index + 1], next[index]] = [next[index], next[index + 1]];
  this.statutes = next;
  this.updateOrders();
 }

 updateOrders() {
  this.statutes.forEach((s, i) => s.display_order = i);
 }

 setCurrent(selected: IStatute) {
  this.statutes.forEach(s => s.is_current = (s === selected));
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
   const res = await this.dataService.updateStatutes(items);
   this.success = res.success;
   this.message = res.message ?? (res.success ? 'Promjene spremljene.' : 'Greška pri spremanju.');
   if (res.success) {
    await this.dataService.readStatutes();
   }
  } catch {
   this.success = false;
   this.message = 'Greška pri spremanju promjena.';
  }
 }
}
