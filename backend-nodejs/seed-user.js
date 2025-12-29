const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10);
        // Delete existing admin for clean start
        await User.destroy({ where: { email: 'admin' } });
        
        const user = await User.create({
            name: 'Admin',
            email: 'admin',
            password: hashedPassword
        });
        console.log('Admin user created successfully with credentials: admin / admin');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seed();
