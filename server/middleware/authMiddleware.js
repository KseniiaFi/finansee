// Väliohjelma (middleware), joka tarkistaa käyttäjän JWT-tokenin
// Hakee tokenin Authorization-otsikosta ja varmistaa sen oikeellisuuden
// Jos token on voimassa, käyttäjän tiedot lisätään req.user-muuttujaan
// Muussa tapauksessa palautetaan 401 (ei oikeuksia)

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Haetaan token Authorization-otsikosta: Bearer <token>
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Ei tokenia, pääsy evätty' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Varmistetaan ja puretaan token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    req.user = decoded; // Tallennetaan käyttäjätiedot req.user-muuttujaan
    next(); // OK – jatketaan seuraavaan väliin
  } catch (error) {
    return res.status(401).json({ message: 'Virheellinen tai vanhentunut token' });
  }
};
