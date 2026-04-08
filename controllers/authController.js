const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { createHttpError, isValidEmail, parseBoolean } = require('../utils/validators');
const { hashPassword, comparePassword, signToken } = require('../utils/auth');

const sanitizeUser = (userInstance) => ({
  id: userInstance.id,
  name: userInstance.name,
  email: userInstance.email,
  role: userInstance.role,
  active: userInstance.active,
  avatar: userInstance.avatar,
  createdAt: userInstance.createdAt,
  updatedAt: userInstance.updatedAt,
});

const validateRegisterPayload = (payload) => {
  if (!payload.name || String(payload.name).trim().length < 2) {
    throw createHttpError(400, 'El nombre es obligatorio y debe tener al menos 2 caracteres.');
  }

  if (!isValidEmail(payload.email)) {
    throw createHttpError(400, 'Debes ingresar un correo válido.');
  }

  if (!payload.password || String(payload.password).length < 6) {
    throw createHttpError(400, 'La contraseña es obligatoria y debe tener al menos 6 caracteres.');
  }
};

exports.register = asyncHandler(async (req, res) => {
  validateRegisterPayload(req.body);

  const existingUser = await User.findOne({ where: { email: String(req.body.email).trim().toLowerCase() } });
  if (existingUser) {
    return sendResponse(res, 409, 'El correo ya está registrado.');
  }

  const user = await User.create({
    name: String(req.body.name).trim(),
    email: String(req.body.email).trim().toLowerCase(),
    password: await hashPassword(String(req.body.password)),
    role: req.body.role || 'viewer',
    active: parseBoolean(req.body.active) ?? true,
  });

  const token = signToken(user);

  return sendResponse(res, 201, 'Usuario registrado correctamente.', {
    user: sanitizeUser(user),
    token,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!isValidEmail(email) || !password) {
    throw createHttpError(400, 'Debes enviar email y password válidos.');
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return sendResponse(res, 401, 'Credenciales inválidas.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return sendResponse(res, 401, 'Credenciales inválidas.');
  }

  if (!user.active) {
    return sendResponse(res, 403, 'El usuario está inactivo.');
  }

  const token = signToken(user);

  return sendResponse(res, 200, 'Login realizado correctamente.', {
    user: sanitizeUser(user),
    token,
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);
  return sendResponse(res, 200, 'Perfil obtenido correctamente.', sanitizeUser(user));
});
