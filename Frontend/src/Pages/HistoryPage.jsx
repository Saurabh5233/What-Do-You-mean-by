import React from 'react';

const HistoryPage = ({ history, onView }) => (
  <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
    <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-[var(--text-primary)] text-center mb-8">
        Search History
      </h1>

      {history.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)]">
          Your search history is empty.
        </p>
      ) : (
        <ul className="space-y-4">
          {history.map((item, index) => (
            <li
              key={index}
              className="p-4 bg-[var(--bg-primary)] rounded-lg flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onView(item.word)} // only the word
            >
              <span className="font-medium text-[var(--accent-secondary)]">{item.word}</span>
              <span className="text-sm text-[var(--text-secondary)]">{item.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default HistoryPage;
