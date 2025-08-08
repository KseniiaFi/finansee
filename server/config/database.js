// Tietokantayhteyden konfiguraatio (Sequelize + SQLite)
// Luodaan yhteys SQLite-tietokantaan ja asetetaan tiedostopolku
// logging: false poistaa SQL-lokit konsolista

const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite', // Käytetään SQLite-tietokantaa
  storage: path.join(__dirname, '..', 'database.sqlite'), // Tietokantatiedoston sijainti
  logging: false // Estetään SQL-lauseiden tulostus konsoliin
});

module.exports = sequelize;
