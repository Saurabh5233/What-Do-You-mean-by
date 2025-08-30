
import React, { useState } from 'react';
import { api } from '../Services/authService'; // Import the configured api instance

const Feedback = ({ onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Feedback cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post('/api/feedback', { feedback }); // Use the configured api instance
      setSuccess(true);
      setFeedback('');
      setTimeout(onClose, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError('Failed to send feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--bg-primary)] rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Submit Feedback</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Thank you for your feedback!</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-40 p-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--accent-primary)] text-white rounded-md hover:bg-opacity-80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
