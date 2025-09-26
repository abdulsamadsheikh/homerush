
const express = require('express');
const router = express.Router();
const {
  createHousehold,
  joinHousehold,
  getHouseholdData,
} = require('../controllers/householdController');
const auth = require('../middleware/auth');

router.post('/', auth, createHousehold);
router.post('/join', auth, joinHousehold);
router.get('/', auth, getHouseholdData);

module.exports = router;
