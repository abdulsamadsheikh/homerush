
const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  try {
    const { title, description, pointValue } = req.body;
    const user = await User.findById(req.user.id);

    const newTask = new Task({
      title,
      description,
      pointValue,
      household: user.household,
      createdBy: user.id,
    });

    const task = await newTask.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const tasks = await Task.find({ household: user.household });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    const user = await User.findById(req.user.id);

    // Ensure user is in the same household as the task
    if (task.household.toString() !== user.household.toString()) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    user.score += task.pointValue;
    await user.save();

    await Task.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Task completed', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
