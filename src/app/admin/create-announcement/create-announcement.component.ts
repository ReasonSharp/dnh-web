import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { QuillEditorComponent } from 'ngx-quill';
import { ImagePickerComponent } from '../image-picker/image-picker.component';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [FormsModule, ImagePickerComponent, QuillEditorComponent],
  templateUrl: './create-announcement.component.html',
  styleUrl: './create-announcement.component.scss'
})
export class CreateAnnouncementComponent {
  blurb = '';
  imageUrl = '';
  mode: 'none' | 'link' | 'body' = 'none';
  link = '';
  title = '';
  body = '';
  message = '';
  success = false;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'video'],
      ['clean'],
    ],
  };

  constructor(private http: HttpClient) {}

  onEditorCreated(editor: any) {
    editor.getModule('toolbar').addHandler('video', () => {
      const url = prompt('Unesite URL videa:');
      if (!url) return;
      const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}` : url;
      const range = editor.getSelection(true);
      editor.clipboard.dangerouslyPasteHTML(
        range.index,
        `<iframe class="ql-video" src="${embedUrl}" frameborder="0" allowfullscreen="true"></iframe>`,
        'user',
      );
    });
  }

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
            type: 'announcement',
            blurb: this.blurb,
            imageURL: this.imageUrl,
            link: this.mode === 'link' ? this.link || null : null,
            title: this.mode === 'body' ? this.title || null : null,
            body: this.mode === 'body' ? this.body || null : null,
          },
          { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Objava uspješno dodana.' : 'Greška pri dodavanju.');
      if (res.success) {
        this.blurb = '';
        this.imageUrl = '';
        this.mode = 'none';
        this.link = '';
        this.title = '';
        this.body = '';
      }
    } catch {
      this.success = false;
      this.message = 'Greška pri dodavanju objave.';
    }
  }
}
