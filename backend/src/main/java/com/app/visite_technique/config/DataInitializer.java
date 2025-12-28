package com.app.visite_technique.config;

import com.app.visite_technique.entity.*;
import com.app.visite_technique.repository.ClientRepository;
import com.app.visite_technique.repository.VehiculeRepository;
import com.app.visite_technique.repository.FicheTechniqueRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Configuration
public class DataInitializer {

    private final Random random = new Random();

    private final Etat[] etats = Etat.values();
    private final Gravite[] gravites = Gravite.values();
    private final Statut[] statuts = Statut.values();

    @Bean
    public CommandLineRunner initData(ClientRepository clientRepo,
            VehiculeRepository vehiculeRepo,
            FicheTechniqueRepository ficheRepo) {
        return args -> {

            // 1. Ensure Clients exist
            List<Client> clients = clientRepo.findAll();
            if (clients.isEmpty()) {
                System.out.println(">>> Generating Clients...");
                String[] noms = { "Benani", "Alami", "Fassi", "Mansouri", "Tazi", "Idrissi", "Habibi", "Slaoui", "Zaki",
                        "Berrada" };
                String[] prenoms = { "Ahmed", "Karim", "Sara", "Fatima", "Yassine", "Meriem", "Omar", "Leila", "Driss",
                        "Salma" };
                String[] villes = { "Casablanca", "Rabat", "Marrakech", "Tangier", "Agadir", "Fes", "Meknes", "Oujda",
                        "Kenitra", "Tetouan" };

                for (int i = 1; i <= 50; i++) {
                    Client c = new Client();
                    c.setNom(noms[random.nextInt(noms.length)]);
                    c.setPrenom(prenoms[random.nextInt(prenoms.length)]);
                    c.setTelephone("06" + String.format("%08d", random.nextInt(100000000)));
                    c.setEmail(c.getPrenom().toLowerCase() + "." + c.getNom().toLowerCase() + i + "@email.com");
                    c.setCin("CIN" + String.format("%05d", i + 100));
                    c.setAdresse("Appartement " + i + ", Rue des Fleurs, " + villes[random.nextInt(villes.length)]);
                    clients.add(clientRepo.save(c));
                }
            }

            // 2. Ensure Vehicles exist
            List<Vehicule> vehicules = vehiculeRepo.findAll();
            if (vehicules.isEmpty()) {
                System.out.println(">>> Generating Vehicles...");
                String[] carBrands = { "Toyota", "Renault", "Dacia", "Peugeot", "Volkswagen", "Mercedes", "BMW", "Ford",
                        "Hyundai", "Fiat" };
                String[] carModels = { "S", "M", "L", "XL", "Comfort", "Sport", "Business", "Active", "Dynamic",
                        "Premium" };
                String[] types = { "Tourisme", "Utilitaire", "4x4", "Camionnette" };
                String[] carburants = { "Diesel", "Essence", "Hybride", "Electrique" };

                for (int i = 1; i <= 50; i++) {
                    Vehicule v = new Vehicule();
                    v.setImmatriculationPart1(String.format("%05d", random.nextInt(100000)));
                    v.setImmatriculationPart2("A");
                    v.setImmatriculationPart3("" + (random.nextInt(89) + 1));
                    v.setMarque(carBrands[random.nextInt(carBrands.length)]);
                    v.setModele(
                            carModels[random.nextInt(carModels.length)] + " " + (random.nextInt(2023 - 2010) + 2010));
                    v.setTypeVehicule(types[random.nextInt(types.length)]);
                    v.setAnneeMiseCirculation(2010 + random.nextInt(14));
                    v.setNumeroChassis("VIN" + String.format("%012d", i + 1000));
                    v.setCarburant(carburants[random.nextInt(carburants.length)]);
                    v.setKilometrageCompteur(10000 + random.nextInt(200000));
                    v.setPuissanceFiscale(4 + random.nextInt(12));
                    v.setCouleur("Couleur " + i);
                    v.setClient(clients.get(random.nextInt(clients.size())));
                    vehicules.add(vehiculeRepo.save(v));
                }
            }

            // 3. Ensure Fiches exist (Goal: 50 lines)
            long currentFichesCount = ficheRepo.count();
            if (currentFichesCount < 50) {
                System.out.println(">>> Generating Fiches Techniques to reach 50...");
                String[] pannesList = { "Fuite d'huile moteur", "Plaquettes de frein usées", "Amortisseurs défaillants",
                        "Batterie faible", "Pneus usés", "Problème d'embrayage", "Feux défaillants",
                        "Climatisation en panne", "Courroie de distribution usée", "Échappement percé" };
                String[] piecesList = { "Plaquettes de frein", "Amortisseurs", "Batterie", "Pneus", "Disques de frein",
                        "Courroie de distribution", "Filtre à huile", "Filtre à air", "Bougies d'allumage", "Rotules" };

                long needed = 50 - currentFichesCount;
                for (int i = 1; i <= needed; i++) {
                    FicheTechnique ft = new FicheTechnique();
                    Vehicule vehicule = vehicules.get(random.nextInt(vehicules.size()));
                    ft.setVehicule(vehicule);

                    // Sync basic info
                    // Using direct concatenation to be safe:
                    ft.setImmatriculation(vehicule.getImmatriculationPart1() + "-" + vehicule.getImmatriculationPart2()
                            + "-" + vehicule.getImmatriculationPart3());

                    ft.setMarque(vehicule.getMarque());
                    ft.setModele(vehicule.getModele());
                    ft.setAnnee(vehicule.getAnneeMiseCirculation());
                    ft.setKilometrage(vehicule.getKilometrageCompteur() + random.nextInt(5000));

                    // Diagnostic
                    int numPannes = random.nextInt(3) + 1;
                    List<String> pannes = new ArrayList<>();
                    for (int j = 0; j < numPannes; j++) {
                        pannes.add(pannesList[random.nextInt(pannesList.length)]);
                    }
                    ft.setPannes(pannes);
                    ft.setDescriptionDiagnostic("Diagnostic généré #" + i + ". " + numPannes + " pannes détectées.");
                    ft.setGravite(gravites[random.nextInt(gravites.length)]);
                    ft.setReparable(random.nextInt(10) < 8);

                    // Repair
                    if (ft.getReparable()) {
                        int numPieces = random.nextInt(3) + 1;
                        List<String> pieces = new ArrayList<>();
                        for (int j = 0; j < numPieces; j++) {
                            pieces.add(piecesList[random.nextInt(piecesList.length)]);
                        }
                        ft.setPiecesChangees(pieces);
                        ft.setCoutPieces(100.0 + random.nextDouble() * 900);
                        ft.setCoutMainOeuvre(50.0 + random.nextDouble() * 200);
                        ft.setDureeReparationHeures(1 + random.nextInt(8));
                    }

                    // States
                    ft.setEtatMoteur(etats[random.nextInt(etats.length)]);
                    ft.setEtatFreins(etats[random.nextInt(etats.length)]);
                    ft.setEtatSuspension(etats[random.nextInt(etats.length)]);
                    ft.setEtatElectrique(etats[random.nextInt(etats.length)]);
                    ft.setEtatCarrosserie(etats[random.nextInt(etats.length)]);
                    ft.setEtatGeneral(etats[random.nextInt(etats.length)]);

                    // Dates
                    ft.setDateDiagnostic(LocalDate.now().minusDays(random.nextInt(365)));
                    if (random.nextBoolean()) {
                        ft.setDateReparation(ft.getDateDiagnostic().plusDays(1 + random.nextInt(7)));
                    }
                    ft.setObservationMecanicien("Généré automatiquement.");
                    ft.setStatut(statuts[random.nextInt(statuts.length)]);

                    ficheRepo.save(ft);
                }
            }

            System.out.println("Data check complete. Total Fiches: " + ficheRepo.count());
        };
    }
}
