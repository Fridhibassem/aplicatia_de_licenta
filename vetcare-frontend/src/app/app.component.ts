import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  template: `
    <app-header *ngIf="showLayout"></app-header>
    <main class="page-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer *ngIf="showLayout"></app-footer>
  `,
  styles: [`.page-content { min-height: calc(100vh - 72px); }`]
})
export class AppComponent {
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.showLayout = !e.url.includes('/dashboard');
    });
  }
}
