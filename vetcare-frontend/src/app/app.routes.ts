import { Routes } from '@angular/router';
import { HomeComponent }      from './components/home/home.component';
import { AboutComponent }     from './components/about/about.component';
import { ContactComponent }   from './components/contact/contact.component';
import { LoginComponent }     from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent }   from './components/profile/profile.component';
import { authGuard }          from './guards/auth.guard';
import { adminGuard }         from './guards/admin.guard';
import { ProgramareComponent } from './components/programare/programare.component';
export const routes: Routes = [
  { path: 'programare', component: ProgramareComponent, canActivate: [authGuard] },
  { path: '',          component: HomeComponent },
  { path: 'about',     component: AboutComponent },
  { path: 'contact',   component: ContactComponent },
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'profile',   component: ProfileComponent,   canActivate: [authGuard] },
  { path: '**',        redirectTo: '' }
];