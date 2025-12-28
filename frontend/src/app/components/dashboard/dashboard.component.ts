import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = {
    clients: 0,
    vehicules: 0,
    fiches: 0
  };

  recentFiches: any[] = [];

  constructor(
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.api.getStats().subscribe(data => {
      this.stats.clients = data.totalClients;
      this.stats.vehicules = data.totalVehicules;
      this.stats.fiches = data.totalFiches;
    });

    this.api.getRecentFiches().subscribe(data => {
      this.recentFiches = data;
    });
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
      case 'REPARE': return 'bg-green-100 text-green-700';
      case 'EN_COURS': return 'bg-yellow-100 text-yellow-700';
      case 'NON_REPARABLE': return 'bg-red-100 text-red-700';
      case 'A_REVOIR': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
