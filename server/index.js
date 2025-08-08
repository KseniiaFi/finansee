// Palvelimen käynnistyspiste (index.js)
// Lataa Express-sovellus ja käynnistää sen määritellyllä portilla

const app = require('./app');

const PORT = process.env.PORT || 5000;

// Palvelimen käynnistys
app.listen(PORT, () => {
  console.log(`Palvelin käynnistetty portissa ${PORT}`);
});
