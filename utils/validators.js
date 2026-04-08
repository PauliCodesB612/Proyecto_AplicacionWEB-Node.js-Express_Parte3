const isValidId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

const parseBoolean = (value) => {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
};

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());

module.exports = {
  isValidId,
  parseBoolean,
  createHttpError,
  isValidEmail,
};
