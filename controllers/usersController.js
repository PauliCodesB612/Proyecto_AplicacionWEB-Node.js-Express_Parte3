const { QueryTypes } = require('sequelize');
const { sequelize, User, Task } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { isValidId, parseBoolean, createHttpError, isValidEmail } = require('../utils/validators');
const { hashPassword } = require('../utils/auth');

const buildUserFilters = (query) => {
  const where = {};

  if (query.name) {
    where.name = sequelize.where(
      sequelize.fn('LOWER', sequelize.col('User.name')),
      'LIKE',
      `%${query.name.toLowerCase()}%`
    );
  }

  if (query.role) {
    where.role = query.role;
  }

  const active = parseBoolean(query.active);
  if (active !== undefined) {
    where.active = active;
  }

  return where;
};

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

const validateUserPayload = (payload, isPartial = false) => {
  const allowedRoles = ['admin', 'editor', 'viewer'];

  if (!isPartial || payload.name !== undefined) {
    if (!payload.name || String(payload.name).trim().length < 2) {
      throw createHttpError(400, 'El nombre es obligatorio y debe tener al menos 2 caracteres.');
    }
  }

  if (!isPartial || payload.email !== undefined) {
    const email = String(payload.email || '').trim();
    if (!email) {
      throw createHttpError(400, 'El correo es obligatorio.');
    }
    if (!isValidEmail(email)) {
      throw createHttpError(400, 'Debes ingresar un correo válido.');
    }
  }

  if (!isPartial || payload.password !== undefined) {
    if (!payload.password || String(payload.password).length < 6) {
      throw createHttpError(400, 'La contraseña es obligatoria y debe tener al menos 6 caracteres.');
    }
  }

  if (payload.role !== undefined && !allowedRoles.includes(payload.role)) {
    throw createHttpError(400, 'El rol debe ser admin, editor o viewer.');
  }

  if (payload.active !== undefined) {
    const active = parseBoolean(payload.active);
    if (active === undefined) {
      throw createHttpError(400, 'El campo active debe ser true o false.');
    }
  }
};

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    where: buildUserFilters(req.query),
    order: [['id', 'ASC']],
  });

  return sendResponse(res, 200, 'Usuarios obtenidos correctamente.', users.map(sanitizeUser));
});

exports.getUsersRaw = asyncHandler(async (_req, res) => {
  const users = await sequelize.query(
    'SELECT id, name, email, role, active, avatar, created_at AS "createdAt", updated_at AS "updatedAt" FROM users ORDER BY id ASC',
    { type: QueryTypes.SELECT }
  );

  return sendResponse(res, 200, 'Usuarios obtenidos correctamente con SQL manual.', users);
});

exports.getUserById = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID del usuario debe ser un número entero positivo.');
  }

  const user = await User.findByPk(req.params.id, {
    include: [{ model: Task, as: 'tasks' }],
    order: [[{ model: Task, as: 'tasks' }, 'id', 'ASC']],
  });

  if (!user) {
    return sendResponse(res, 404, 'Usuario no encontrado.');
  }

  return sendResponse(res, 200, 'Usuario obtenido correctamente.', {
    ...sanitizeUser(user),
    tasks: user.tasks,
  });
});

exports.createUser = asyncHandler(async (req, res) => {
  validateUserPayload(req.body);

  const user = await User.create({
    name: String(req.body.name).trim(),
    email: String(req.body.email).trim().toLowerCase(),
    password: await hashPassword(String(req.body.password)),
    role: req.body.role,
    active: parseBoolean(req.body.active),
  });

  return sendResponse(res, 201, 'Usuario creado correctamente.', sanitizeUser(user));
});

exports.updateUser = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID del usuario debe ser un número entero positivo.');
  }

  validateUserPayload(req.body, true);

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return sendResponse(res, 404, 'Usuario no encontrado.');
  }

  const fieldsToUpdate = ['name', 'email', 'role', 'active'];
  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'name') user[field] = String(req.body[field]).trim();
      else if (field === 'email') user[field] = String(req.body[field]).trim().toLowerCase();
      else if (field === 'active') user[field] = parseBoolean(req.body[field]);
      else user[field] = req.body[field];
    }
  });

  if (req.body.password !== undefined) {
    user.password = await hashPassword(String(req.body.password));
  }

  await user.save();

  return sendResponse(res, 200, 'Usuario actualizado correctamente.', sanitizeUser(user));
});

exports.deleteUser = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID del usuario debe ser un número entero positivo.');
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return sendResponse(res, 404, 'Usuario no encontrado.');
  }

  await user.destroy();

  return sendResponse(res, 200, 'Usuario eliminado correctamente.');
});

exports.getUserTasks = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID del usuario debe ser un número entero positivo.');
  }

  const user = await User.findByPk(req.params.id, {
    include: [{ model: Task, as: 'tasks' }],
    order: [[{ model: Task, as: 'tasks' }, 'id', 'ASC']],
  });

  if (!user) {
    return sendResponse(res, 404, 'Usuario no encontrado.');
  }

  return sendResponse(res, 200, 'Tareas del usuario obtenidas correctamente.', {
    user: sanitizeUser(user),
    tasks: user.tasks,
  });
});

exports.createUserWithWelcomeTask = asyncHandler(async (req, res) => {
  validateUserPayload(req.body);

  const result = await sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        name: String(req.body.name).trim(),
        email: String(req.body.email).trim().toLowerCase(),
        password: await hashPassword(String(req.body.password)),
        role: req.body.role,
        active: parseBoolean(req.body.active),
      },
      { transaction }
    );

    await Task.create(
      {
        title: req.body.taskTitle || 'Completar bienvenida al sistema',
        description: 'Tarea generada automáticamente durante la transacción.',
        status: 'pending',
        userId: user.id,
      },
      { transaction }
    );

    if (req.body.forceError === true || req.body.forceError === 'true') {
      throw createHttpError(400, 'Rollback forzado para demostrar transaccionalidad.');
    }

    return user;
  });

  return sendResponse(
    res,
    201,
    'Usuario y tarea inicial creados correctamente mediante transacción.',
    sanitizeUser(result)
  );
});
