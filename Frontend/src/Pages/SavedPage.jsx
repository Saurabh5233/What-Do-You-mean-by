import React from 'react';

const SavedPage = ({ savedWords, onView }) => (
  <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-[var(--text-primary)] text-center mb-8">
        Saved Words
      </h1>

      {savedWords.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)]">
          You haven't saved any words yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[var(--bg-secondary)]">
            <thead className="bg-[var(--bg-primary)]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Word</th>
                <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)]">Synonyms</th>
              </tr>
            </thead>
            <tbody>
              {savedWords.map((item, index) => {
                let synonyms = [];
                if (typeof item.synonyms === 'string') {
                  synonyms = item.synonyms.split(',').map(s => s.trim()).filter(s => s);
                } else if (Array.isArray(item.synonyms)) {
                  synonyms = item.synonyms;
                }
                
                return (
                  <tr
                    key={index}
                    className="border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => onView(item.word)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium text-[var(--accent-secondary)]">{item.word}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--text-secondary)]">
                        {synonyms.length > 0 
                          ? synonyms.slice(0, 3).join(', ') 
                          : 'No synonyms available'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default SavedPage;
