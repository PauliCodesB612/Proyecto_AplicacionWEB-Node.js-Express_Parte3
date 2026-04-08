// models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título es obligatorio.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'done'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'tasks',
  }
);

module.exports = Task;
