package com.app.visite_technique.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class Vehicule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Immatriculation decomposed based on requirements
    private String immatriculationPart1; // XXXXX
    private String immatriculationPart2; // XX
    private String immatriculationPart3; // FFFFF

    private String marque;
    private String modele;

    // New fields
    private String typeVehicule; // Tourisme, Utilitaire, Taxi, Camion
    private Integer anneeMiseCirculation;
    private String numeroChassis;
    private String carburant; // Essence, Diesel, Hybride, Electrique
    private Integer kilometrageCompteur; // Current mileage if tracked on vehicle, distinct from visit mileage
    private Integer puissanceFiscale;
    private String couleur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({ "vehicules", "hibernateLazyInitializer", "handler" })
    private Client client;

    @OneToMany(mappedBy = "vehicule", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({ "vehicule", "hibernateLazyInitializer", "handler" })
    private List<FicheTechnique> fiches;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImmatriculationPart1() {
        return immatriculationPart1;
    }

    public void setImmatriculationPart1(String immatriculationPart1) {
        this.immatriculationPart1 = immatriculationPart1;
    }

    public String getImmatriculationPart2() {
        return immatriculationPart2;
    }

    public void setImmatriculationPart2(String immatriculationPart2) {
        this.immatriculationPart2 = immatriculationPart2;
    }

    public String getImmatriculationPart3() {
        return immatriculationPart3;
    }

    public void setImmatriculationPart3(String immatriculationPart3) {
        this.immatriculationPart3 = immatriculationPart3;
    }

    public String getFullImmatriculation() {
        return immatriculationPart1 + "-" + immatriculationPart2 + "-" + immatriculationPart3;
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

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public String getTypeVehicule() {
        return typeVehicule;
    }

    public void setTypeVehicule(String typeVehicule) {
        this.typeVehicule = typeVehicule;
    }

    public Integer getAnneeMiseCirculation() {
        return anneeMiseCirculation;
    }

    public void setAnneeMiseCirculation(Integer anneeMiseCirculation) {
        this.anneeMiseCirculation = anneeMiseCirculation;
    }

    public String getNumeroChassis() {
        return numeroChassis;
    }

    public void setNumeroChassis(String numeroChassis) {
        this.numeroChassis = numeroChassis;
    }

    public String getCarburant() {
        return carburant;
    }

    public void setCarburant(String carburant) {
        this.carburant = carburant;
    }

    public Integer getKilometrageCompteur() {
        return kilometrageCompteur;
    }

    public void setKilometrageCompteur(Integer kilometrageCompteur) {
        this.kilometrageCompteur = kilometrageCompteur;
    }

    public Integer getPuissanceFiscale() {
        return puissanceFiscale;
    }

    public void setPuissanceFiscale(Integer puissanceFiscale) {
        this.puissanceFiscale = puissanceFiscale;
    }

    public String getCouleur() {
        return couleur;
    }

    public void setCouleur(String couleur) {
        this.couleur = couleur;
    }

    public List<FicheTechnique> getFiches() {
        return fiches;
    }

    public void setFiches(List<FicheTechnique> fiches) {
        this.fiches = fiches;
    }
}
