import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { INewsItem } from 'src/models/news-item.model';
import { IAnnouncement } from 'src/models/announcement.model';

@Component({
  selector: 'app-article-modal',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './article-modal.component.html',
  styleUrl: './article-modal.component.scss'
})
export class ArticleModalComponent implements OnInit, OnDestroy {
  @Input({ required: true }) item!: INewsItem | IAnnouncement;
  @Output() closed = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit()    { document.body.style.overflow = 'hidden'; }
  ngOnDestroy() { document.body.style.overflow = ''; }

  @HostListener('click')
  onBackdropClick() { this.close(); }

  @HostListener('document:keydown.escape')
  onEsc() { this.close(); }

  close() { this.closed.emit(); }

  get safeBody(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.processBody(this.item.body ?? ''));
  }

  private processBody(html: string): string {
    // Quill may serialize video embeds as <a> links; convert YouTube embed URLs to iframes
    return html.replace(
      /<a\s[^>]*href="(https?:\/\/(?:www\.)?youtube\.com\/embed\/[^"]+)"[^>]*>.*?<\/a>/gi,
      '<iframe src="$1" frameborder="0" allowfullscreen style="width:100%;aspect-ratio:16/9;"></iframe>'
    );
  }
}
