import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  user: any = null;
  appointments: any[] = [];
  loading = true;

  activeTab: 'info' | 'appointments' | 'security' = 'info';

  // edit nume
  editingName = false;
  nameForm = '';
  nameLoading = false;
  nameError = '';
  nameSuccess = '';

  // change password
  pwForm = { current: '', new: '', confirm: '' };
  pwLoading = false;
  pwError = '';
  pwSuccess = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }
    this.nameForm = this.user.name || '';
    this.loadAppointments();
  }

  private getHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  loadAppointments() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/appointments/mine`, this.getHeaders()).subscribe({
      next: (data) => {
        this.appointments = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Appointments error:', err);
        this.loading = false;
      }
    });
  }

  setTab(tab: 'info' | 'appointments' | 'security') {
    this.activeTab = tab;
  }

  // ── nume ──
  startEditName() {
    this.editingName = true;
    this.nameForm = this.user.name || '';
    this.nameError = '';
    this.nameSuccess = '';
  }

  cancelEditName() {
    this.editingName = false;
    this.nameForm = this.user.name || '';
  }

  saveName() {
    if (!this.nameForm.trim()) {
      this.nameError = 'Numele nu poate fi gol.';
      return;
    }
    this.nameLoading = true;
    this.nameError = '';
    this.http.put<any>(`${this.apiUrl}/auth/profile`, { name: this.nameForm.trim() }, this.getHeaders()).subscribe({
      next: (res) => {
        this.user = res;
        localStorage.setItem('user', JSON.stringify(res));
        this.editingName = false;
        this.nameLoading = false;
        this.nameSuccess = 'Nume actualizat!';
        setTimeout(() => this.nameSuccess = '', 3000);
      },
      error: (err) => {
        this.nameLoading = false;
        this.nameError = err.error?.message || 'Eroare la salvare.';
      }
    });
  }

  // ── parola ──
  changePassword() {
    this.pwError = '';
    this.pwSuccess = '';

    if (!this.pwForm.current || !this.pwForm.new || !this.pwForm.confirm) {
      this.pwError = 'Completează toate câmpurile.';
      return;
    }
    if (this.pwForm.new.length < 8) {
      this.pwError = 'Parola nouă trebuie să aibă minim 8 caractere.';
      return;
    }
    if (this.pwForm.new !== this.pwForm.confirm) {
      this.pwError = 'Parolele noi nu coincid.';
      return;
    }

    this.pwLoading = true;
    this.http.put(`${this.apiUrl}/auth/change-password`, {
      currentPassword: this.pwForm.current,
      newPassword:     this.pwForm.new
    }, this.getHeaders()).subscribe({
      next: () => {
        this.pwLoading = false;
        this.pwSuccess = 'Parola a fost schimbată cu succes!';
        this.pwForm = { current: '', new: '', confirm: '' };
        setTimeout(() => this.pwSuccess = '', 4000);
      },
      error: (err) => {
        this.pwLoading = false;
        this.pwError = err.error?.message || 'Eroare la schimbarea parolei.';
      }
    });
  }

  // ── programari ──
  cancelAppointment(id: string) {
    if (!confirm('Sigur vrei să anulezi această programare?')) return;
    this.http.delete(`${this.apiUrl}/appointments/${id}`, this.getHeaders()).subscribe({
      next: () => { this.loadAppointments(); },
      error: (err) => { alert(err.error?.message || 'Eroare la anulare.'); }
    });
  }

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  isCancellable(appt: any): boolean {
    return appt.status !== 'cancelled' && !this.isPast(appt.date);
  }

  getStatusLabel(status: string): string {
    const map: any = {
      pending:   'În așteptare',
      confirmed: 'Confirmată',
      cancelled: 'Anulată'
    };
    return map[status] || status;
  }

  logout() {
    this.auth.logout();
  }
}
