import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  host: { '(document:click)': 'onClick($event)' }
})
export class NavbarComponent {
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  protected menuState: 'open' | 'closed' = 'closed';
  protected activeLink: string = 'home';
  protected needsBurger: boolean = window.innerWidth < 992;
  protected burgerState: string = 'collapsed';

  constructor(private router: Router) {
  }

  @HostListener('window:resize')
  onResize() {
    this.needsBurger = window.innerWidth < 992;
    console.log(this.needsBurger);
  }

  navigate(where: string) {
    if (this.activeLink != where) {
      this.activeLink = where;
      this.router.navigate([ where ]);
      this.menuState = "closed";
      if (this.needsBurger) this.burgerState = 'collapsed';
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

  clickBurger() {
    console.log('burger');
    if (this.burgerState == 'collapsed') this.burgerState = 'expanded';
    else this.burgerState = 'collapsed';
  }
}
