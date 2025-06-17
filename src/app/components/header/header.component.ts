import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit {

  menuOpen = false;
  dropdownTop = 0;
  dropdownLeft = 0;

  @ViewChild('menuButton', { read: ElementRef }) menuButton!: ElementRef; // <-- aqui

  constructor() { }

  ngOnInit() {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen && this.menuButton) {
      const rect = this.menuButton.nativeElement.getBoundingClientRect();
      this.dropdownTop = rect.bottom + window.scrollY; // posição vertical logo abaixo do botão
      this.dropdownLeft = rect.left + window.scrollX;  // posição horizontal alinhada ao botão
    }
  }

  closeMenu() {
    this.menuOpen = false;
  }
}
