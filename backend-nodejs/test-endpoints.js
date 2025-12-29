// const fetch = require('node-fetch'); // Native fetch in Node 18+

// Helper to run fetch if node version < 18, otherwise assume global fetch
const apiFetch = async (url, options) => {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (e) {
        return { error: e.message };
    }
}

async function runTests() {
    console.log('--- Starting Tests ---');
    const baseUrl = 'http://localhost:3000/api';

    // 1. Login (assuming user created or check failing if no user)
    // Note: Since we didn't seed a user, we might need to rely on the "admin" check or create one if we added a register route.
    // Looking at AuthController, it checks DB. So we need a user. 
    // Wait! I didn't add a register route or seed script. 
    // I should probably quickly seed a user via a script or add register route. 
    // Let's create a seed script first actually.

    // BUT for now, let's try to hit the stats endpoint which might not be protected?
    // StatsController doesn't seem to use 'protect' middleware in the route definition I wrote (router.get('/', StatsController.index)).
    
    console.log('Testing Stats (Public)...');
    const stats = await apiFetch(`${baseUrl}/stats`);
    console.log('Stats:', stats);

    // 2. Create Client
    console.log('Creating Client...');
    const clientRes = await apiFetch(`${baseUrl}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nom: 'Doe',
            prenom: 'John',
            telephone: '1234567890'
        })
    });
    console.log('Create Client Status:', clientRes.status);
    const clientId = clientRes.data?.id;

    if (clientId) {
        // 3. Create Vehicule
        console.log('Creating Vehicule...');
        const vehiculeRes = await apiFetch(`${baseUrl}/vehicules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                immatriculation_part1: '12',
                immatriculation_part2: 'A',
                immatriculation_part3: '12345',
                marque: 'Toyota',
                modele: 'Corolla',
                client_id: clientId
            })
        });
        console.log('Create Vehicule Status:', vehiculeRes.status);
        const vehiculeId = vehiculeRes.data?.id;

        if (vehiculeId) {
             // 4. Create Fiche
            console.log('Creating Fiche...');
            const ficheRes = await apiFetch(`${baseUrl}/fiches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date_diagnostic: '2023-10-27',
                    kilometrage: 50000,
                    vehicule_id: vehiculeId
                })
            });
            console.log('Create Fiche Status:', ficheRes.status);
        }
    }

    console.log('--- Tests Completed ---');
}

runTests();
