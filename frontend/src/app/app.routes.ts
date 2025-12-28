import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './components/search/search.component';
import { VehiculeDetailComponent } from './components/vehicule-detail/vehicule-detail.component';
import { FicheDetailComponent } from './components/visite-detail/visite-detail.component';
import { FicheFormComponent } from './components/visite-form/visite-form.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientDetailComponent } from './components/client-detail/client-detail.component';
import { VehiculeFormComponent } from './components/vehicule-form/vehicule-form.component';
import { FicheListComponent } from './components/visite-list/visite-list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchComponent, canActivate: [authGuard] },
    { path: 'clients/new', component: ClientFormComponent, canActivate: [authGuard] },
    { path: 'clients/:id', component: ClientDetailComponent, canActivate: [authGuard] },
    { path: 'vehicules/new/:clientId', component: VehiculeFormComponent, canActivate: [authGuard] },
    { path: 'vehicules/:id', component: VehiculeDetailComponent, canActivate: [authGuard] },
    { path: 'fiches/new/:vehiculeId', component: FicheFormComponent, canActivate: [authGuard] },
    { path: 'fiches/:id', component: FicheDetailComponent, canActivate: [authGuard] },
    { path: 'fiches', component: FicheListComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: '**', redirectTo: 'dashboard' }
];
