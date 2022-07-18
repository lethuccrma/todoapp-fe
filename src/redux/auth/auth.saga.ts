import { call, put, takeLatest } from 'redux-saga/effects';

import AuthSlice from './auth.slice';
import AuthorizedAPI from '../../apis/authorized';
import { LOGIN } from '../../configs/server';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { LoginResponse } from '../../types/Axios';
import UserSlice from '../user/user.slice';

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
    const errorMessage = (err as AxiosError<{message: string}>)?.response?.data.message || (err as Error).message;
    console.log('ERROR', errorMessage);
    yield put(AuthSlice.actions.loginFailed({ message: errorMessage }));
  }
}

export default function* AuthSaga() {
  yield takeLatest(AuthSlice.actions.startLogin.type, handleStartLogin);
}
