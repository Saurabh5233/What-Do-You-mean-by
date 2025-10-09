import { api } from './authService';

export const defineWord = async (word) => {
  try {
    const response = await api.post('/words/define', { word });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch definition';
    console.error('Error fetching definition:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const getSavedWords = async () => {
  try {
    const response = await api.get('/words/saved');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch saved words';
    console.error('Error fetching saved words:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const saveWord = async (wordData) => {
  try {
    const response = await api.post('/words/saved', wordData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save word';
    console.error('Error saving word:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const deleteSavedWords = async (ids) => {
  try {
    const response = await api.delete('/words/saved', { data: { ids } });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete saved words';
    console.error('Error deleting saved words:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const getHistory = async () => {
  try {
    const response = await api.get('/words/history');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch history';
    console.error('Error fetching history:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const saveHistory = async (word) => {
  try {
    const response = await api.post('/words/history', { word });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to save history';
    console.error('Error saving history:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};

export const deleteHistoryItems = async (ids) => {
  try {
    const response = await api.delete('/words/history', { data: { ids } });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete history items';
    console.error('Error deleting history items:', errorMessage, error.response?.data);
    throw new Error(errorMessage);
  }
};
