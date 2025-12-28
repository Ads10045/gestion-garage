import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService, FicheTechnique, PageResponse } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fiche-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './visite-list.component.html',
  styleUrl: './visite-list.component.css'
})
export class FicheListComponent implements OnInit {
  fiches: FicheTechnique[] = [];
  query: string = '';

  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 10;

  constructor(private api: ApiService, private auth: AuthService) { }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit(): void {
    this.loadFiches();
  }

  loadFiches(page: number = 0): void {
    this.api.getFiches(page, this.pageSize, this.query).subscribe({
      next: (res) => {
        this.fiches = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
      },
      error: (err) => console.error('Error loading fiches:', err)
    });
  }

  onSearch(): void {
    this.loadFiches(0);
  }

  deleteFiche(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fiche technique ?')) {
      this.api.deleteFiche(id).subscribe({
        next: () => {
          this.loadFiches(this.currentPage);
        },
        error: (err) => alert('Erreur lors de la suppression de la fiche')
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadFiches(page);
    }
  }

  getStatutLabel(statut: string): string {
    switch (statut) {
      case 'REPARE': return 'COMMON.STATUS.REPARE';
      case 'EN_COURS': return 'COMMON.STATUS.EN_COURS';
      case 'NON_REPARABLE': return 'COMMON.STATUS.NON_REPARABLE';
      case 'A_REVOIR': return 'COMMON.STATUS.A_REVOIR';
      default: return statut || 'N/A';
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'REPARE': return 'bg-green-100 text-green-800';
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-800';
      case 'NON_REPARABLE': return 'bg-red-100 text-red-800';
      case 'A_REVOIR': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getGraviteClass(gravite: string): string {
    switch (gravite) {
      case 'CRITIQUE': return 'bg-red-100 text-red-800';
      case 'MAJEURE': return 'bg-orange-100 text-orange-800';
      case 'MINEURE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
