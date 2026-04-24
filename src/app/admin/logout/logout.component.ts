import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/services/data.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private dataService: DataService, private router: Router) {}

  logout() {
    this.dataService.logout();
    this.router.navigate(['/admin']);
  }
}
