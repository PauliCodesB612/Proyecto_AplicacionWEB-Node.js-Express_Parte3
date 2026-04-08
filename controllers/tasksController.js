const { Task, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { isValidId, createHttpError } = require('../utils/validators');

const allowedStatuses = ['pending', 'in_progress', 'done'];

const validateTaskPayload = (payload, isPartial = false) => {
  if (!isPartial || payload.title !== undefined) {
    if (!payload.title || String(payload.title).trim().length < 3) {
      throw createHttpError(400, 'El título es obligatorio y debe tener al menos 3 caracteres.');
    }
  }

  if (payload.status !== undefined && !allowedStatuses.includes(payload.status)) {
    throw createHttpError(400, 'El estado debe ser pending, in_progress o done.');
  }

  if ((!isPartial || payload.userId !== undefined) && !isValidId(payload.userId)) {
    throw createHttpError(400, 'Debes indicar un userId válido.');
  }
};

exports.getTasks = asyncHandler(async (req, res) => {
  const where = {};

  if (req.query.status) {
    if (!allowedStatuses.includes(req.query.status)) {
      throw createHttpError(400, 'El filtro status debe ser pending, in_progress o done.');
    }
    where.status = req.query.status;
  }

  if (req.query.userId !== undefined) {
    if (!isValidId(req.query.userId)) {
      throw createHttpError(400, 'El filtro userId debe ser un número entero positivo.');
    }
    where.userId = Number(req.query.userId);
  }

  const tasks = await Task.findAll({
    where,
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['id', 'ASC']],
  });

  return sendResponse(res, 200, 'Tareas obtenidas correctamente.', tasks);
});

exports.getTaskById = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID de la tarea debe ser un número entero positivo.');
  }

  const task = await Task.findByPk(req.params.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
  });

  if (!task) {
    return sendResponse(res, 404, 'Tarea no encontrada.');
  }

  return sendResponse(res, 200, 'Tarea obtenida correctamente.', task);
});

exports.createTask = asyncHandler(async (req, res) => {
  validateTaskPayload(req.body);

  const user = await User.findByPk(req.body.userId);
  if (!user) {
    return sendResponse(res, 404, 'No existe un usuario con el userId indicado.');
  }

  const task = await Task.create({
    title: String(req.body.title).trim(),
    description: req.body.description,
    status: req.body.status,
    userId: Number(req.body.userId),
  });

  return sendResponse(res, 201, 'Tarea creada correctamente.', task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID de la tarea debe ser un número entero positivo.');
  }

  validateTaskPayload(req.body, true);

  const task = await Task.findByPk(req.params.id);

  if (!task) {
    return sendResponse(res, 404, 'Tarea no encontrada.');
  }

  if (req.body.userId !== undefined) {
    const user = await User.findByPk(req.body.userId);
    if (!user) {
      return sendResponse(res, 404, 'No existe un usuario con el userId indicado.');
    }
    task.userId = Number(req.body.userId);
  }

  if (req.body.title !== undefined) task.title = String(req.body.title).trim();
  if (req.body.description !== undefined) task.description = req.body.description;
  if (req.body.status !== undefined) task.status = req.body.status;

  await task.save();

  return sendResponse(res, 200, 'Tarea actualizada correctamente.', task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  if (!isValidId(req.params.id)) {
    throw createHttpError(400, 'El ID de la tarea debe ser un número entero positivo.');
  }

  const task = await Task.findByPk(req.params.id);

  if (!task) {
    return sendResponse(res, 404, 'Tarea no encontrada.');
  }

  await task.destroy();
  return sendResponse(res, 200, 'Tarea eliminada correctamente.');
});
