// Express-palvelimen pääasetus (app.js)
// Lataa mallit, synkronoi tietokannan ja rekisteröi reitit
// Käytetään CORS:ia ja JSON-parseria

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Mallien tuonti
const User = require('./models/user');
const Budget = require('./models/budget');
const Transaction = require('./models/transaction');

// Mallien synkronointi tietokantaan (luo taulut jos niitä ei ole)
(async () => {
  await User.sync();
  await Budget.sync();
  await Transaction.sync();
})();

// Middlewarejen käyttöönotto
app.use(cors());
app.use(express.json());

// Testireitti (voi jättää nopeaa tarkistusta varten)
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Finansee API toimii!' });
});

// Auth-reittien käyttöönotto
app.use('/api/auth', require('./routes/auth'));

// Budjettireittien käyttöönotto
app.use('/api/budgets', require('./routes/budget'));

// Tapahtumareittien käyttöönotto
app.use('/api/transactions', require('./routes/transaction'));

// Sovelluksen vienti (module.exports)
module.exports = app;
