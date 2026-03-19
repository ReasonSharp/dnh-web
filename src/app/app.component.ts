
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    host: { '(document:click)': 'onClick($event)' }
})
export class AppComponent {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  title = 'dnh-web';
  today: Date = new Date();
  protected menuState: 'open' | 'closed' = 'closed';

  toggle() {
    if (this.menuState == 'open') this.menuState = 'closed';
    else this.menuState = 'open';
  }

  navigate(where: string) {
    console.log(where);
  }

  onClick(event: Event) {
    if (!this.dropdownMenu.nativeElement.contains(event.target))
      this.menuState = 'closed';
  }
}
