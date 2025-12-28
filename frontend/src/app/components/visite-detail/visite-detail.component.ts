import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Added Location
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService, FicheTechnique, Etat } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; // Added Translate

@Component({
  selector: 'app-fiche-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule], // Added TranslateModule
  templateUrl: './visite-detail.component.html',
  styleUrl: './visite-detail.component.css'
})
export class FicheDetailComponent implements OnInit {
  fiche: FicheTechnique | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private translate: TranslateService,
    private location: Location // Restored Location
  ) { }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getFiche(+id).subscribe({
        next: (f) => {
          this.fiche = f;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  goBack() {
    this.location.back();
  }

  deleteFiche() {
    if (this.fiche && confirm('Êtes-vous sûr de vouloir supprimer cette fiche ?')) {
      this.api.deleteFiche(this.fiche.id!).subscribe({
        next: () => {
          if (this.fiche?.vehicule?.id) {
            this.router.navigate(['/vehicules', this.fiche.vehicule.id]);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => alert('Erreur lors de la suppression de la fiche')
      });
    }
  }

  editFiche() {
    if (this.fiche) {
      this.router.navigate(['/fiches/new', this.fiche.vehicule?.id], { queryParams: { id: this.fiche.id } });
    }
  }

  printReport() {
    window.print();
  }

  getEtatLabel(etat: string | undefined): string {
    switch (etat) {
      case 'BON': return 'COMMON.ETAT.BON';
      case 'MOYEN': return 'COMMON.ETAT.MOYEN';
      case 'MAUVAIS': return 'COMMON.ETAT.MAUVAIS';
      default: return etat || 'N/A';
    }
  }

  getEtatClass(etat: string | undefined): string {
    switch (etat) {
      case 'BON': return 'text-green-600';
      case 'MOYEN': return 'text-yellow-600';
      case 'MAUVAIS': return 'text-red-600';
      default: return 'text-gray-400';
    }
  }

  getStatutLabel(statut: string | undefined): string {
    switch (statut) {
      case 'REPARE': return 'COMMON.STATUS.REPARE';
      case 'EN_COURS': return 'COMMON.STATUS.EN_COURS';
      case 'NON_REPARABLE': return 'COMMON.STATUS.NON_REPARABLE';
      case 'A_REVOIR': return 'COMMON.STATUS.A_REVOIR';
      default: return statut || 'N/A';
    }
  }

  getCoutTotal(): number {
    return (this.fiche?.coutPieces || 0) + (this.fiche?.coutMainOeuvre || 0);
  }
}
