const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendResponse = require('../utils/apiResponse');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, 'Debes enviar un token Bearer válido.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.active) {
      return sendResponse(res, 401, 'El token es válido, pero el usuario no está disponible.');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendResponse(res, 401, 'El token ha expirado.');
    }

    return sendResponse(res, 401, 'Token inválido o malformado.');
  }
};

module.exports = authMiddleware;
