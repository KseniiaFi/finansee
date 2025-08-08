// Tapahtumien reitit (budjettiin liittyvät tulot ja menot)
// Kaikki reitit vaativat kirjautumisen (authMiddleware)
// Käyttäjä voi hakea, lisätä, muokata, poistaa ja ryhmitellä tapahtumia kategorioittain

const express = require('express');
const Transaction = require('../models/transaction');
const Budget = require('../models/budget');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Hae kaikki budjetin tapahtumat
router.get('/:budgetId', auth, async (req, res) => {
  try {
    // Tarkistetaan, että budjetti kuuluu kirjautuneelle käyttäjälle
    const budget = await Budget.findOne({
      where: { id: req.params.budgetId, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    const transactions = await Transaction.findAll({
      where: { budgetId: req.params.budgetId },
      order: [['date', 'DESC']],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Lisää uusi tapahtuma
router.post('/:budgetId', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { id: req.params.budgetId, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    const { type, category, amount, date, comment } = req.body;
    const transaction = await Transaction.create({
      budgetId: budget.id,
      type,
      category,
      amount,
      date,
      comment,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Poista tapahtuma
router.delete('/:budgetId/:transactionId', auth, async (req, res) => {
  try {
    // Tarkistetaan, että budjetti kuuluu kirjautuneelle käyttäjälle
    const budget = await Budget.findOne({
      where: { id: req.params.budgetId, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    // Poistetaan vain oma tapahtuma
    const count = await Transaction.destroy({
      where: { id: req.params.transactionId, budgetId: budget.id }
    });
    if (count === 0) {
      return res.status(404).json({ message: 'Tapahtumaa ei löytynyt' });
    }
    res.json({ message: 'Tapahtuma poistettu' });
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Muokkaa tapahtumaa
router.put('/:budgetId/:transactionId', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { id: req.params.budgetId, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }
    const transaction = await Transaction.findOne({
      where: { id: req.params.transactionId, budgetId: budget.id }
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Tapahtumaa ei löytynyt' });
    }
    const { type, category, amount, date, comment } = req.body;
    transaction.type = type;
    transaction.category = category;
    transaction.amount = amount;
    transaction.date = date;
    transaction.comment = comment;
    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

// Ryhmittele budjetin tapahtumat kategorioittain
router.get('/:budgetId/categories', auth, async (req, res) => {
  try {
    const { budgetId } = req.params;
    const { type } = req.query; // "income" (tulot) tai "expense" (menot), valinnainen parametri

    // Tarkistetaan käyttäjän budjetti
    const budget = await Budget.findOne({
      where: { id: budgetId, userId: req.user.userId }
    });
    if (!budget) {
      return res.status(404).json({ message: 'Budjettia ei löytynyt' });
    }

    // Rakennetaan kysely
    const where = { budgetId };
    if (type) where.type = type;

    // Ryhmittely kategorioittain summan ja summalistauksen kanssa
    const { Sequelize } = require('sequelize');
    const result = await Transaction.findAll({
      where,
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total'],
        [Sequelize.fn('GROUP_CONCAT', Sequelize.col('amount')), 'amounts']
      ],
      group: ['category']
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Palvelinvirhe', error: error.message });
  }
});

module.exports = router;
