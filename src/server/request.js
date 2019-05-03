import axios from 'axios';

const serverAxios = axios.create({
  baseURL: 'http://localhost:8757'
});

export default serverAxios;