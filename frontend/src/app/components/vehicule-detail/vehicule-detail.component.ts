import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, Vehicule } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicule-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './vehicule-detail.component.html',
  styleUrl: './vehicule-detail.component.css'
})
export class VehiculeDetailComponent implements OnInit {
  vehicule: Vehicule | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private location: Location,
    private auth: AuthService,
    private translate: TranslateService
  ) { }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getVehicule(+id).subscribe({
        next: (v) => {
          this.vehicule = v;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  getImmat(v: Vehicule): string {
    return `${v.immatriculationPart1}-${v.immatriculationPart2}-${v.immatriculationPart3}`;
  }

  deleteVehicule() {
    if (this.vehicule && confirm(this.translate.instant('VEHICLE_DETAIL.CONFIRM_DELETE'))) {
      this.api.deleteVehicule(this.vehicule.id!).subscribe({
        next: () => {
          if (this.vehicule?.client?.id) {
            this.router.navigate(['/clients', this.vehicule.client.id]);
          } else {
            this.router.navigate(['/search'], { queryParams: { type: 'vehicule' } });
          }
        },
        error: (err) => alert(this.translate.instant('COMMON.ERROR_DELETE'))
      });
    }
  }

  editVehicule() {
    if (this.vehicule) {
      this.router.navigate(['/vehicules/new', this.vehicule.client?.id], { queryParams: { id: this.vehicule.id } });
    }
  }

  goBack() {
    if (this.vehicule?.client?.id) {
      this.router.navigate(['/clients', this.vehicule.client.id]);
    } else {
      this.location.back();
    }
  }
}
