import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImagePickerComponent } from '../image-picker/image-picker.component';

@Component({
  selector: 'app-create-news',
  standalone: true,
  imports: [FormsModule, ImagePickerComponent],
  templateUrl: './create-news.component.html',
  styleUrl: './create-news.component.scss'
})
export class CreateNewsComponent {
  blurb = '';
  imageUrl = '';
  mode: 'none' | 'link' | 'body' = 'none';
  link = '';
  body = '';
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

  async submit() {
    if (!this.blurb.trim() || !this.imageUrl) {
      this.success = false;
      this.message = 'Tagline i slika su obavezni.';
      return;
    }
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message?: string }>(
          '/api/create_post.php',
          {
            type: 'news',
            blurb: this.blurb,
            imageURL: this.imageUrl,
            link: this.mode === 'link' ? this.link || null : null,
            body: this.mode === 'body' ? this.body || null : null,
          },
          { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Vijest uspješno dodana.' : 'Greška pri dodavanju.');
      if (res.success) {
        this.blurb = '';
        this.imageUrl = '';
        this.mode = 'none';
        this.link = '';
        this.body = '';
      }
    } catch {
      this.success = false;
      this.message = 'Greška pri dodavanju vijesti.';
    }
  }
}
