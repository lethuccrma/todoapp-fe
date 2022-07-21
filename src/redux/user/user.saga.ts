import { call, put, takeLatest } from 'redux-saga/effects';
import FormData from 'form-data';

import UserSlice from './user.slice';
import AuthorizedAPI from '../../apis/authorized';
import {
  EDIT_USER,
  GET_FILE,
  GET_USER,
  ROOT_ENDPOINT,
} from '../../configs/server';
import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { GetUserResponse, UpdateUserResponse } from '../../types/Axios';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

export const FETCH_USER = createAction('FETCH_USER');

function* handleUploadAvatar(action: PayloadAction<UploadFile>) {
  const uploadFile = action.payload;
  try {
    const formData = new FormData();
    formData.append('avatar', uploadFile as RcFile);
    const res: AxiosResponse<UpdateUserResponse> = yield call(
      AuthorizedAPI.patch,
      EDIT_USER,
      formData,
    );

    yield put(
      UserSlice.actions.updateUser({
        avatarURL: `${ROOT_ENDPOINT}${GET_FILE}/${
          res.data.user.avatar
        }?token=Bearer ${global.window.reduxStore.getState().auth.token}`,
        avatar: res.data.user.avatar,
      }),
    );
  } catch (err) {
    const errorMessage =
      (err as AxiosError<{ message: string }>)?.response?.data?.message ||
      (err as Error).message;
    console.log('ERROR', errorMessage);
  }
}

function* handleFetchUser() {
  try {
    const res: AxiosResponse<GetUserResponse> = yield call(
      AuthorizedAPI.get,
      GET_USER,
    );

    yield put(
      UserSlice.actions.setUser({
        ...res.data.user,
        avatarURL: `${ROOT_ENDPOINT}${GET_FILE}/${
          res.data.user.avatar
        }?token=Bearer ${global.window.reduxStore.getState().auth.token}`,
      }),
    );
  } catch (err) {
    const errorMessage =
      (err as AxiosError<{ message: string }>)?.response?.data?.message ||
      (err as Error).message;
    console.log('ERROR', errorMessage);
  }
}

export default function* UserSaga() {
  yield takeLatest(UserSlice.actions.updateAvatarURL.type, handleUploadAvatar);
  yield takeLatest(FETCH_USER.type, handleFetchUser);
}
