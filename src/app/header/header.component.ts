import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { '(document:click)': 'onClick($event)' }
})
export class HeaderComponent {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  protected menuState: 'open' | 'closed' = 'closed';
  protected activeLink: string = 'home';

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  navigate(where: string) {
    if (this.activeLink != where) {
      this.activeLink = where;
      if (where == "home") this.router.navigate([ '' ]);
      else this.router.navigate([ where ]);
      this.menuState = "closed";
    }
  }

  toggle() {
    if (this.menuState == 'open') this.menuState = 'closed';
    else this.menuState = 'open';
  }

  onClick(event: Event) {
    if (!this.dropdownMenu.nativeElement.contains(event.target))
      this.menuState = 'closed';
  }
}
