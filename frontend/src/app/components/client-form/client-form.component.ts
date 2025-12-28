import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService, Client } from '../../services/api.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  template: `
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">{{ (client.id ? 'CLIENT_FORM.TITLE_EDIT' : 'CLIENT_FORM.TITLE_ADD') | translate }}</h1>
        <button (click)="goBack()" class="text-blue-600 hover:text-blue-900 font-medium tracking-tight">← {{ 'CLIENT_FORM.CANCEL' | translate }}</button>
      </div>

      <div class="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
        <div class="p-8">
          <form (ngSubmit)="onSubmit()" #clientForm="ngForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name -->
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.NOM' | translate }}</label>
                <input type="text" [(ngModel)]="client.nom" name="nom" required
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900">
              </div>
              
              <!-- First Name -->
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.PRENOM' | translate }}</label>
                <input type="text" [(ngModel)]="client.prenom" name="prenom" required
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900">
              </div>

              <!-- CIN -->
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.CIN' | translate }}</label>
                <input type="text" [(ngModel)]="client.cin" name="cin" required
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900">
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.PHONE' | translate }}</label>
                <input type="text" [(ngModel)]="client.telephone" name="telephone" required
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900">
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.EMAIL' | translate }}</label>
                <input type="email" [(ngModel)]="client.email" name="email"
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900">
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{{ 'CLIENT_FORM.ADDRESS' | translate }}</label>
                <textarea [(ngModel)]="client.adresse" name="adresse" rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-blue-600 focus:bg-white transition-all outline-none font-bold text-gray-900"></textarea>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" [disabled]="!clientForm.form.valid"
                class="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-tighter text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-blue-200">
                {{ 'CLIENT_FORM.SAVE' | translate }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ClientFormComponent implements OnInit {
  client: Partial<Client> = {
    nom: '',
    prenom: '',
    cin: '',
    telephone: '',
    email: '',
    adresse: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.api.getClient(Number(id)).subscribe({
        next: (data) => this.client = data,
        error: (err) => console.error('Error fetching client for edit:', err)
      });
    }
  }

  onSubmit() {
    this.api.saveClient(this.client as Client).subscribe({
      next: (saved) => {
        this.router.navigate(['/search'], { queryParams: { type: 'client' } });
      },
      error: (err) => console.error('Error saving client:', err)
    });
  }

  goBack() {
    this.router.navigate(['/search']);
  }
}
