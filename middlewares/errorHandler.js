const multer = require('multer');
const sendResponse = require('../utils/apiResponse');

const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, 400, 'El archivo excede el tamaño máximo permitido.');
    }
    return sendResponse(res, 400, 'Error al procesar la subida del archivo.');
  }

  if (err.name === 'SequelizeValidationError') {
    return sendResponse(
      res,
      400,
      'Error de validación en la base de datos.',
      err.errors.map((error) => ({ field: error.path, message: error.message }))
    );
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return sendResponse(
      res,
      409,
      'Ya existe un registro con un valor único duplicado.',
      err.errors.map((error) => ({ field: error.path, message: error.message }))
    );
  }

  if (err.name === 'SequelizeDatabaseError') {
    return sendResponse(res, 500, 'Error al ejecutar la consulta en la base de datos.');
  }

  return sendResponse(res, err.statusCode || 500, err.message || 'Error interno del servidor.');
};

module.exports = errorHandler;
