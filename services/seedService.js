const { User, Task } = require('../models');
const { hashPassword } = require('../utils/auth');

const seedDatabase = async () => {
  const usersCount = await User.count();

  if (usersCount === 0) {
    const defaultPassword = await hashPassword('Pauli1234');

    const users = await User.bulkCreate([
      {
        name: 'Paulina Admin',
        email: 'paulina.admin@example.com',
        password: defaultPassword,
        role: 'admin',
        active: true,
      },
      {
        name: 'Equipo Editor',
        email: 'editor@example.com',
        password: defaultPassword,
        role: 'editor',
        active: true,
      },
      {
        name: 'Usuario Viewer',
        email: 'viewer@example.com',
        password: defaultPassword,
        role: 'viewer',
        active: true,
      },
    ]);

    await Task.bulkCreate([
      {
        title: 'Revisar documentación inicial',
        description: 'Validar la estructura general del backend antes de exponer la API.',
        status: 'pending',
        userId: users[0].id,
      },
      {
        title: 'Ajustar rutas protegidas',
        description: 'Verificar autenticación y autorización con JWT.',
        status: 'in_progress',
        userId: users[1].id,
      },
      {
        title: 'Preparar capturas de Postman',
        description: 'Generar evidencia de endpoints públicos, privados y subida de archivos.',
        status: 'done',
        userId: users[2].id,
      },
    ]);
  }
};

module.exports = seedDatabase;
