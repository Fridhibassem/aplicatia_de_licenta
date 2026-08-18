import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private apiUrl = 'http://localhost:3000/api';

  form = {
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',
    animalType: '',
    subject:    '',
    message:    '',
    agree:      false
  };

  loading = false;
  successMsg = '';
  errorMsg   = '';

  constructor(private http: HttpClient) {}

  submitForm() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.form.firstName || !this.form.lastName || !this.form.email
        || !this.form.subject || !this.form.message) {
      this.errorMsg = 'Te rugăm să completezi toate câmpurile obligatorii.';
      return;
    }
    if (!this.form.agree) {
      this.errorMsg = 'Trebuie să accepți politica de confidențialitate.';
      return;
    }

    this.loading = true;
    this.http.post(`${this.apiUrl}/contact`, {
      firstName:  this.form.firstName,
      lastName:   this.form.lastName,
      email:      this.form.email,
      phone:      this.form.phone,
      animalType: this.form.animalType,
      subject:    this.form.subject,
      message:    this.form.message
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.successMsg = res?.message || 'Mesaj trimis cu succes! Te vom contacta în curând.';
        this.resetForm();
        setTimeout(() => this.successMsg = '', 6000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Eroare la trimitere. Te rugăm să încerci din nou.';
      }
    });
  }

  resetForm() {
    this.form = {
      firstName: '', lastName: '', email: '', phone: '',
      animalType: '', subject: '', message: '', agree: false
    };
  }
}
