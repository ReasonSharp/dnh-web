import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent {
  selectedFile: File | null = null;
  name = '';
  message = '';
  success = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  async uploadFile() {
    if (!this.selectedFile) {
      this.success = false;
      this.message = 'Odaberite datoteku.';
      return;
    }
    if (!this.name.trim()) {
      this.success = false;
      this.message = 'Naziv je obavezan.';
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('type', 'document');
    formData.append('name', this.name);
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message?: string; url?: string }>(
          '/api/upload.php', formData, { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.success
        ? `Uploadano: ${res.url}`
        : (res.message || 'Greška pri uploadu.');
      if (res.success) {
        this.selectedFile = null;
        this.name = '';
      }
    } catch {
      this.success = false;
      this.message = 'Greška pri uploadu dokumenta.';
    }
  }
}
