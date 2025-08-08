// Sequelize-malli yksittäiselle tapahtumalle (Transaction)
// Tapahtuma voi olla tulot tai menot, ja se kuuluu tiettyyn budjettiin
// Kentät: tyyppi, kategoria, summa, päivämäärä ja kommentti

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Budget = require('./budget');

const Transaction = sequelize.define('Transaction', {
  type: { // 'income' (tulot) tai 'expense' (menot)
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

// Budjetilla voi olla monta tapahtumaa
Budget.hasMany(Transaction, { foreignKey: 'budgetId' });

// Tapahtuma kuuluu yhdelle budjetille
Transaction.belongsTo(Budget, { foreignKey: 'budgetId' });

module.exports = Transaction;
