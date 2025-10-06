import React, { useState, useEffect } from 'react';

const BinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const HistoryPage = ({ history, onView, onDelete }) => {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelected(selectAll ? history.map(item => item._id) : []);
  }, [selectAll, history]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter(item => item !== id)
      : [...selected, id];
    setSelected(newSelected);
    setSelectAll(history.length > 0 && newSelected.length === history.length);
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
            Search History
          </h1>
          <div className="flex items-center space-x-4">
            {history.length > 0 && (
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="selectAllHistory" 
                  checked={selectAll} 
                  onChange={handleSelectAll} 
                  className="form-checkbox h-5 w-5 text-[var(--accent-primary)] rounded focus:ring-[var(--accent-primary)]"
                />
                <label htmlFor="selectAllHistory" className="ml-2 text-[var(--text-primary)]">Select All</label>
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

        {history.length === 0 ? (
          <p className="text-center text-[var(--text-secondary)]">
            Your search history is empty.
          </p>
        ) : (
          <ul className="space-y-4 mt-4">
            {history.map((item, index) => (
              <li
                key={item._id}
                className="p-4 bg-[var(--bg-primary)] rounded-lg flex items-center transition-opacity"
              >
                <input 
                  type="checkbox" 
                  checked={selected.includes(item._id)} 
                  onChange={() => handleSelect(item._id)} 
                  className="mr-4"
                />
                <div onClick={() => onView(item)} className="flex justify-between items-center w-full cursor-pointer hover:opacity-80">
                  <span className="font-medium text-[var(--accent-secondary)]">{item.word}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{new Date(item.date).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
