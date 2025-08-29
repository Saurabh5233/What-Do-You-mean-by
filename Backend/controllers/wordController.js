const SavedWord = require('../models/SavedWord');
const History = require('../models/History');

exports.getSavedWords = async (req, res) => {
  try {
    const words = await SavedWord.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.saveWord = async (req, res) => {
  const { word, synonyms, meaning } = req.body;

  try {
    let savedWord = await SavedWord.findOne({ user: req.user.id, word });

    if (savedWord) {
      return res.status(400).json({ msg: 'Word already saved' });
    }

    savedWord = new SavedWord({
      user: req.user.id,
      word,
      synonyms,
      meaning,
    });

    await savedWord.save();
    res.json(savedWord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteSavedWords = async (req, res) => {
  const { ids } = req.body;
  try {
    await SavedWord.deleteMany({ _id: { $in: ids }, user: req.user.id });
    res.json({ msg: 'Words deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.saveHistory = async (req, res) => {
  const { word } = req.body;

  try {
    let historyItem = await History.findOne({ user: req.user.id, word });

    if (historyItem) {
      historyItem.date = new Date();
      await historyItem.save();
      return res.json(historyItem);
    }

    historyItem = new History({
      user: req.user.id,
      word,
    });

    await historyItem.save();
    res.json(historyItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteHistoryItems = async (req, res) => {
  const { ids } = req.body;
  try {
    await History.deleteMany({ _id: { $in: ids }, user: req.user.id });
    res.json({ msg: 'History items deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
