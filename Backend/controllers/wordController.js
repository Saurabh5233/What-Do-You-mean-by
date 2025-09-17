const SavedWord = require('../models/SavedWord');
const History = require('../models/History');
const https = require('https');

//2nd
// const promptFor = (searchWord) => {
//   return `What is the meaning of the word "${searchWord}"?  
// Return the result as simple HTML, styled with Tailwind classes (no inline CSS).  

// Use this exact structure:
// <div class="space-y-3 p-4">
//   <p><span class="font-bold text-gray-800">Word:</span> <span class="text-gray-700">${searchWord}</span></p>
//   <p><span class="font-bold text-gray-800">Part of Speech:</span> <span class="text-gray-700">[one-word part of speech]</span></p>
  
//   <!-- Language Select Dropdown -->
//   <div>
//     <label for="language" class="font-bold text-gray-800 mr-2">Meaning:</label>
//     <select id="language" class="border border-gray-300 rounded-md px-2 py-1 text-gray-700">
//       <option value="en" selected>English</option>
//       <option value="hi">Hindi</option>
//       <option value="es">Spanish</option>
//       <option value="fr">French</option>
//       <option value="de">German</option>
//     </select>
//     <p id="meaning-text" class="text-gray-700 mt-2">[brief meaning of the word in English]</p>
//   </div>

//   <p><span class="font-bold text-gray-800">Synonyms:</span> <span class="text-gray-700">word1, word2, word3</span></p>
//   <p><span class="font-bold text-gray-800">Antonyms:</span> <span class="text-gray-700">wordA, wordB</span></p>
//   <p><span class="font-bold text-gray-800">Example:</span> 
//      <span class="text-gray-700">Here is a sentence using <span class="font-semibold text-blue-600">${searchWord}</span>.</span>
//   </p>
  
//   <!-- Hidden Synonyms Data -->
//   <div id="synonyms-data" class="hidden">word1, word2, word3</div>
// </div>

// Rules:
// - Provide translations for the "Meaning" field for each language option in the dropdown.
// - Default language must be English (pre-selected).
// - Fill all other fields normally (part of speech, synonyms, antonyms, example sentence).
// - The <p id="meaning-text"> must contain the meaning of "${searchWord}" in the currently selected language.`;
// };



//1st
const promptFor = (searchWord) => {
  return `What is the meaning of the word "${searchWord}"?  
Return the result as simple HTML, but styled using Tailwind classes (no inline CSS).  

Use this exact structure:  
<div class="space-y-3 p-4">
  <p><span class="font-bold text-gray-800">Word:</span> <span class="text-gray-700">${searchWord}</span></p>
  <p><span class="font-bold text-gray-800">Part of Speech:</span> <span class="text-gray-700">[one-word part of speech]</span></p>
  <p><span class="font-bold text-gray-800">Meaning:</span> <span class="text-gray-700">[brief meaning of the word]</span></p>
  <p><span class="font-bold text-gray-800">Synonyms:</span> <span class="text-gray-700">word1, word2, word3</span></p>
  <p><span class="font-bold text-gray-800">Antonyms:</span> <span class="text-gray-700">wordA, wordB</span></p>
  <p><span class="font-bold text-gray-800">Example:</span> <span class="text-gray-700">Here is a sentence using <span class="font-semibold text-blue-600">${searchWord}</span>.</span></p>
  <div id="synonyms-data" class="hidden">word1, word2, word3</div>
</div>

Rules:
- Always fill each key with real data.
- Use exactly one short definition.
- Provide 4-5 synonyms and 2-3 antonyms (comma-separated).
- Example sentence must highlight the word using <span class="font-semibold text-blue-600">${searchWord}</span>.`;
};

  // `What is the meaning of the word "${searchWord}"? Provide a detailed explanation including its part of speech, definitions, Synonyms and an example sentence. Please format the entire response using simple HTML tags. Use tags like <h3> for headings, <b> for bold text, and <ul>/<ol>/<li> for lists where appropriate. IMPORTANT: Also, provide a comma-separated list of 4-5 synonyms inside a hidden div with the id "synonyms-data". For example: <div id="synonyms-data" style="display:none;">synonym1, synonym2, synonym3, synonym4</div>`;
    
exports.defineWord = (req, res) => {
  const { word } = req.body;
  if (!word) {
    return res.status(400).json({ message: 'Word is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = 'gemini-1.5-flash-latest';
  const postData = JSON.stringify({
    contents: [{ parts: [{ text: promptFor(word) }] }],
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      if (response.statusCode >= 400) {
        console.error('Gemini API Error:', data);
        return res.status(response.statusCode).json({ message: 'Failed to fetch definition from Gemini API.', details: data });
      }
      try {
        const parsedData = JSON.parse(data);
        let outputText = 
          parsedData.candidates?.[0]?.content?.parts?.[0]?.text ||
          'No definition found.';

        outputText = outputText.replace(/```[a-zA-Z]*\n?/g, '').trim();

        const regex = new RegExp('<div id="synonyms-data"[^>]*>(.*?)</div>');
        const synonymsMatch = outputText.match(regex);
        const synonymsList = synonymsMatch ? synonymsMatch[1].trim() : '';

        const cleanRegex = new RegExp('<div id="synonyms-data"[^>]*>.*?</div>');
        const cleanedMeaning = outputText.replace(cleanRegex, '').trim();

        res.json({
          meaning: `<p>${cleanedMeaning}</p>`,
          synonyms: synonymsList,
        });
      } catch (e) {
        console.error('Error parsing Gemini response:', e);
        res.status(500).json({ message: 'Error parsing Gemini response' });
      }
    });
  });

  request.on('error', (e) => {
    console.error('HTTPS Request Error:', e);
    res.status(500).json({ message: 'Failed to make request to Gemini API' });
  });

  request.write(postData);
  request.end();
};

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
