import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  success = false;

  constructor(private dataService: DataService) {}

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Nove lozinke se ne podudaraju.';
      this.success = false;
      return;
    }
    const res = await this.dataService.changePassword(this.oldPassword, this.newPassword);
    this.success = res.success;
    this.message = res.success
      ? 'Lozinka uspješno promijenjena.'
      : (res.message || 'Greška pri promjeni lozinke.');
    if (res.success) {
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
}
