require('dotenv').config();
const Client = require('./models/Client');
const Vehicule = require('./models/Vehicule');
const FicheTechnique = require('./models/FicheTechnique');
const FichePanne = require('./models/FichePanne');
const FichePiece = require('./models/FichePiece');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 1. Créer des clients
        console.log('📝 Creating clients...');
        const clients = await Client.bulkCreate([
            {
                nom: 'Benani',
                prenom: 'Ahmed',
                cin: 'AB123456',
                email: 'ahmed.benani@email.com',
                telephone: '0661234567',
                adresse: '123 Rue de la Paix, Casablanca'
            },
            {
                nom: 'Alami',
                prenom: 'Fatima',
                cin: 'CD789012',
                email: 'fatima.alami@email.com',
                telephone: '0662345678',
                adresse: '456 Avenue Mohammed V, Rabat'
            },
            {
                nom: 'Tazi',
                prenom: 'Youssef',
                cin: 'EF345678',
                email: 'youssef.tazi@email.com',
                telephone: '0663456789',
                adresse: '789 Boulevard Hassan II, Marrakech'
            },
            {
                nom: 'Benjelloun',
                prenom: 'Sara',
                cin: 'GH901234',
                email: 'sara.benjelloun@email.com',
                telephone: '0664567890',
                adresse: '321 Rue Allal Ben Abdellah, Fès'
            },
            {
                nom: 'Idrissi',
                prenom: 'Omar',
                cin: 'IJ567890',
                email: 'omar.idrissi@email.com',
                telephone: '0665678901',
                adresse: '654 Avenue des FAR, Tanger'
            }
        ]);
        console.log(`✅ Created ${clients.length} clients\n`);

        // 2. Créer des véhicules
        console.log('🚗 Creating vehicles...');
        const vehicules = await Vehicule.bulkCreate([
            {
                immatriculationPart1: '12345',
                immatriculationPart2: 'A',
                immatriculationPart3: '6',
                marque: 'Dacia',
                modele: 'Logan',
                typeVehicule: 'Tourisme',
                carburant: 'Diesel',
                couleur: 'Blanc',
                puissanceFiscale: 7,
                anneeMiseCirculation: 2018,
                numeroChassis: 'VF1LOGAN1234567890',
                kilometrageCompteur: 120000,
                client_id: clients[0].id
            },
            {
                immatriculationPart1: '67890',
                immatriculationPart2: 'B',
                immatriculationPart3: '12',
                marque: 'Renault',
                modele: 'Clio',
                typeVehicule: 'Tourisme',
                carburant: 'Essence',
                couleur: 'Rouge',
                puissanceFiscale: 6,
                anneeMiseCirculation: 2020,
                numeroChassis: 'VF1CLIO9876543210',
                kilometrageCompteur: 45000,
                client_id: clients[1].id
            },
            {
                immatriculationPart1: '11223',
                immatriculationPart2: 'C',
                immatriculationPart3: '34',
                marque: 'Peugeot',
                modele: '208',
                typeVehicule: 'Tourisme',
                carburant: 'Essence',
                couleur: 'Gris',
                puissanceFiscale: 5,
                anneeMiseCirculation: 2019,
                numeroChassis: 'VF3208ABCDEF12345',
                kilometrageCompteur: 78000,
                client_id: clients[2].id
            },
            {
                immatriculationPart1: '44556',
                immatriculationPart2: 'D',
                immatriculationPart3: '78',
                marque: 'Volkswagen',
                modele: 'Golf',
                typeVehicule: 'Tourisme',
                carburant: 'Diesel',
                couleur: 'Noir',
                puissanceFiscale: 8,
                anneeMiseCirculation: 2017,
                numeroChassis: 'WVWGOLF123456789',
                kilometrageCompteur: 150000,
                client_id: clients[3].id
            },
            {
                immatriculationPart1: '99887',
                immatriculationPart2: 'E',
                immatriculationPart3: '56',
                marque: 'Toyota',
                modele: 'Corolla',
                typeVehicule: 'Tourisme',
                carburant: 'Hybride',
                couleur: 'Bleu',
                puissanceFiscale: 7,
                anneeMiseCirculation: 2021,
                numeroChassis: 'JTDCOROLLA987654',
                kilometrageCompteur: 25000,
                client_id: clients[4].id
            }
        ]);
        console.log(`✅ Created ${vehicules.length} vehicles\n`);

        // 3. Créer des fiches techniques
        console.log('📋 Creating technical sheets...');
        
        // Fiche 1 - Dacia Logan
        const fiche1 = await FicheTechnique.create({
            kilometrage: 120500,
            dateDiagnostic: new Date('2024-12-15T09:30:00'),
            dateReparation: new Date('2024-12-16T16:00:00'),
            descriptionDiagnostic: 'Contrôle technique périodique. Usure des plaquettes de frein détectée.',
            gravite: 'MAJEURE',
            reparable: true,
            etatMoteur: 'BON',
            etatFreins: 'MOYEN',
            etatSuspension: 'BON',
            etatElectrique: 'BON',
            etatCarrosserie: 'MOYEN',
            etatGeneral: 'MOYEN',
            coutPieces: 450,
            coutMainOeuvre: 200,
            dureeReparationHeures: 3,
            observationMecanicien: 'Remplacement des plaquettes avant et arrière effectué. Disques en bon état.',
            statut: 'REPARE',
            vehicule_id: vehicules[0].id
        });

        await FichePanne.bulkCreate([
            { fiche_id: fiche1.id, panne: 'Usure des plaquettes de frein avant' },
            { fiche_id: fiche1.id, panne: 'Usure des plaquettes de frein arrière' }
        ]);

        await FichePiece.bulkCreate([
            { fiche_id: fiche1.id, piece: 'Plaquettes de frein avant' },
            { fiche_id: fiche1.id, piece: 'Plaquettes de frein arrière' }
        ]);

        // Fiche 2 - Renault Clio
        const fiche2 = await FicheTechnique.create({
            kilometrage: 45200,
            dateDiagnostic: new Date('2024-12-20T14:15:00'),
            descriptionDiagnostic: 'Vidange et entretien périodique. Contrôle général du véhicule.',
            gravite: 'MINEURE',
            reparable: true,
            etatMoteur: 'BON',
            etatFreins: 'BON',
            etatSuspension: 'BON',
            etatElectrique: 'BON',
            etatCarrosserie: 'BON',
            etatGeneral: 'BON',
            coutPieces: 120,
            coutMainOeuvre: 80,
            dureeReparationHeures: 1,
            observationMecanicien: 'Vidange effectuée. Remplacement des filtres. Véhicule en excellent état.',
            statut: 'REPARE',
            vehicule_id: vehicules[1].id
        });

        await FichePiece.bulkCreate([
            { fiche_id: fiche2.id, piece: 'Huile moteur 5W30' },
            { fiche_id: fiche2.id, piece: 'Filtre à huile' },
            { fiche_id: fiche2.id, piece: 'Filtre à air' }
        ]);

        // Fiche 3 - Peugeot 208
        const fiche3 = await FicheTechnique.create({
            kilometrage: 78500,
            dateDiagnostic: new Date('2024-12-22T10:00:00'),
            descriptionDiagnostic: 'Problème de démarrage. Batterie faible détectée.',
            gravite: 'MAJEURE',
            reparable: true,
            etatMoteur: 'BON',
            etatFreins: 'BON',
            etatSuspension: 'BON',
            etatElectrique: 'MAUVAIS',
            etatCarrosserie: 'BON',
            etatGeneral: 'MOYEN',
            coutPieces: 180,
            coutMainOeuvre: 50,
            dureeReparationHeures: 1,
            observationMecanicien: 'Remplacement de la batterie. Test du système de charge OK.',
            statut: 'REPARE',
            vehicule_id: vehicules[2].id
        });

        await FichePanne.bulkCreate([
            { fiche_id: fiche3.id, panne: 'Batterie faible' },
            { fiche_id: fiche3.id, panne: 'Difficulté au démarrage' }
        ]);

        await FichePiece.bulkCreate([
            { fiche_id: fiche3.id, piece: 'Batterie 12V 70Ah' }
        ]);

        // Fiche 4 - VW Golf (en cours)
        const fiche4 = await FicheTechnique.create({
            kilometrage: 150300,
            dateDiagnostic: new Date('2024-12-28T11:30:00'),
            descriptionDiagnostic: 'Bruit suspect au niveau de la suspension. Diagnostic en cours.',
            gravite: 'MAJEURE',
            reparable: true,
            etatMoteur: 'BON',
            etatFreins: 'BON',
            etatSuspension: 'MAUVAIS',
            etatElectrique: 'BON',
            etatCarrosserie: 'MOYEN',
            etatGeneral: 'MOYEN',
            coutPieces: 0,
            coutMainOeuvre: 0,
            dureeReparationHeures: 0,
            observationMecanicien: 'Inspection en cours. Amortisseurs avant à remplacer probablement.',
            statut: 'EN_COURS',
            vehicule_id: vehicules[3].id
        });

        await FichePanne.bulkCreate([
            { fiche_id: fiche4.id, panne: 'Bruit suspension avant' },
            { fiche_id: fiche4.id, panne: 'Amortisseurs usés' }
        ]);

        // Fiche 5 - Toyota Corolla
        const fiche5 = await FicheTechnique.create({
            kilometrage: 25100,
            dateDiagnostic: new Date('2024-12-29T09:00:00'),
            descriptionDiagnostic: 'Premier entretien. Contrôle général du véhicule neuf.',
            gravite: 'MINEURE',
            reparable: true,
            etatMoteur: 'BON',
            etatFreins: 'BON',
            etatSuspension: 'BON',
            etatElectrique: 'BON',
            etatCarrosserie: 'BON',
            etatGeneral: 'BON',
            coutPieces: 95,
            coutMainOeuvre: 60,
            dureeReparationHeures: 1,
            observationMecanicien: 'Premier entretien effectué. Véhicule en parfait état.',
            statut: 'REPARE',
            vehicule_id: vehicules[4].id
        });

        await FichePiece.bulkCreate([
            { fiche_id: fiche5.id, piece: 'Huile moteur hybride' },
            { fiche_id: fiche5.id, piece: 'Filtre à huile' }
        ]);

        console.log(`✅ Created 5 technical sheets with pannes and pieces\n`);

        // 4. Créer utilisateur admin si n'existe pas
        console.log('👤 Checking admin user...');
        const existingAdmin = await User.findOne({ where: { username: 'admin' } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created (admin/admin)\n');
        } else {
            console.log('ℹ️  Admin user already exists\n');
        }

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${clients.length} clients`);
        console.log(`   - ${vehicules.length} vehicles`);
        console.log(`   - 5 technical sheets`);
        console.log(`   - Multiple pannes and pieces`);
        console.log(`   - 1 admin user\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedDatabase();
