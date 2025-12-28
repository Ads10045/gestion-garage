import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Client, Vehicule } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchType: 'client' | 'vehicule' = 'client';

  // Client Search
  clientQuery: string = '';
  clientResults: Client[] = [];

  // Vehicle Search
  vehiculePart1: string = '';
  vehiculePart2: string = '';
  vehiculePart3: string = '';
  vehiculeResults: Vehicule[] = [];

  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  totalElements: number = 0;
  pageSize: number = 10;

  constructor(private api: ApiService, private route: ActivatedRoute, private auth: AuthService) { }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit() {
    // Handle query params to switch tab
    this.route.queryParams.subscribe(params => {
      if (params['type']) {
        this.searchType = params['type'];
      }

      // Load initial 10 clients if no search has been performed yet
      if (this.clientResults.length === 0 && this.vehiculeResults.length === 0) {
        this.loadInitialClients();
      }
    });
  }

  loadInitialClients() {
    this.api.getClients('', 0, this.pageSize).subscribe(page => {
      this.clientResults = page.content;
      this.totalPages = page.totalPages;
      this.totalElements = page.totalElements;
      this.currentPage = page.number;
    });
  }

  searchClients(page: number = 0) {
    this.currentPage = page;
    console.log(`Searching clients with query: ${this.clientQuery}, page: ${page}`);
    this.api.getClients(this.clientQuery, page, this.pageSize).subscribe({
      next: (res) => {
        this.clientResults = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.vehiculeResults = [];
      },
      error: (err) => console.error('Error fetching clients:', err)
    });
  }

  searchVehicules(page: number = 0) {
    this.currentPage = page;
    console.log(`Searching vehicles with parts: ${this.vehiculePart1}-${this.vehiculePart2}-${this.vehiculePart3}, page: ${page}`);
    this.api.getVehicules(this.vehiculePart1, this.vehiculePart2, this.vehiculePart3, page, this.pageSize).subscribe({
      next: (res) => {
        this.vehiculeResults = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.currentPage = res.number;
        this.clientResults = [];
      },
      error: (err) => console.error('Error fetching vehicles:', err)
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      if (this.searchType === 'client') {
        this.searchClients(page);
      } else {
        this.searchVehicules(page);
      }
    }
  }

  formatImmatriculation(v: Vehicule): string {
    return `${v.immatriculationPart1}-${v.immatriculationPart2}-${v.immatriculationPart3}`;
  }
}
