import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE
});

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) =>
    client.post('/auth/login', { username, password })
};

export const assignmentAPI = {
  getTeachers: () => client.get('/assignments/teachers'),
  submitAssignment: (teacherId, fileName, fileData) =>
    client.post('/assignments/submit', { teacherId, fileName, fileData }),
  getMySubmissions: () => client.get('/assignments/my-submissions'),
  getToReview: () => client.get('/assignments/to-review'),
  downloadFile: (assignmentId) =>
    client.get(`/assignments/download/${assignmentId}`),
  updateStatus: (assignmentId, status) =>
    client.patch(`/assignments/status/${assignmentId}`, { status })
};

export default client;
