// middlewares/logger.js
// Middleware que registra cada visita en el archivo logs/log.txt
// Se ejecuta automáticamente en CADA petición al servidor gracias a app.use()

const fs = require("fs");
const path = require("path");

// Ruta absoluta al archivo de log
const logPath = path.join(__dirname, "../logs/log.txt");

// Función que arma la línea de log con fecha, hora y ruta accedida
const loggerMiddleware = (req, res, next) => {
  const now = new Date();

  // Formato: [YYYY-MM-DD] [HH:MM:SS] MÉTODO /ruta
  const fecha = now.toLocaleDateString("es-CL");
  const hora = now.toLocaleTimeString("es-CL");
  const linea = `[${fecha}] [${hora}] ${req.method} ${req.originalUrl}\n`;

  // fs.appendFile agrega la línea al final del archivo sin sobreescribir
  // Si log.txt no existe, lo crea automáticamente
  fs.appendFile(logPath, linea, (err) => {
    if (err) {
      console.error("❌ Error al escribir en log.txt:", err.message);
    }
  });

  // next() pasa el control al siguiente middleware o a la ruta correspondiente
  next();
};

module.exports = loggerMiddleware;