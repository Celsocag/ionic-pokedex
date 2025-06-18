import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {

  menuOpen = false;
  dropdownTop = 0;
  dropdownLeft = 0;

  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef;

  constructor() { }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen && this.menuButton) {
      const rect = this.menuButton.nativeElement.getBoundingClientRect();
      this.dropdownTop = rect.bottom + window.scrollY;
      this.dropdownLeft = rect.left + window.scrollX;
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
