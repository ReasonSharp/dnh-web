import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-details.component.html',
  styleUrl: './edit-details.component.scss'
})
export class EditDetailsComponent implements OnInit {
  name = '';
  message = '';
  success = false;
  loading = true;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      const res = await firstValueFrom(
        this.http.get<{ success: boolean; username: string; name: string }>(
          '/api/user_details.php', { withCredentials: true }
        )
      );
      if (res.success) this.name = res.name;
    } catch {
      this.message = 'Greška pri učitavanju podataka.';
      this.success = false;
    } finally {
      this.loading = false;
    }
  }

  async save() {
    try {
      const res = await firstValueFrom(
        this.http.post<{ success: boolean; message?: string }>(
          '/api/user_details.php', { name: this.name }, { withCredentials: true }
        )
      );
      this.success = res.success;
      this.message = res.message ?? (res.success ? 'Podaci uspješno ažurirani.' : 'Greška pri spremanju.');
    } catch {
      this.success = false;
      this.message = 'Greška pri spremanju podataka.';
    }
  }
}
