import axios from 'axios';

const API_URL = 'http://localhost:3030/api/words';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export const getSavedWords = async () => {
  try {
    const response = await axios.get(`${API_URL}/saved`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching saved words', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const saveWord = async (wordData) => {
  try {
    const response = await axios.post(`${API_URL}/saved`, wordData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error saving word', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteSavedWords = async (ids) => {
  try {
    const response = await axios.delete(`${API_URL}/saved`, { ...getAuthHeaders(), data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting saved words', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching history', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const saveHistory = async (word) => {
  try {
    const response = await axios.post(`${API_URL}/history`, { word }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error saving history', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteHistoryItems = async (ids) => {
  try {
    const response = await axios.delete(`${API_URL}/history`, { ...getAuthHeaders(), data: { ids } });
    return response.data;
  } catch (error) {
    console.error('Error deleting history items', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
