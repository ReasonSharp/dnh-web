import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-contact',
  imports: [ CommonModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
 functions = [
  { title: "Predsjednica", items: [ { value: "Snježana Krušelj", link: null } ] },
  { title: "Tajnik", items: [ { value: "Saša Pajić", link: null } ] },
  { title: "Sjedište", items: [ { value: "Zelinska 5", link: null }, { value: "10000 Zagreb", link: null } ] },
  { title: "Telefon", items: [ { value: "+385 (0)98 973 6156 (Adrian Kučić)", link: null } ] },
  { title: "e-Mail", items: [ { value: "dnh@dnh.hr", link: "mailto:dnh@dnh.hr" } ] }
 ];

 constructor(private dataService: DataService) { }

 ngOnInit() {
  this.dataService.trackVisit('/contact');
 }
}
