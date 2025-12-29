const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // For demonstration, create a user if not exists (or seeded)
        // ideally, you'd have a seed script.
        // CHECK if user exists
        let user = await User.findOne({ where: { email } });

        // If no user found, strictly for dev simplicity/demo, create one if it matches a hardcoded "admin" creds
        // OR better, just return 401. 
        // Let's implement a real check.
        
        if (!user) {
             return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

        res.json({
            access_token: token,
            token_type: 'Bearer',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper middleware for protected routes
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = await User.findByPk(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized' });
    }
};
