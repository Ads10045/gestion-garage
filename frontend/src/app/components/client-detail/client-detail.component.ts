import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService, Client } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="px-4 py-6 sm:px-0" *ngIf="client; else loadingTpl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tighter">{{ 'CLIENT_DETAIL.TITLE' | translate }}</h1>
          <p class="text-gray-500 font-medium">{{ 'CLIENT_DETAIL.SUBTITLE' | translate }}</p>
        </div>
        <div class="flex gap-3">
          <div class="flex gap-3" *ngIf="isAdmin">
            <button (click)="editClient()" class="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-100 text-sm font-bold text-blue-600 rounded-xl hover:bg-blue-100 transition-all shadow-sm">
              {{ 'CLIENT_DETAIL.MODIFY' | translate }}
            </button>
            <button (click)="deleteClient()" class="inline-flex items-center px-4 py-2 bg-red-50 border border-red-100 text-sm font-bold text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm">
              {{ 'CLIENT_DETAIL.DELETE' | translate }}
            </button>
          </div>
          <button (click)="goBack()" class="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {{ 'CLIENT_DETAIL.BACK' | translate }}
          </button>
        </div>
      </div>

      <!-- Client Info Card -->
      <div class="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <h2 class="text-2xl font-black text-white">{{ client.nom }} {{ client.prenom }}</h2>
          <p class="text-blue-100 font-bold uppercase tracking-widest text-xs mt-1">{{ client.cin || ('CLIENT_DETAIL.NO_CIN' | translate) }}</p>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ 'CLIENT_DETAIL.PHONE' | translate }}</label>
            <p class="text-lg font-bold text-gray-800">{{ client.telephone }}</p>
          </div>
          <div>
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ 'CLIENT_DETAIL.EMAIL' | translate }}</label>
            <p class="text-lg font-bold text-gray-800">{{ client.email || 'N/A' }}</p>
          </div>
          <div class="md:col-span-2">
            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ 'CLIENT_DETAIL.ADDRESS' | translate }}</label>
            <p class="text-lg font-bold text-gray-800">{{ client.adresse || ('CLIENT_DETAIL.NO_ADDRESS' | translate) }}</p>
          </div>
        </div>
      </div>

      <!-- Vehicles Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-gray-900 tracking-tighter">{{ 'CLIENT_DETAIL.ASSOCIATED_VEHICLES' | translate }}</h3>
        <a *ngIf="isAdmin" [routerLink]="['/vehicules/new', client.id]" class="px-6 py-2 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-black transition-all shadow-lg shadow-gray-200">
          {{ 'CLIENT_DETAIL.ADD_VEHICLE' | translate }}
        </a>
      </div>

      <!-- Vehicles List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" *ngIf="client.vehicules && client.vehicules.length > 0; else noVehicules">
        <div *ngFor="let v of client.vehicules" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <div class="flex items-start justify-between mb-4">
            <div>
              <p class="text-2xl font-black text-blue-600 font-mono tracking-tighter mb-1">
                {{ v.immatriculationPart1 }}-{{ v.immatriculationPart2 }}-{{ v.immatriculationPart3 }}
              </p>
              <p class="text-lg font-bold text-gray-800">{{ v.marque }} {{ v.modele }}</p>
            </div>
            <span class="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">{{ v.carburant }}</span>
          </div>
          <div class="flex gap-4 pt-4 border-t border-gray-50" *ngIf="isAdmin">
            <a [routerLink]="['/vehicules', v.id]" class="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-sm flex justify-center items-center group" title="{{ 'ACTIONS.VIEW_FICHE' | translate }}">
              <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </a>
            <a [routerLink]="['/fiches/new', v.id]" class="flex-1 text-center py-2 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition-all text-sm flex justify-center items-center group" title="{{ 'ACTIONS.ADD_FICHE' | translate }}">
              <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </a>
          </div>
          <div class="flex pt-4 border-t border-gray-50" *ngIf="!isAdmin">
            <a [routerLink]="['/vehicules', v.id]" class="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-sm flex justify-center items-center group" title="{{ 'ACTIONS.VIEW_FICHE' | translate }}">
              <svg class="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <ng-template #noVehicules>
        <div class="text-center py-16 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <p class="text-gray-400 font-bold uppercase tracking-widest text-sm italic">{{ 'CLIENT_DETAIL.NO_VEHICLES' | translate }}</p>
        </div>
      </ng-template>
    </div>

    <ng-template #loadingTpl>
      <div class="text-center py-20">
        <div class="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">{{ 'CLIENT_DETAIL.LOADING' | translate }}</p>
      </div>
    </ng-template>
  `
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  clientId!: number;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private translate: TranslateService
  ) { }

  get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getClient(this.clientId).subscribe({
      next: (data) => this.client = data,
      error: (err) => console.error('Error fetching client:', err)
    });
  }

  deleteClient() {
    if (confirm(this.translate.instant('CLIENT_DETAIL.CONFIRM_DELETE'))) {
      this.api.deleteClient(this.clientId).subscribe({
        next: () => {
          this.router.navigate(['/search'], { queryParams: { type: 'client' } });
        },
        error: (err) => alert(this.translate.instant('COMMON.ERROR_DELETE'))
      });
    }
  }

  editClient() {
    this.router.navigate(['/clients/new'], { queryParams: { id: this.clientId } });
  }

  goBack() {
    this.router.navigate(['/search'], { queryParams: { type: 'client' } });
  }
}
