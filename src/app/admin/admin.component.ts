import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isLoggedIn: boolean = false;
  username: string = '';
  password: string = '';
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  selectedFile: File | null = null;
  uploadMessage: string = '';
  changePassMessage: string = '';

  constructor(private dataService: DataService, private http: HttpClient) {
    this.dataService.isLoggedIn.subscribe(val => this.isLoggedIn = val);
  }

  async login() {
    const res = await this.dataService.login(this.username, this.password);
    if (!res.success) {
      alert(res.message || 'Login failed');
    }
  }

  logout() {
    this.dataService.logout();
  }

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.changePassMessage = 'Passwords do not match';
      return;
    }
    const res = await this.dataService.changePassword(this.oldPassword, this.newPassword);
    this.changePassMessage = res.success ? 'Password changed successfully' : (res.message || 'Error changing password');
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('type', 'image');

    try {
      const res = await firstValueFrom(
        this.http.post<{success: boolean, message?: string, url?: string}>(
          '/api/upload.php',
          formData,
          { withCredentials: true }
        )
      );
      this.uploadMessage = res.success ? `Uploaded: ${res.url}` : (res.message || 'Upload error');
    } catch (e) {
      this.uploadMessage = 'Upload error';
    }
  }
}
