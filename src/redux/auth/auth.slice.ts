import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IToken from '../../types/IToken';

const initialState = {
  authenticated: false,
  token: '',
  expire: '',
  loginError: '',
  loginPending: false,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLogin: () => ({ ...initialState, loginPending: true }),
    loginSuccess: (state, action: PayloadAction<IToken>) => ({
      authenticated: true,
      token: action.payload.token,
      expire: action.payload.expiresIn,
      loginError: '',
      loginPending: false,
    }),
    loginFailed: (state, action) => ({
      ...initialState,
      loginError: action.payload.message,
    }),
    logout: () => initialState,
  },
});

export default AuthSlice;
