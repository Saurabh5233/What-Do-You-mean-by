import React, { useState, useEffect } from 'react';

const BinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SavedPage = ({ savedWords, onView, onDelete }) => {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      setSelected(savedWords.map(item => item._id));
    } else {
      if (selected.length === savedWords.length && savedWords.length > 0) {
        // do nothing
      }
    }
  }, [selectAll, savedWords]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelected(savedWords.map(item => item._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
    setSelectAll(selected.length + 1 === savedWords.length);
  };

  const handleDelete = () => {
    onDelete(selected);
    setSelected([]);
    setSelectAll(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
      <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-lg p-8 transition-colors duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">
            Saved Words
          </h1>
          <div className="flex items-center space-x-4">
            {savedWords.length > 0 && (
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="selectAll" 
                  checked={selectAll} 
                  onChange={handleSelectAll} 
                  className="form-checkbox h-5 w-5 text-[var(--accent-primary)] rounded focus:ring-[var(--accent-primary)]"
                />
                <label htmlFor="selectAll" className="ml-2 text-[var(--text-primary)]">Select All</label>
              </div>
            )}
            {selected.length > 0 && (
              <button 
                onClick={handleDelete} 
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <BinIcon />
              </button>
            )}
          </div>
        </div>

        {savedWords.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)]">
            You haven't saved any words yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[var(--bg-secondary)]">
              <thead className="bg-[var(--bg-primary)]">
                <tr>
                  <th className="py-3 px-4"></th>
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
                      key={item._id}
                      className="border-b hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          checked={selected.includes(item._id)} 
                          onChange={() => handleSelect(item._id)} 
                        />
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={() => onView(item)}>
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
};

export default SavedPage;
