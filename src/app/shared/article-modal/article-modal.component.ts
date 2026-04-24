import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { INewsItem } from 'src/models/news-item.model';
import { IAnnouncement } from 'src/models/announcement.model';

@Component({
  selector: 'app-article-modal',
  standalone: true,
  imports: [],
  templateUrl: './article-modal.component.html',
  styleUrl: './article-modal.component.scss'
})
export class ArticleModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) item!: INewsItem | IAnnouncement;
  @Output() closed = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit()    { document.body.style.overflow = 'hidden'; }
  ngOnDestroy() { document.body.style.overflow = ''; }

  @HostListener('document:keydown.escape')
  onEsc() { this.close(); }

  close() { this.closed.emit(); }

  get safeBody(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.item.body ?? '');
  }
}
