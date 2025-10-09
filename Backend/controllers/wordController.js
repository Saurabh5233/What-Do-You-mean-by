const SavedWord = require('../models/SavedWord');
const History = require('../models/History');

// Define word endpoint
exports.defineWord = async (req, res) => { 
  const { word, language = 'en' } = req.body;
  if (!word) return res.status(400).json({ message: "Word is required" });

  try {
    const apiResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${language}/${word}`);

    if (!apiResponse.ok) {
      if (apiResponse.status === 404) {
        return res.status(404).json({ message: `Sorry, the word "${word}" was not found.` });
      }
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    const firstResult = data[0];
    const firstMeaning = firstResult.meanings[0];
    const phoneticWithAudio = firstResult.phonetics.find(p => p.audio);

    // Map the API response to the format your frontend expects
    const parsedResult = {
      "Word": firstResult.word,
      "Phonetic": firstResult.phonetic || (firstResult.phonetics.find(p => p.text) || {}).text,
      "PartOfSpeech": firstMeaning.partOfSpeech,
      "Audio": phoneticWithAudio ? phoneticWithAudio.audio : null,
      "Meaning": firstMeaning.definitions[0].definition,
      "Synonyms": firstMeaning.synonyms.join(', '),
      "Antonyms": firstMeaning.antonyms.join(', '),
      "Example": firstMeaning.definitions.find(d => d.example)?.example || 'No example available.'
    };

    // Wrap keys in bold for frontend
    const formattedResult = {};
    for (const key in parsedResult) {
      // Ensure we don't add empty fields
      if (parsedResult[key]) {
        formattedResult[`<b>${key}</b>`] = parsedResult[key];
      }
    }

    res.json(formattedResult);

  } catch (err) {
    console.error("Dictionary API Error:", err);
    res.status(500).json({ message: "Failed to fetch definition", details: err.message });
  }
};

// Saved words endpoints
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
    // Find if the word is already saved by the user
    let savedWord = await SavedWord.findOne({ user: req.user.id, word });

    // If it's already saved, return the existing one.
    if (savedWord) {
      return res.json(savedWord);
    }
    // Otherwise, create a new one
    savedWord = new SavedWord({ user: req.user.id, word, synonyms, meaning, date: new Date() });
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

// History endpoints
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.saveHistory = async (req, res) => {
  const { word } = req.body;
  if (!word) {
    return res.status(400).json({ message: 'Word is required' });
  }
  try {
    const historyItem = await History.findOneAndUpdate(
      { user: req.user.id, word: word }, // find a document with this filter
      { $set: { date: new Date() } }, // update the date
      { new: true, upsert: true } // options: return the new doc, and create if it doesn't exist
    );
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
