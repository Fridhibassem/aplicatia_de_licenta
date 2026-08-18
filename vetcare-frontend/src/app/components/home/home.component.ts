import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  stars = [1,2,3,4,5];

  stats = [
    { value: '10+', label: 'Ani Experiență' },
    { value: '5K+', label: 'Pacienți Tratați' },
    { value: '4',   label: 'Medici Veterinari' },
    { value: '98%', label: 'Clienți Mulțumiți' }
  ];

  services = [
    { icon: 'fa-solid fa-stethoscope',  title: 'Consultații Generale',   desc: 'Evaluări complete ale stării de sănătate, diagnosticare precoce și recomandări personalizate.',  color: 'rgba(45,80,22,0.10)' },
    { icon: 'fa-solid fa-syringe',      title: 'Vaccinări & Prevenție',  desc: 'Scheme complete de vaccinare adaptate speciei și stilului de viață al animalului.',             color: 'rgba(200,146,58,0.12)' },
    { icon: 'fa-solid fa-heart-pulse',  title: 'Chirurgie Veterinară',   desc: 'Intervenții chirurgicale de rutință și complexe, cu echipamente de ultimă generație.',          color: 'rgba(90,138,53,0.12)' },
    { icon: 'fa-solid fa-x-ray',        title: 'Radiologie & Ecografie', desc: 'Imagistică medicală avansată pentru diagnostic rapid și precis.',                               color: 'rgba(45,80,22,0.10)' },
    { icon: 'fa-solid fa-pills',        title: 'Laborator Propriu',      desc: 'Analize de sânge, urină și alte teste cu rezultate rapide.',                                    color: 'rgba(200,146,58,0.12)' },
    { icon: 'fa-solid fa-scissors',     title: 'Grooming & Îngrijire',   desc: 'Toaletare profesională, tratamente anti-paraziți și îngrijire estetică.',                       color: 'rgba(90,138,53,0.12)' }
  ];

  whyUs = [
    { title: 'Medici veterinari specializați', desc: 'Fiecare doctor are specializări în domenii specifice pentru cel mai bun tratament.' },
    { title: 'Echipamente moderne',            desc: 'Investim constant în tehnologie pentru diagnostic și tratament de calitate.' },
    { title: 'Abordare blândă și empatică',    desc: 'Înțelegem că animalele se simt vulnerabile. Creăm un mediu calm și sigur.' },
    { title: 'Urgențe 24/7',                   desc: 'Suntem disponibili oricând pentru urgențele animalelor dumneavoastră.' }
  ];

  testimonials = [
    { text: 'Cel mai bun cabinet veterinar din Constanța! Au salvat pisica mea după un accident grav. Profesioniști adevărați!', name: 'Maria Ionescu',    pet: 'Mama lui Whiskers 🐱' },
    { text: 'Atmosfera este caldă și primitoare. Câinele meu, care era extrem de fricos la vet, acum intră liniștit.',           name: 'Andrei Popa',      pet: 'Stăpânul lui Rex 🐶' },
    { text: 'Recomand cu toată încrederea! Explicațiile medicilor sunt clare și complete. Mă simt mereu informat.',              name: 'Elena Dumitrescu', pet: 'Mama lui Luna 🐰' }
  ];
}
