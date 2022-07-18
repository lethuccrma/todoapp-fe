import axios from 'axios';
import { ROOT_ENDPOINT } from '../configs/server';

export default axios.create({
  baseURL: ROOT_ENDPOINT,
  headers: {
    Accept: 'application/json',
  },
});
