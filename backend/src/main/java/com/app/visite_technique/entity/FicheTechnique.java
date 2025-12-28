package com.app.visite_technique.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class FicheTechnique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vehicle information
    private String immatriculation;
    private String marque;
    private String modele;
    private Integer annee;
    private Integer kilometrage;

    // Diagnostic information
    @ElementCollection
    @CollectionTable(name = "fiche_pannes", joinColumns = @JoinColumn(name = "fiche_id"))
    @Column(name = "panne")
    private List<String> pannes;

    @Column(columnDefinition = "TEXT")
    private String descriptionDiagnostic;

    @Enumerated(EnumType.STRING)
    private Gravite gravite;

    private Boolean reparable;

    // Repair information
    @ElementCollection
    @CollectionTable(name = "fiche_pieces_changees", joinColumns = @JoinColumn(name = "fiche_id"))
    @Column(name = "piece")
    private List<String> piecesChangees;

    private Double coutPieces;
    private Double coutMainOeuvre;
    private Integer dureeReparationHeures;

    // Component condition states
    @Enumerated(EnumType.STRING)
    private Etat etatMoteur;

    @Enumerated(EnumType.STRING)
    private Etat etatFreins;

    @Enumerated(EnumType.STRING)
    private Etat etatSuspension;

    @Enumerated(EnumType.STRING)
    private Etat etatElectrique;

    @Enumerated(EnumType.STRING)
    private Etat etatCarrosserie;

    @Enumerated(EnumType.STRING)
    private Etat etatGeneral;

    // Dates and status
    private LocalDate dateDiagnostic;
    private LocalDate dateReparation;

    @Column(columnDefinition = "TEXT")
    private String observationMecanicien;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    // Relationship to Vehicule
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicule_id")
    @JsonIgnoreProperties({ "fiches", "hibernateLazyInitializer", "handler" })
    private Vehicule vehicule;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImmatriculation() {
        return immatriculation;
    }

    public void setImmatriculation(String immatriculation) {
        this.immatriculation = immatriculation;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getModele() {
        return modele;
    }

    public void setModele(String modele) {
        this.modele = modele;
    }

    public Integer getAnnee() {
        return annee;
    }

    public void setAnnee(Integer annee) {
        this.annee = annee;
    }

    public Integer getKilometrage() {
        return kilometrage;
    }

    public void setKilometrage(Integer kilometrage) {
        this.kilometrage = kilometrage;
    }

    public List<String> getPannes() {
        return pannes;
    }

    public void setPannes(List<String> pannes) {
        this.pannes = pannes;
    }

    public String getDescriptionDiagnostic() {
        return descriptionDiagnostic;
    }

    public void setDescriptionDiagnostic(String descriptionDiagnostic) {
        this.descriptionDiagnostic = descriptionDiagnostic;
    }

    public Gravite getGravite() {
        return gravite;
    }

    public void setGravite(Gravite gravite) {
        this.gravite = gravite;
    }

    public Boolean getReparable() {
        return reparable;
    }

    public void setReparable(Boolean reparable) {
        this.reparable = reparable;
    }

    public List<String> getPiecesChangees() {
        return piecesChangees;
    }

    public void setPiecesChangees(List<String> piecesChangees) {
        this.piecesChangees = piecesChangees;
    }

    public Double getCoutPieces() {
        return coutPieces;
    }

    public void setCoutPieces(Double coutPieces) {
        this.coutPieces = coutPieces;
    }

    public Double getCoutMainOeuvre() {
        return coutMainOeuvre;
    }

    public void setCoutMainOeuvre(Double coutMainOeuvre) {
        this.coutMainOeuvre = coutMainOeuvre;
    }

    public Integer getDureeReparationHeures() {
        return dureeReparationHeures;
    }

    public void setDureeReparationHeures(Integer dureeReparationHeures) {
        this.dureeReparationHeures = dureeReparationHeures;
    }

    public Etat getEtatMoteur() {
        return etatMoteur;
    }

    public void setEtatMoteur(Etat etatMoteur) {
        this.etatMoteur = etatMoteur;
    }

    public Etat getEtatFreins() {
        return etatFreins;
    }

    public void setEtatFreins(Etat etatFreins) {
        this.etatFreins = etatFreins;
    }

    public Etat getEtatSuspension() {
        return etatSuspension;
    }

    public void setEtatSuspension(Etat etatSuspension) {
        this.etatSuspension = etatSuspension;
    }

    public Etat getEtatElectrique() {
        return etatElectrique;
    }

    public void setEtatElectrique(Etat etatElectrique) {
        this.etatElectrique = etatElectrique;
    }

    public Etat getEtatCarrosserie() {
        return etatCarrosserie;
    }

    public void setEtatCarrosserie(Etat etatCarrosserie) {
        this.etatCarrosserie = etatCarrosserie;
    }

    public Etat getEtatGeneral() {
        return etatGeneral;
    }

    public void setEtatGeneral(Etat etatGeneral) {
        this.etatGeneral = etatGeneral;
    }

    public LocalDate getDateDiagnostic() {
        return dateDiagnostic;
    }

    public void setDateDiagnostic(LocalDate dateDiagnostic) {
        this.dateDiagnostic = dateDiagnostic;
    }

    public LocalDate getDateReparation() {
        return dateReparation;
    }

    public void setDateReparation(LocalDate dateReparation) {
        this.dateReparation = dateReparation;
    }

    public String getObservationMecanicien() {
        return observationMecanicien;
    }

    public void setObservationMecanicien(String observationMecanicien) {
        this.observationMecanicien = observationMecanicien;
    }

    public Statut getStatut() {
        return statut;
    }

    public void setStatut(Statut statut) {
        this.statut = statut;
    }

    public Vehicule getVehicule() {
        return vehicule;
    }

    public void setVehicule(Vehicule vehicule) {
        this.vehicule = vehicule;
    }
}
