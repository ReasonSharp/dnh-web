import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isLoggedIn = false;
  username = '';
  password = '';

  constructor(private dataService: DataService) {
    this.dataService.isLoggedIn.subscribe(val => this.isLoggedIn = val);
  }

  async login() {
    const res = await this.dataService.login(this.username, this.password);
    if (!res.success) {
      alert(res.message || 'Pogrešno korisničko ime ili lozinka.');
    }
  }
}
