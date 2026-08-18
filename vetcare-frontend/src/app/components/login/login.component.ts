import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  tab      = 'login';
  showPass = false;
  loginError = '';
  loading  = false;

  login = { email: '', password: '', remember: false };
  reg   = { firstName: '', lastName: '', email: '', phone: '', password: '', agree: false };

  features = [
    { icon: 'fa-solid fa-calendar-check', text: 'Gestionează programările online' },
    { icon: 'fa-solid fa-file-medical',   text: 'Acces la dosarul medical complet' },
    { icon: 'fa-solid fa-bell',           text: 'Notificări pentru vaccinuri & tratamente' },
    { icon: 'fa-solid fa-paw',            text: 'Profiluri pentru fiecare animal' }
  ];

  constructor(private auth: AuthService, private router: Router) {}

  doLogin() {
    if (!this.login.email || !this.login.password) {
      this.loginError = 'Completează email-ul și parola.';
      return;
    }
    this.loading = true;
    this.loginError = '';

    this.auth.login(this.login.email, this.login.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.loginError = err.error?.message || 'Eroare la autentificare.';
      }
    });
  }

  doRegister() {
  if (!this.reg.agree) {
    alert('Trebuie să fii de acord cu Termenii și Condițiile.');
    return;
  }
  if (!this.reg.email || !this.reg.password) {
    alert('Email și parola sunt obligatorii!');
    return;
  }
  this.loading = true;
  const name = `${this.reg.firstName} ${this.reg.lastName}`.trim();

  this.auth.register(this.reg.email, this.reg.password, name).subscribe({
    next: () => {
      this.loading = false;
      alert('✅ Cont creat cu succes! Te poți autentifica acum.');
      this.tab = 'login';
      this.login.email = this.reg.email;
    },
    error: (err) => {
      this.loading = false;
      alert('❌ ' + (err.error?.message || 'Eroare la înregistrare.'));
    }
  });
}
}