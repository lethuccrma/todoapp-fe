import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ROOT_ENDPOINT } from '../configs/server';
import AuthSlice from '../redux/auth/auth.slice';

const AuthorizedAPI = axios.create({
  baseURL: ROOT_ENDPOINT,
  headers: {
    Accept: 'application/json',
  },
});

const requestHandler = (request: AxiosRequestConfig) => {
  if (!request.headers) {
    request.headers = {}
  }
  request.headers.Authorization = `Bearer ${global.window.reduxStore.getState().auth.token}`;
  return request;
};

const errorHandler = (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    // token is invalid
    global.window.reduxStore.dispatch(AuthSlice.actions.logout());
  }
  return Promise.reject(error);
};

AuthorizedAPI.interceptors.request.use(requestHandler, (error) => Promise.reject(error));
AuthorizedAPI.interceptors.response.use((response) => response, errorHandler);

export default AuthorizedAPI;
