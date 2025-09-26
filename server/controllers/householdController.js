
const Household = require('../models/Household');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

exports.createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.id);

    if (user.household) {
      return res.status(400).json({ msg: 'User already in a household' });
    }

    const newHousehold = new Household({
      name,
      inviteCode: uuidv4(),
      members: [user.id],
    });

    const household = await newHousehold.save();

    user.household = household.id;
    await user.save();

    res.json(household);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    const user = await User.findById(req.user.id);

    if (user.household) {
      return res.status(400).json({ msg: 'User already in a household' });
    }

    const household = await Household.findOne({ inviteCode });
    if (!household) {
      return res.status(400).json({ msg: 'Invalid invite code' });
    }

    household.members.push(user.id);
    await household.save();

    user.household = household.id;
    await user.save();

    res.json(household);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getHouseholdData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('household');
    if (!user.household) {
      return res.status(400).json({ msg: 'User not in a household' });
    }

    const household = await Household.findById(user.household.id).populate(
      'members',
      'username score'
    );

    res.json(household);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
