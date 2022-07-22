import {store} from '../redux/store';

export {};

declare global {
  interface Window {
    reduxStore: typeof store;
  }
}