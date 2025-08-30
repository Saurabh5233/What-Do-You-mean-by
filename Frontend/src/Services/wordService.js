import { api } from './authService';

export const defineWord = async (word) => {
  try {
    const response = await api.post('/api/words/define', { word });
    return response.data;
  } catch (error) {
    console.error('Error fetching definition', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getSavedWords = async () => {
  try {
    const response = await api.get('/api/words/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved words', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const saveWord = async (wordData) => {
  try {
    const response = await api.post('/api/words/saved', wordData);
    return response.data;
  } catch (error) {
    console.error('Error saving word', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteSavedWords = async (ids) => {
  try {
    const response = await api.delete('/api/words/saved', { data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting saved words', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/api/words/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const saveHistory = async (word) => {
  try {
    const response = await api.post('/api/words/history', { word });
    return response.data;
  } catch (error) {
    console.error('Error saving history', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteHistoryItems = async (ids) => {
  try {
    const response = await api.delete('/api/words/history', { data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting history items', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
