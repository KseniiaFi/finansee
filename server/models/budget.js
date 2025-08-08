// Sequelize-malli budjetille (kuukausi + vuosi)
// Jokaisella käyttäjällä voi olla useita budjetteja (User.hasMany)
// Sama käyttäjä ei voi luoda kahta budjettia samalle kuukaudelle ja vuodelle (unique-indeksi)

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Budget = sequelize.define('Budget', {
  month: {
    type: DataTypes.INTEGER,
    allowNull: false, // Kuukausi on pakollinen
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false, // Vuosi on pakollinen
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'month', 'year'] // Uniikki yhdistelmä
    }
  ]
});

// Käyttäjällä voi olla monta budjettia
User.hasMany(Budget, { foreignKey: 'userId' });

// Budjetti kuuluu yhdelle käyttäjälle
Budget.belongsTo(User, { foreignKey: 'userId' });

module.exports = Budget;
