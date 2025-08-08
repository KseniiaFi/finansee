// Reitit käyttäjän rekisteröintiä ja kirjautumista varten (auth.js)
// Rekisteröinti: tarkistaa sähköpostin, hashää salasanan ja luo käyttäjän
// Kirjautuminen: tarkistaa käyttäjän, vertaa salasanaa ja palauttaa JWT-tokenin

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Rekisteröinti
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tarkistetaan onko käyttäjä jo olemassa
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Käyttäjä on jo olemassa' });
    }

    // Hashataan salasana
    const hashedPassword = await bcrypt.hash(password, 10);

    // Luodaan uusi käyttäjä
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Käyttäjä luotu', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Palvelinvirhe', error: err.message });
  }
});

// Kirjautuminen
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Etsitään käyttäjä sähköpostilla
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    // Verrataan salasanoja
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Virheellinen sähköposti tai salasana' });
    }

    // Luodaan JWT-token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'devsecret', // siirrä myöhemmin .env-tiedostoon!
      { expiresIn: '7d' }
    );

    res.json({ message: 'Kirjautuminen onnistui', token, user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Palvelinvirhe', error: err.message });
  }
});

module.exports = router;
