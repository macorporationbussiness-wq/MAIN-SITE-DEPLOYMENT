const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const auth = require('../middleware/auth');
const { portfolios: fallbackPortfolios } = require('../data/fallback');

// @route   GET api/portfolios
// @desc    Get all portfolios (optionally by teamMember)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.teamMember) filter.teamMember = req.query.teamMember;
        const portfolios = await Portfolio.find(filter)
            .populate('teamMember', 'name position photo')
            .sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (err) {
        console.error('DB unavailable, serving fallback portfolios:', err.message);
        let list = fallbackPortfolios;
        if (req.query.teamMember)
            list = list.filter((p) => p.teamMember && p.teamMember.name === req.query.teamMember);
        res.json(list);
    }
});

// @route   GET api/portfolios/all
// @desc    Get all portfolios (admin)
// @access  Private
router.get('/all', auth, async (req, res) => {
    try {
        const portfolios = await Portfolio.find()
            .populate('teamMember', 'name position photo')
            .sort({ createdAt: -1 });
        res.json(portfolios);
    } catch (err) {
        console.error('DB unavailable, serving fallback portfolios:', err.message);
        res.json(fallbackPortfolios);
    }
});

// @route   GET api/portfolios/:slug
// @desc    Get a single portfolio by slug or _id
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        let portfolio = await Portfolio.findOne({ slug })
            .populate('teamMember', 'name position photo');
        if (!portfolio) {
            portfolio = await Portfolio.findById(slug)
                .populate('teamMember', 'name position photo');
        }
        if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
        res.json(portfolio);
    } catch (err) {
        console.error('DB unavailable, serving fallback portfolio:', err.message);
        const item = fallbackPortfolios.find(
            (p) => p.slug === req.params.slug || String(p._id) === req.params.slug
        );
        if (!item) return res.status(404).json({ msg: 'Portfolio not found' });
        res.json(item);
    }
});

// @route   POST api/portfolios
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { teamMember, ...rest } = req.body;
        const data = { ...rest };
        if (teamMember) data.teamMember = teamMember;
        let portfolio = new Portfolio(data);
        await portfolio.save();
        res.json(portfolio);
    } catch (err) {
        console.error('DB unavailable, adding portfolio to fallback:', err.message);
        // Fallback: add to in-memory array with a temporary ID
        const { teamMember, ...rest } = req.body;
        const newPortfolio = { ...rest, _id: 'fb_' + Date.now(), teamMember: teamMember || { name: 'Unknown', position: '—' } };
        fallbackPortfolios.unshift(newPortfolio);
        res.json(newPortfolio);
    }
});

// @route   PUT api/portfolios/:id
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { teamMember, ...rest } = req.body;
        const update = { $set: { ...rest } };
        if (teamMember) update.$set.teamMember = teamMember;
        else update.$unset = { teamMember: 1 };
        const portfolio = await Portfolio.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        );
        if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
        res.json(portfolio);
    } catch (err) {
        console.error('DB unavailable, updating fallback portfolio:', err.message);
        // Fallback: update in-memory array
        const { teamMember, ...rest } = req.body;
        const idx = fallbackPortfolios.findIndex((p) => p._id === req.params.id);
        if (idx === -1) return res.status(404).json({ msg: 'Portfolio not found' });
        const updated = { ...fallbackPortfolios[idx], ...rest, _id: req.params.id, teamMember: teamMember || { name: 'Unknown', position: '—' } };
        fallbackPortfolios[idx] = updated;
        res.json(updated);
    }
});

// @route   DELETE api/portfolios/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ msg: 'Portfolio not found' });
        await Portfolio.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Portfolio removed' });
    } catch (err) {
        console.error('DB unavailable, deleting fallback portfolio:', err.message);
        const idx = fallbackPortfolios.findIndex((p) => p._id === req.params.id);
        if (idx === -1) return res.status(404).json({ msg: 'Portfolio not found' });
        fallbackPortfolios.splice(idx, 1);
        res.json({ msg: 'Portfolio removed' });
    }
});

module.exports = router;
