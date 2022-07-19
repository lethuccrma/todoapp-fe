import axios from 'axios';
import { ROOT_ENDPOINT } from '../configs/server';

const UnauthorizedAPI = axios.create({
  baseURL: ROOT_ENDPOINT,
  headers: {
    Accept: 'application/json',
  },
});

export default UnauthorizedAPI;
