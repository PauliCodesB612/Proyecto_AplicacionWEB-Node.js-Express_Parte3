const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const sendResponse = require('../utils/apiResponse');
const { createHttpError, isValidId } = require('../utils/validators');

exports.uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Debes adjuntar un archivo en el campo avatar.');
  }

  let linkedUser = null;
  const requestedUserId = req.body.userId || req.user?.id;

  if (requestedUserId !== undefined) {
    if (!isValidId(requestedUserId)) {
      throw createHttpError(400, 'El userId debe ser un número entero positivo.');
    }

    linkedUser = await User.findByPk(requestedUserId);
    if (!linkedUser) {
      return sendResponse(res, 404, 'No existe un usuario con el userId indicado.');
    }

    linkedUser.avatar = `/uploads/${req.file.filename}`;
    await linkedUser.save();
  }

  return sendResponse(res, 201, 'Archivo subido correctamente.', {
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    },
    user: linkedUser
      ? {
          id: linkedUser.id,
          name: linkedUser.name,
          email: linkedUser.email,
          avatar: linkedUser.avatar,
        }
      : null,
  });
});
