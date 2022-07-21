import { call, put, takeLatest } from 'redux-saga/effects';

import AuthSlice from './auth.slice';
import AuthorizedAPI from '../../apis/authorized';
import { LOGIN } from '../../configs/server';
import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { LoginResponse } from '../../types/Axios';
import UserSlice from '../user/user.slice';

export const LOGOUT = createAction('LOGOUT');

function* handleStartLogin(
  action: PayloadAction<{ email: string; password: string }>,
) {
  const { email, password } = action.payload;
  try {
    const response: AxiosResponse<LoginResponse> = yield call(
      AuthorizedAPI.post,
      LOGIN,
      {
        email,
        password,
      },
    );
    const { token, user } = response.data || {};
    yield put(AuthSlice.actions.loginSuccess(token));
    yield put(UserSlice.actions.setUser(user))
  } catch (err) {
    const errorMessage = (err as AxiosError<{message: string}>)?.response?.data?.message || (err as Error).message;
    console.log('ERROR', errorMessage);
    yield put(AuthSlice.actions.loginFailed({ message: errorMessage }));
  }
}

function* handleLogout() {
  yield put(AuthSlice.actions.logout());
  yield put(UserSlice.actions.resetUser());
}

export default function* AuthSaga() {
  yield takeLatest(AuthSlice.actions.startLogin.type, handleStartLogin);
  yield takeLatest(LOGOUT.type, handleLogout);
}
