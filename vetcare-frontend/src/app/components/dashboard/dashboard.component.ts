import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  stats: any = {};
  users: any[] = [];
  appointments: any[] = [];
  messages: any[] = [];

  loadingStats = true;
  loadingUsers = true;
  loadingAppts = true;
  loadingMessages = true;

  activeTab: 'overview' | 'users' | 'appointments' | 'messages' = 'overview';

  // filtru appointments
  apptFilter: 'all' | 'pending' | 'confirmed' | 'cancelled' = 'all';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAll();
  }

  private getHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  loadAll() {
    this.loadStats();
    this.loadUsers();
    this.loadAppointments();
    this.loadMessages();
  }

  loadStats() {
    this.loadingStats = true;
    this.http.get<any>(`${this.apiUrl}/dashboard/stats`, this.getHeaders()).subscribe({
      next: (data) => { this.stats = data; this.loadingStats = false; },
      error: (err) => { console.error('Stats:', err); this.loadingStats = false; }
    });
  }

  loadUsers() {
    this.loadingUsers = true;
    this.http.get<any[]>(`${this.apiUrl}/dashboard/users`, this.getHeaders()).subscribe({
      next: (data) => { this.users = data || []; this.loadingUsers = false; },
      error: (err) => { console.error('Users:', err); this.loadingUsers = false; }
    });
  }

  loadAppointments() {
    this.loadingAppts = true;
    this.http.get<any[]>(`${this.apiUrl}/dashboard/appointments`, this.getHeaders()).subscribe({
      next: (data) => { this.appointments = data || []; this.loadingAppts = false; },
      error: (err) => { console.error('Appts:', err); this.loadingAppts = false; }
    });
  }

  loadMessages() {
    this.loadingMessages = true;
    this.http.get<any[]>(`${this.apiUrl}/dashboard/messages`, this.getHeaders()).subscribe({
      next: (data) => { this.messages = data || []; this.loadingMessages = false; },
      error: (err) => { console.error('Messages:', err); this.loadingMessages = false; }
    });
  }

  setTab(tab: 'overview' | 'users' | 'appointments' | 'messages') {
    this.activeTab = tab;
  }

  // ── User actions ──
  deleteUser(id: string) {
    if (!confirm('Sigur vrei să ștergi acest user? Toate programările sale vor fi șterse.')) return;
    this.http.delete(`${this.apiUrl}/dashboard/users/${id}`, this.getHeaders()).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== id); this.loadStats(); }
    });
  }

  makeAdmin(id: string) {
    this.http.put(`${this.apiUrl}/dashboard/users/${id}/role`, { role: 'admin' }, this.getHeaders()).subscribe({
      next: () => { this.loadUsers(); this.loadStats(); }
    });
  }

  makeUser(id: string) {
    this.http.put(`${this.apiUrl}/dashboard/users/${id}/role`, { role: 'user' }, this.getHeaders()).subscribe({
      next: () => { this.loadUsers(); this.loadStats(); }
    });
  }

  // ── Appointment actions ──
  confirmAppt(id: string) {
    this.http.put(`${this.apiUrl}/dashboard/appointments/${id}/status`, { status: 'confirmed' }, this.getHeaders()).subscribe({
      next: () => { this.loadAppointments(); this.loadStats(); }
    });
  }

  cancelAppt(id: string) {
    if (!confirm('Sigur vrei să anulezi această programare?')) return;
    this.http.put(`${this.apiUrl}/dashboard/appointments/${id}/status`, { status: 'cancelled' }, this.getHeaders()).subscribe({
      next: () => { this.loadAppointments(); this.loadStats(); }
    });
  }

  deleteAppt(id: string) {
    if (!confirm('Ștergi DEFINITIV această programare?')) return;
    this.http.delete(`${this.apiUrl}/dashboard/appointments/${id}`, this.getHeaders()).subscribe({
      next: () => { this.loadAppointments(); this.loadStats(); }
    });
  }

  setApptFilter(f: 'all' | 'pending' | 'confirmed' | 'cancelled') {
    this.apptFilter = f;
  }

  get filteredAppointments() {
    if (this.apptFilter === 'all') return this.appointments;
    return this.appointments.filter(a => a.status === this.apptFilter);
  }

  // ── Messages ──
  toggleRead(msg: any) {
    if (msg.read) return;
    this.http.put(`${this.apiUrl}/dashboard/messages/${msg.id}/read`, {}, this.getHeaders()).subscribe({
      next: () => { msg.read = 1; this.loadStats(); }
    });
  }

  deleteMessage(id: string) {
    if (!confirm('Sigur vrei să ștergi acest mesaj?')) return;
    this.http.delete(`${this.apiUrl}/dashboard/messages/${id}`, this.getHeaders()).subscribe({
      next: () => { this.loadMessages(); this.loadStats(); }
    });
  }

  getStatusLabel(status: string): string {
    const map: any = { pending: 'În așteptare', confirmed: 'Confirmată', cancelled: 'Anulată' };
    return map[status] || status;
  }

  logout() { this.auth.logout(); }
  getCurrentUser() { return this.auth.getUser(); }
}
