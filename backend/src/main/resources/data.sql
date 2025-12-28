-- Clients
INSERT INTO client (adresse, cin, email, nom, prenom, telephone) VALUES 
('123 Rue de la Paix, Casablanca', 'AB123456', 'ahmed.benani@email.com', 'Benani', 'Ahmed', '0661234567'),
('45 Avenue Hassan II, Rabat', 'CD987654', 'karim.alami@email.com', 'Alami', 'Karim', '0669876543'),
('12 Bd Mohammed V, Tanger', 'EF456789', 'sara.ouali@email.com', 'Ouali', 'Sara', '0661122334');

-- Vehicules (Linked to Clients)
-- Client 1 (Benani)
INSERT INTO vehicule (annee_mise_circulation, carburant, couleur, immatriculation_part1, immatriculation_part2, immatriculation_part3, kilometrage_compteur, marque, modele, numero_chassis, puissance_fiscale, type_vehicule, client_id) VALUES
(2018, 'Diesel', 'Blanc', '12345', 'A', '6', 120000, 'Dacia', 'Logan', 'VF1LOGAN12345678', 7, 'Tourisme', 1),
(2020, 'Essence', 'Gris', '56789', 'B', '6', 45000, 'Peugeot', '208', 'VF3PEUGEOT98765', 6, 'Tourisme', 1);

-- Client 2 (Alami)
INSERT INTO vehicule (annee_mise_circulation, carburant, couleur, immatriculation_part1, immatriculation_part2, immatriculation_part3, kilometrage_compteur, marque, modele, numero_chassis, puissance_fiscale, type_vehicule, client_id) VALUES
(2015, 'Diesel', 'Noir', '11223', 'D', '1', 210000, 'Renault', 'Kangoo', 'VF1KANGOO554433', 8, 'Utilitaire', 2);

-- Client 3 (Ouali)
INSERT INTO vehicule (annee_mise_circulation, carburant, couleur, immatriculation_part1, immatriculation_part2, immatriculation_part3, kilometrage_compteur, marque, modele, numero_chassis, puissance_fiscale, type_vehicule, client_id) VALUES
(2022, 'Hybride', 'Bleu', '99887', 'H', '40', 15000, 'Toyota', 'Yaris', 'JTDKYARIS112233', 5, 'Tourisme', 3);


-- Visites Techniques
-- Visite 1: Dacia Logan (Valide)
INSERT INTO visite_technique (
    numero_visite, type_visite, date_visite, heure_visite, centre_visite, ville, controleur,
    kilometrage, resultat_final, date_validite, montant_paye, mode_paiement, numero_recu, statut_paiement,
    freinage, direction, suspension, pneus, chassis, ceintures, airbags,
    phares_avant, feux_arriere, clignotants, feux_stop, feux_position,
    pare_brise, essuie_glaces, retroviseurs,
    niveau_emission, fuite_huile, bruit_moteur, pot_echappement,
    observations_generales, vehicule_id
) VALUES (
    'V-2024-001', 'Périodique', '2024-01-15', '09:30', 'Centre Auto Casa', 'Casablanca', 'Mohamed Tazi',
    115000, 'REPARE', '2025-01-15', 350.00, 'Espèces', 'REC-001', 'PAYE',
    true, true, true, true, true, true, true,
    true, true, true, true, true,
    true, true, true,
    'CO: 0.2%', false, false, true,
    'Véhicule en bon état général.', 1
);

-- Visite 2: Renault Kangoo (Inapte - Contre visite)
INSERT INTO visite_technique (
    numero_visite, type_visite, date_visite, heure_visite, centre_visite, ville, controleur,
    kilometrage, resultat_final, date_limite_contre_visite, montant_paye, mode_paiement, numero_recu, statut_paiement,
    freinage, direction, suspension, pneus, chassis, ceintures, airbags,
    phares_avant, feux_arriere, clignotants, feux_stop, feux_position,
    pare_brise, essuie_glaces, retroviseurs,
    niveau_emission, fuite_huile, bruit_moteur, pot_echappement,
    observations_generales, vehicule_id
) VALUES (
    'V-2024-002', 'Périodique', '2024-02-10', '14:00', 'Centre Auto Rabat', 'Rabat', 'Youssef Fassi',
    205000, 'NON_REPARE', '2024-03-10', 400.00, 'Carte Bancaire', 'REC-002', 'PAYE',
    false, true, true, false, true, true, false,
    true, false, true, true, true,
    true, true, true,
    'Opacité: 1.5', true, false, false,
    'Défauts majeurs constatés sur le système de freinage et les pneumatiques.', 3
);

-- Defauts (Linked to Visite 2)
INSERT INTO defaut (code, description, gravite, action_requise, visite_id) VALUES 
('1.1.2', 'Efficacité du frein de service insuffisante', 'MAJEUR', 'Réparer le système de freinage', 2),
('5.2.3', 'Pneumatique: usure excessive', 'MAJEUR', 'Changer les pneus avant', 2),
('6.1.1', 'Fuite importante système échappement', 'MINEUR', 'Souder ou remplacer', 2);

-- Contre-Visite for Renault Kangoo (Valide after repair)
INSERT INTO visite_technique (
    numero_visite, type_visite, date_visite, heure_visite, centre_visite, ville, controleur,
    kilometrage, resultat_final, date_validite, montant_paye, mode_paiement, numero_recu, statut_paiement,
    freinage, direction, suspension, pneus, chassis, ceintures, airbags,
    phares_avant, feux_arriere, clignotants, feux_stop, feux_position,
    pare_brise, essuie_glaces, retroviseurs,
    niveau_emission, fuite_huile, bruit_moteur, pot_echappement,
    observations_generales, vehicule_id
) VALUES (
    'V-2024-003', 'Contre-visite', '2024-02-25', '10:00', 'Centre Auto Rabat', 'Rabat', 'Youssef Fassi',
    205500, 'REPARE', '2025-02-10', 100.00, 'Espèces', 'REC-003', 'PAYE',
    true, true, true, true, true, true, true,
    true, true, true, true, true,
    true, true, true,
    'Opacité: 0.8', false, false, true,
    'Défauts corrigés. Véhicule conforme.', 3
);

-- Reparations (Linked to Contre-Visite for history tracking, or logic could link to previous visit)
-- Assuming we want to show what was fixed during this visit check
INSERT INTO reparation (description, type, visite_id) VALUES
('Remplacement des plaquettes et disques de frein', 'CHANGEMENT', 3),
('Remplacement 2 pneus avant', 'CHANGEMENT', 3),
('Soudure pot échappement', 'REPARATION', 3);
