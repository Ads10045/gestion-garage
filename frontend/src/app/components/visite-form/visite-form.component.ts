import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, Vehicule, FicheTechnique, Etat, Gravite, Statut } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-fiche-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
    templateUrl: './visite-form.component.html'
})
export class FicheFormComponent implements OnInit {
    vehiculeId!: number;
    vehicule?: Vehicule;

    fiche: FicheTechnique = {
        dateDiagnostic: new Date().toISOString().split('T')[0],
        kilometrage: 0,
        pannes: [],
        piecesChangees: [],
        reparable: true,
        gravite: 'MINEURE',
        statut: 'EN_COURS',
        etatMoteur: 'BON',
        etatFreins: 'BON',
        etatSuspension: 'BON',
        etatElectrique: 'BON',
        etatCarrosserie: 'BON',
        etatGeneral: 'BON',
        coutPieces: 0,
        coutMainOeuvre: 0,
        dureeReparationHeures: 0
    };

    newPanne: string = '';
    newPiece: string = '';

    etatOptions: Etat[] = ['BON', 'MOYEN', 'MAUVAIS'];
    graviteOptions: Gravite[] = ['MINEURE', 'MAJEURE', 'CRITIQUE'];
    statutOptions: Statut[] = ['EN_COURS', 'REPARE', 'NON_REPARABLE', 'A_REVOIR'];

    availablePannes: string[] = [];
    availablePieces: string[] = [];

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private api: ApiService,
        private translate: TranslateService,
        private http: HttpClient
    ) { }

    goBack(): void {
        this.router.navigate(['/vehicules', this.vehiculeId]);
    }

    ngOnInit(): void {
        this.vehiculeId = Number(this.route.snapshot.paramMap.get('vehiculeId'));
        this.api.getVehicule(this.vehiculeId).subscribe(data => {
            this.vehicule = data;
            // Pre-fill vehicle info
            if (this.vehicule) {
                this.fiche.immatriculation = `${this.vehicule.immatriculationPart1}-${this.vehicule.immatriculationPart2}-${this.vehicule.immatriculationPart3}`;
                this.fiche.marque = this.vehicule.marque;
                this.fiche.modele = this.vehicule.modele;
                this.fiche.annee = this.vehicule.anneeMiseCirculation;
                this.fiche.kilometrage = this.vehicule.kilometrageCompteur || 0;
            }
        });

        const id = this.route.snapshot.queryParams['id'];
        if (id) {
            this.api.getFiche(Number(id)).subscribe({
                next: (data: FicheTechnique) => this.fiche = data,
                error: (err) => console.error('Error fetching fiche for edit:', err)
            });
        }

        // Load runtime config
        this.http.get<any>('assets/data/config.json').subscribe({
            next: (config) => {
                this.availablePannes = config.commonFaults;
                this.availablePieces = config.commonParts;
            },
            error: (err) => {
                console.error('Error loading config:', err);
            }
        });
    }

    addPanne() {
        if (this.newPanne.trim()) {
            if (!this.fiche.pannes) this.fiche.pannes = [];

            // We store the translation of the key for consistency in display
            const label = this.translate.instant('COMMON.FAULTS.' + this.newPanne);
            this.fiche.pannes.push(label);
            this.newPanne = '';
        }
    }

    removePanne(index: number) {
        this.fiche.pannes?.splice(index, 1);
    }

    addPiece() {
        if (this.newPiece.trim()) {
            if (!this.fiche.piecesChangees) this.fiche.piecesChangees = [];

            const label = this.translate.instant('COMMON.PARTS.' + this.newPiece);
            this.fiche.piecesChangees.push(label);
            this.newPiece = '';
        }
    }

    removePiece(index: number) {
        this.fiche.piecesChangees?.splice(index, 1);
    }

    onSubmit() {
        const ficheToSave = { ...this.fiche, vehicule: { id: this.vehiculeId } };

        this.api.saveFiche(ficheToSave as any).subscribe(saved => {
            this.router.navigate(['/vehicules', this.vehiculeId]);
        });
    }

    getStatutLabel(statut: Statut): string {
        switch (statut) {
            case 'REPARE': return 'COMMON.STATUS.REPARE';
            case 'EN_COURS': return 'COMMON.STATUS.EN_COURS';
            case 'NON_REPARABLE': return 'COMMON.STATUS.NON_REPARABLE';
            case 'A_REVOIR': return 'COMMON.STATUS.A_REVOIR';
            default: return statut;
        }
    }
}
