import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginRequest } from '../../types/Axios';
import IToken from '../../types/IToken';

export type AuthState = {
  authenticated: boolean;
  token: string;
  expire: string;
  loginError: string;
  loginPending: boolean;
}

const initialState: AuthState = {
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
    startLogin: (state, action: PayloadAction<LoginRequest>) => ({ ...initialState, loginPending: true }),
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
