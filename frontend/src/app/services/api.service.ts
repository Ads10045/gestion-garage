import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Enums
export type Etat = 'BON' | 'MOYEN' | 'MAUVAIS';
export type Gravite = 'MINEURE' | 'MAJEURE' | 'CRITIQUE';
export type Statut = 'EN_COURS' | 'REPARE' | 'NON_REPARABLE' | 'A_REVOIR';

// Models
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  cin?: string;
  adresse?: string;
  vehicules?: Vehicule[];
}

export interface Vehicule {
  id?: number;
  immatriculationPart1: string;
  immatriculationPart2: string;
  immatriculationPart3: string;
  marque: string;
  modele: string;
  typeVehicule?: string;
  anneeMiseCirculation?: number;
  numeroChassis?: string;
  carburant?: string;
  kilometrageCompteur?: number;
  puissanceFiscale?: number;
  couleur?: string;
  client?: Client;
  fiches?: FicheTechnique[];
}

export interface FicheTechnique {
  id?: number;

  // Vehicle info
  immatriculation?: string;
  marque?: string;
  modele?: string;
  annee?: number;
  kilometrage?: number;

  // Diagnostic
  pannes?: string[];
  descriptionDiagnostic?: string;
  gravite?: Gravite;
  reparable?: boolean;

  // Repair info
  piecesChangees?: string[];
  coutPieces?: number;
  coutMainOeuvre?: number;
  dureeReparationHeures?: number;

  // Component states
  etatMoteur?: Etat;
  etatFreins?: Etat;
  etatSuspension?: Etat;
  etatElectrique?: Etat;
  etatCarrosserie?: Etat;
  etatGeneral?: Etat;

  // Dates and status
  dateDiagnostic?: string;
  dateReparation?: string;
  observationMecanicien?: string;
  statut?: Statut;

  // Relationship
  vehicule?: Vehicule;
}

export interface Stats {
  totalClients: number;
  totalVehicules: number;
  totalFiches: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) { }

  // Clients
  getClients(query: string = '', page: number = 0, size: number = 10): Observable<PageResponse<Client>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());
    console.log(`GET ${this.apiUrl}/clients with query: ${query}, page: ${page}, size: ${size}`);
    return this.http.get<PageResponse<Client>>(`${this.apiUrl}/clients`, { params });
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  saveClient(client: Client): Observable<Client> {
    if (client.id) {
      return this.http.put<Client>(`${this.apiUrl}/clients/${client.id}`, client);
    }
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  // Vehicules
  getVehicules(part1: string, part2: string, part3: string, page: number = 0, size: number = 10): Observable<PageResponse<Vehicule>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (part1) params = params.set('part1', part1);
    if (part2) params = params.set('part2', part2);
    if (part3) params = params.set('part3', part3);
    console.log(`GET ${this.apiUrl}/vehicules with parts: ${part1}-${part2}-${part3}, page: ${page}, size: ${size}`);
    return this.http.get<PageResponse<Vehicule>>(`${this.apiUrl}/vehicules`, { params });
  }

  getVehicule(id: number): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/vehicules/${id}`);
  }

  saveVehicule(vehicule: Vehicule): Observable<Vehicule> {
    if (vehicule.id) {
      return this.http.put<Vehicule>(`${this.apiUrl}/vehicules/${vehicule.id}`, vehicule);
    }
    return this.http.post<Vehicule>(`${this.apiUrl}/vehicules`, vehicule);
  }

  deleteVehicule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vehicules/${id}`);
  }

  // Fiches Techniques
  getFiches(page: number = 0, size: number = 10, query: string = ''): Observable<PageResponse<FicheTechnique>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('query', query);
    console.log(`GET ${this.apiUrl}/fiches with query: ${query}, page: ${page}, size: ${size}`);
    return this.http.get<PageResponse<FicheTechnique>>(`${this.apiUrl}/fiches`, { params });
  }

  getRecentFiches(): Observable<FicheTechnique[]> {
    console.log(`GET ${this.apiUrl}/fiches/recent`);
    return this.http.get<FicheTechnique[]>(`${this.apiUrl}/fiches/recent`);
  }

  getFiche(id: number): Observable<FicheTechnique> {
    return this.http.get<FicheTechnique>(`${this.apiUrl}/fiches/${id}`);
  }

  saveFiche(fiche: FicheTechnique): Observable<FicheTechnique> {
    if (fiche.id) {
      return this.http.put<FicheTechnique>(`${this.apiUrl}/fiches/${fiche.id}`, fiche);
    }
    return this.http.post<FicheTechnique>(`${this.apiUrl}/fiches`, fiche);
  }

  deleteFiche(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fiches/${id}`);
  }

  // Stats
  getStats(): Observable<Stats> {
    console.log(`GET ${this.apiUrl}/stats`);
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }
}
