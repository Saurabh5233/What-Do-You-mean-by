const SavedWord = require('../models/SavedWord');
const History = require('../models/History');
const { Configuration, OpenAIApi } = require("openai");

// OpenAI setup
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Prompt helper for GPT
const promptFor = (word) => {
  return `Provide detailed information about the word "${word}" in JSON format. 
Format:
{
  "Word": "...",
  "PartOfSpeech": "...",
  "Meaning": "...",
  "Synonyms": "...",
  "Antonyms": "...",
  "Example": "..."
}
Rules:
- Provide real values.
- Synonyms: 4-5 comma-separated.
- Antonyms: 2-3 comma-separated.
- Example sentence must include the word "${word}".`;
};

// Define word endpoint
exports.defineWord = async (req, res) => {
  const { word } = req.body;
  if (!word) return res.status(400).json({ message: "Word is required" });

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptFor(word) }],
      temperature: 0.7,
    });

    let output = completion.data.choices[0].message.content;

    // Extract JSON from GPT output
    const jsonStart = output.indexOf("{");
    const jsonEnd = output.lastIndexOf("}");
    output = output.slice(jsonStart, jsonEnd + 1);
    const result = JSON.parse(output);

    // Wrap keys in bold for frontend
    const formattedResult = {};
    for (const key in result) {
      formattedResult[`<b>${key}</b>`] = result[key];
    }

    res.json(formattedResult);

  } catch (err) {
    console.error("OpenAI API Error:", err);
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
    let savedWord = await SavedWord.findOne({ user: req.user.id, word });
    if (savedWord) return res.status(400).json({ msg: 'Word already saved' });

    savedWord = new SavedWord({ user: req.user.id, word, synonyms, meaning });
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

    historyItem = new History({ user: req.user.id, word });
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
