// Budjetin reitit (GET, POST, DELETE)
// Kaikki reitit vaativat kirjautumisen (authMiddleware)
// Käyttäjä voi hakea, luoda ja poistaa omia budjettejaan

const express = require('express');
const Budget = require('../models/budget');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Hae kaikki käyttäjän budjetit
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user.userId },
      order: [['year', 'DESC'], ['month', 'DESC']],
    });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Luo uusi budjetti
router.post('/', auth, async (req, res) => {
  try {
    const { month, year } = req.body;

    // Tarkistetaan: onko käyttäjällä jo budjetti tälle kuukaudelle ja vuodelle?
    const exists = await Budget.findOne({
      where: { userId: req.user.userId, month, year }
    });
    if (exists) {
      return res.status(409).json({ message: 'Budjetti tälle kuukaudelle on jo olemassa' });
    }

    const budget = await Budget.create({
      userId: req.user.userId,
      month,
      year,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Hae budjetti ID:n perusteella
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Poista budjetti ID:n perusteella
router.delete('/:id', auth, async (req, res) => {
  try {
    const count = await Budget.destroy({
      where: { id: req.params.id, userId: req.user.userId }
    });
    if (count === 0) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    res.json({ message: 'Budjetti poistettu' });
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

module.exports = router;
