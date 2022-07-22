import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';

import AuthSlice from '../auth/auth.slice';
import UserSlice from '../user/user.slice';

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['loginError', 'loginPending'],
};

export default combineReducers({
  auth: persistReducer(authPersistConfig, AuthSlice.reducer),
  user: UserSlice.reducer,
});
