const statusController = {
  getStatus: (_req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'El servidor está en funcionamiento',
      data: {
        app: process.env.APP_NAME || 'Node-Express-WebApp',
        entorno: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())} segundos`,
        database: process.env.DB_NAME || 'Sin configurar',
        dialect: process.env.DB_DIALECT || 'postgres',
        jwt: 'habilitado',
        uploadsPath: '/uploads',
      },
    });
  },
};

module.exports = statusController;
