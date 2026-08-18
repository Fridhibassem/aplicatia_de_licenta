import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  scrolled = false;
  menuOpen = false;

  constructor(private auth: AuthService) {}

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 60; }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu()  { this.menuOpen = false; }
  isLoggedIn() { return this.auth.isLoggedIn(); }
  isAdmin()    { return this.auth.isAdmin(); }
  logout()     { this.auth.logout(); }
}