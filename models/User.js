const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre es obligatorio.' },
        len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres.' },
      },
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: { msg: 'El correo ya está registrado.' },
      validate: {
        isEmail: { msg: 'Debes ingresar un correo válido.' },
        notEmpty: { msg: 'El correo es obligatorio.' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La contraseña es obligatoria.' },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'editor', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
  }
);

module.exports = User;
