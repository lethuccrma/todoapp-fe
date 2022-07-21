import { call, put, takeLatest } from 'redux-saga/effects';
import FormData from 'form-data';

import UserSlice from './user.slice';
import AuthorizedAPI from '../../apis/authorized';
import { EDIT_USER, GET_FILE, ROOT_ENDPOINT } from '../../configs/server';
import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import { UpdateUserResponse } from '../../types/Axios';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';

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

export default function* UserSaga() {
  yield takeLatest(UserSlice.actions.updateAvatarURL.type, handleUploadAvatar);
}
