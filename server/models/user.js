// Sequelize-malli käyttäjälle (User)
// Kentät: sähköposti (unique + email-validointi) ja salasana
// Käyttäjiä käytetään kirjautumiseen ja tunnistautumiseen
// Модель пользователя в Sequelize (User)
// Поля: email (уникальный + валидация как email) и пароль
// Пользователи используются для входа и аутентификации

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = User;
