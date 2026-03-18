
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'dnh-web';
  today: Date = new Date();
  protected menuState: 'open' | 'closed' = 'closed';

  toggle() {
    if (this.menuState == 'open') this.menuState = 'closed';
    else this.menuState = 'open';
  }
}
