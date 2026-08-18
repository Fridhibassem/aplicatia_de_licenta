import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  values = [
    { icon: 'fa-solid fa-heart',      title: 'Compasiune',      desc: 'Tratăm fiecare animal cu blândețe și empatie, înțelegând că sunt membrii familiei voastre.' },
    { icon: 'fa-solid fa-trophy',     title: 'Excelență',       desc: 'Ne menținem la curent cu ultimele evoluții din medicina veterinară prin formare continuă.' },
    { icon: 'fa-solid fa-handshake',  title: 'Transparență',    desc: 'Comunicăm clar diagnosticele, opțiunile de tratament și costurile, fără surprize.' },
    { icon: 'fa-solid fa-leaf',       title: 'Responsabilitate',desc: 'Contribuim activ la educarea comunității privind bunăstarea și protecția animalelor.' }
  ];

  team = [
    { name: 'Dr. Andreea Marinescu', role: 'Medic Veterinar Principal', bio: 'Specialist în medicină internă și oncologie veterinară, cu 12 ani de experiență clinică.',           photo: 'assets/images/team-dr1.jpg', initials: 'AM', specialties: ['Medicină Internă','Oncologie','Cardiologie'] },
    { name: 'Dr. Cristian Florea',   role: 'Chirurg Veterinar',         bio: 'Expert în chirurgie ortopedică și neurochirurgie, absolvent al Universității USAMV București.',       photo: 'assets/images/team-dr2.jpg', initials: 'CF', specialties: ['Chirurgie Ortopedică','Neurochirurgie','Chirurgie Moale'] },
    { name: 'Dr. Ioana Stancu',      role: 'Medic Veterinar',           bio: 'Pasionată de dermatologie veterinară și alergologie, cu formare la clinici din Germania.',            photo: 'assets/images/team-dr3.jpg', initials: 'IS', specialties: ['Dermatologie','Alergologie','Oftalmologie'] },
    { name: 'Dr. Mihai Duță',        role: 'Medic Veterinar',           bio: 'Specialist în animale exotice și reptile, aduce un profil unic echipei VetCare.',                    photo: 'assets/images/team-dr4.jpg', initials: 'MD', specialties: ['Animale Exotice','Reptile','Dentisterie'] }
  ];
}
