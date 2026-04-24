import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImagePickerComponent } from '../image-picker/image-picker.component';

interface PostItem {
  id: number;
  date: string;
  blurb: string;
  imageURL: string | null;
  body: string | null;
}

@Component({
  selector: 'app-edit-announcement',
  standalone: true,
  imports: [FormsModule, ImagePickerComponent],
  templateUrl: './edit-announcement.component.html',
  styleUrl: './edit-announcement.component.scss'
})
export class EditAnnouncementComponent implements OnInit {
  posts: PostItem[] = [];
  selectedId: number | null = null;
  blurb = '';
  imageUrl = '';
  body = '';
  assetImageWarning = false;
  message = '';
  success = false;
  loading = true;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.posts = await firstValueFrom(
        this.http.get<PostItem[]>('/api/get_posts.php?type=announcement', { withCredentials: true })
      );
    } finally {
      this.loading = false;
    }
  }

  onSelect(id: number | null) {
    if (id === null) return;
    const post = this.posts.find(p => p.id === id);
    if (!post) return;
    this.blurb = post.blurb;
    this.body = post.body ?? '';
    this.message = '';
    const url = post.imageURL ?? '';
    if (url.startsWith('/assets/') || url.startsWith('assets/')) {
      this.imageUrl = '';
      this.assetImageWarning = true;
    } else {
      this.imageUrl = url;
      this.assetImageWarning = false;
    }
  }

  dropdownLabel(post: PostItem): string {
    const blurb = post.blurb.length > 70 ? post.blurb.substring(0, 70) + '…' : post.blurb;
    return `${post.date} – ${blurb}`;
  }

  async save() {
    if (this.selectedId === null) return;
    if (!this.blurb.trim() || !this.imageUrl) {
      this.success = false;
      this.message = 'Tagline i slika su obavezni.';
      return;
    }
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message?: string }>(
          '/api/update_post.php',
          { type: 'announcement', id: this.selectedId, blurb: this.blurb, imageURL: this.imageUrl, body: this.body || null },
          { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Promjene uspješno spremljene.' : 'Greška pri spremanju.');
      if (res.success) {
        const post = this.posts.find(p => p.id === this.selectedId);
        if (post) {
          post.blurb = this.blurb;
          post.imageURL = this.imageUrl;
          post.body = this.body || null;
          this.assetImageWarning = false;
        }
      }
    } catch {
      this.success = false;
      this.message = 'Greška pri spremanju promjena.';
    }
  }
}
