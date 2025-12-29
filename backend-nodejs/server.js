require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes (to be imported)
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const visiteTechniqueRoutes = require('./routes/ficheTechniqueRoutes');
const statsRoutes = require('./routes/statsRoutes');
const migrationRoutes = require('./routes/migrationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/fiches', visiteTechniqueRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/migration', migrationRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Backend Node.js is running' });
});

// Sync Database and Start Server
sequelize.sync({ force: false }) // Set force: true to drop tables during dev if needed
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
