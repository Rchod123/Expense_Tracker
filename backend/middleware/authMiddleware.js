// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_super_secret_key');
    
    // Normalize user ID depending on what was stored in jwt.sign()
    req.user = {
      userId: decoded.userId || decoded.id || decoded._id,
      email: decoded.email
    };
    next();
  } catch (error) {
    console.error(" JWT Error:", error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;