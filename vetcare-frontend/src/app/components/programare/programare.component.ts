import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './programare.component.html',
  styleUrls: ['./programare.component.css']
})
export class ProgramareComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  // Calendar
  currentDate  = new Date();
  selectedDate: Date | null = null;
  selectedHour: string | null = null;
  calendarDays: any[] = [];
  occupiedSlots: string[] = [];

  // Form
  form = {
    animalType: '',
    service:    '',
    message:    ''
  };

  animalTypes = ['Câine','Pisică','Iepure','Pasăre','Reptilă','Animal Exotic','Altul'];
  services    = ['Consultație Generală','Vaccinare','Chirurgie','Radiologie','Laborator','Grooming','Altul'];
  hours       = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
                 '12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30',
                 '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];

  submitted = false;
  loading   = false;
  error     = '';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.generateCalendar();
  }

  getHeaders() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  generateCalendar() {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    this.calendarDays = [];
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
      this.calendarDays.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      this.calendarDays.push({
        date,
        day: d,
        isPast:    date < today,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isToday:   date.toDateString() === today.toDateString()
      });
    }
  }

  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.selectedDate = null;
    this.selectedHour = null;
    this.occupiedSlots = [];
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.selectedDate = null;
    this.selectedHour = null;
    this.occupiedSlots = [];
    this.generateCalendar();
  }

  selectDate(day: any) {
    if (!day || day.isPast || day.isWeekend) return;
    this.selectedDate = day.date;
    this.selectedHour = null;
    this.loadOccupiedSlots();
  }

  loadOccupiedSlots() {
    if (!this.selectedDate) return;
    const dateStr = this.selectedDate.toISOString().split('T')[0];
    this.http.get<string[]>(`${this.apiUrl}/appointments/occupied?date=${dateStr}`, this.getHeaders()).subscribe({
      next: (slots) => { this.occupiedSlots = slots; },
      error: () => { this.occupiedSlots = []; }
    });
  }

  isOccupied(hour: string) {
    return this.occupiedSlots.includes(hour);
  }

  selectHour(hour: string) {
    if (this.isOccupied(hour)) return;
    this.selectedHour = hour;
  }

  getMonthName() {
    return this.currentDate.toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' });
  }

  submit() {
    if (!this.selectedDate || !this.selectedHour || !this.form.animalType || !this.form.service) {
      this.error = 'Completează toate câmpurile obligatorii!';
      return;
    }
    this.loading = true;
    this.error   = '';

    const dateTime = new Date(this.selectedDate);
    const [h, m]   = this.selectedHour.split(':');
    dateTime.setHours(+h, +m, 0, 0);

    const user = this.auth.getUser();
    const body = {
      userId:     user.id,
      date:       dateTime.toISOString(),
      service:    this.form.service,
      animalType: this.form.animalType,
      message:    this.form.message,
      status:     'pending'
    };

    this.http.post(`${this.apiUrl}/appointments`, body, this.getHeaders()).subscribe({
      next: () => {
        this.loading   = false;
        this.submitted = true;
      },
      error: (err) => {
        this.loading = false;
        this.error   = err.error?.message || 'Eroare la programare.';
      }
    });
  }
}