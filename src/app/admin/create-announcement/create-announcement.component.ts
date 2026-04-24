import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImagePickerComponent } from '../image-picker/image-picker.component';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [FormsModule, ImagePickerComponent],
  templateUrl: './create-announcement.component.html',
  styleUrl: './create-announcement.component.scss'
})
export class CreateAnnouncementComponent {
  blurb = '';
  imageUrl = '';
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
          { type: 'announcement', blurb: this.blurb, imageURL: this.imageUrl, body: this.body || null },
          { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Objava uspješno dodana.' : 'Greška pri dodavanju.');
      if (res.success) {
        this.blurb = '';
        this.imageUrl = '';
        this.body = '';
      }
    } catch {
      this.success = false;
      this.message = 'Greška pri dodavanju objave.';
    }
  }
}
