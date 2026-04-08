// index.js - Archivo principal del servidor
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const router = require('./routes/router');
const loggerMiddleware = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { sequelize } = require('./models');
const seedDatabase = require('./services/seedService');

const app = express();
const uploadsPath = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsPath));
app.use(loggerMiddleware);

app.use('/', router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    await sequelize.sync();
    console.log('🗃️ Modelos sincronizados correctamente.');

    await seedDatabase();
    console.log('🌱 Datos iniciales verificados.');

    app.listen(PORT, () => {
      console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
      console.log(`📁 Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ No fue posible iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
