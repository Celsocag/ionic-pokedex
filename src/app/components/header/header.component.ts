import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  menuOpen = false;
  dropdownTop = 0;
  dropdownLeft = 0;

  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef;
  @ViewChild('dropdownMenu', { read: ElementRef }) dropdownMenu?: ElementRef;

  constructor() { }

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  ngAfterViewInit() {
    // Nada por enquanto
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen && this.menuButton) {
      const rect = this.menuButton.nativeElement.getBoundingClientRect();
      this.dropdownTop = rect.bottom + window.scrollY;
      this.dropdownLeft = rect.left + window.scrollX;
      setTimeout(() => {
        const firstItem = document.querySelector('.dropdown-menu ion-item');
        if (firstItem) (firstItem as HTMLElement).focus();
      }, 0);
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }

  handleKeydown = (event: KeyboardEvent) => {
    if (this.menuOpen) {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
      // Navegação por setas
      const items = Array.from(document.querySelectorAll('.dropdown-menu ion-item')) as HTMLElement[];
      const active = document.activeElement as HTMLElement;
      const idx = items.indexOf(active);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = items[idx + 1] || items[0];
        next.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prev = items[idx - 1] || items[items.length - 1];
        prev.focus();
      }
    }
  }
}
