import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, Vehicule, Client } from '../../services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicule-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="px-4 py-6 sm:px-0" *ngIf="client; else loadingTpl">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tighter">{{ (vehicule.id ? 'VEHICLE_FORM.TITLE_EDIT' : 'VEHICLE_FORM.TITLE_ADD') | translate }}</h1>
          <p class="text-gray-500 font-medium">{{ 'VEHICLE_FORM.FOR' | translate }} <span class="text-blue-600 font-bold">{{ client.nom }} {{ client.prenom }}</span></p>
        </div>
        <button (click)="goBack()" class="text-blue-600 hover:text-blue-900 font-medium">← {{ 'CLIENT_FORM.CANCEL' | translate }}</button>
      </div>

      <div class="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        <form (ngSubmit)="onSubmit()" #vForm="ngForm" class="p-8 space-y-8">
          
          <!-- Registration Section -->
          <div class="bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{{ 'VISITE_LIST.TABLE.IMMAT' | translate }}</label>
            <div class="flex items-center gap-4">
              <input type="text" [(ngModel)]="vehicule.immatriculationPart1" name="part1" required placeholder="12345" maxlength="5"
                class="w-32 px-4 py-3 bg-white border-2 border-transparent focus:border-blue-600 rounded-xl outline-none font-black text-xl text-center shadow-sm">
              <span class="text-gray-400 font-black">-</span>
              <input type="text" [(ngModel)]="vehicule.immatriculationPart2" name="part2" required placeholder="A" maxlength="2"
                class="w-20 px-4 py-3 bg-white border-2 border-transparent focus:border-blue-600 rounded-xl outline-none font-black text-xl text-center shadow-sm">
              <span class="text-gray-400 font-black">-</span>
              <input type="text" [(ngModel)]="vehicule.immatriculationPart3" name="part3" required placeholder="6" maxlength="5"
                class="w-24 px-4 py-3 bg-white border-2 border-transparent focus:border-blue-600 rounded-xl outline-none font-black text-xl text-center shadow-sm">
            </div>
          </div>

          <!-- General Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.BRAND' | translate }}</label>
              <input type="text" [(ngModel)]="vehicule.marque" name="marque" required placeholder="Ex: Toyota"
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
            </div>
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.MODEL' | translate }}</label>
              <input type="text" [(ngModel)]="vehicule.modele" name="modele" required placeholder="Ex: Corolla"
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
            </div>
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.TYPE' | translate }}</label>
              <select [(ngModel)]="vehicule.typeVehicule" name="type" required
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
                <option value="Tourisme">{{ 'VEHICLE_FORM.TYPES.TOURISME' | translate }}</option>
                <option value="Utilitaire">{{ 'VEHICLE_FORM.TYPES.UTILITAIRE' | translate }}</option>
                <option value="4x4">{{ 'VEHICLE_FORM.TYPES.4X4' | translate }}</option>
                <option value="Camionnette">{{ 'VEHICLE_FORM.TYPES.CAMIONNETTE' | translate }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.FUEL' | translate }}</label>
              <select [(ngModel)]="vehicule.carburant" name="carburant" required
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
                <option value="Diesel">{{ 'VEHICLE_FORM.FUELS.DIESEL' | translate }}</option>
                <option value="Essence">{{ 'VEHICLE_FORM.FUELS.ESSENCE' | translate }}</option>
                <option value="Hybride">{{ 'VEHICLE_FORM.FUELS.HYBRIDE' | translate }}</option>
                <option value="Electrique">{{ 'VEHICLE_FORM.FUELS.ELECTRIQUE' | translate }}</option>
              </select>
            </div>
          </div>

          <!-- Specs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.YEAR' | translate }}</label>
              <input type="number" [(ngModel)]="vehicule.anneeMiseCirculation" name="annee" required
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
            </div>
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.CHASSIS' | translate }}</label>
              <input type="text" [(ngModel)]="vehicule.numeroChassis" name="chassis" required
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
            </div>
            <div>
              <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'VEHICLE_FORM.POWER' | translate }}</label>
              <input type="number" [(ngModel)]="vehicule.puissanceFiscale" name="puissance" required
                class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold">
            </div>
          </div>

          <div class="flex justify-end pt-8">
            <button type="submit" [disabled]="!vForm.form.valid"
              class="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tighter text-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-xl shadow-blue-200">
              {{ 'VEHICLE_FORM.SAVE' | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="text-center py-20">
        <div class="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">{{ 'CLIENT_DETAIL.LOADING' | translate }}</p>
      </div>
    </ng-template>
  `
})
export class VehiculeFormComponent implements OnInit {
  clientId!: number;
  client?: Client;
  vehicule: Partial<Vehicule> = {
    immatriculationPart1: '',
    immatriculationPart2: '',
    immatriculationPart3: '',
    marque: '',
    modele: '',
    typeVehicule: 'Tourisme',
    carburant: 'Diesel',
    anneeMiseCirculation: new Date().getFullYear(),
    numeroChassis: '',
    puissanceFiscale: 7,
    kilometrageCompteur: 0,
    couleur: 'N/A'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.api.getClient(this.clientId).subscribe(data => this.client = data);

    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.api.getVehicule(Number(id)).subscribe({
        next: (data) => this.vehicule = data,
        error: (err) => console.error('Error fetching vehicle for edit:', err)
      });
    }
  }

  onSubmit() {
    const vehiculeToSave = { ...this.vehicule, client: { id: this.clientId } };
    this.api.saveVehicule(vehiculeToSave as Vehicule).subscribe({
      next: (saved) => {
        this.router.navigate(['/clients', this.clientId]);
      },
      error: (err) => console.error('Error saving vehicle:', err)
    });
  }

  goBack() {
    this.router.navigate(['/clients', this.clientId]);
  }
}
