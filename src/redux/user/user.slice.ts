import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadFile } from 'antd/lib/upload/interface';
import IUser from '../../types/IUser';

const initialState: IUser = {
  id: '',
  updatedAt: new Date(),
  createdAt: new Date(),
  email: '',
  firstName: '',
  lastName: '',
  avatar: '',
  avatarURL: undefined,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => (action.payload),
    updateAvatarURL: (state, action: PayloadAction<UploadFile>) => ({...state, avatarURL: action.payload.url}),
    updateUser: (state, action: PayloadAction<IUser>) => ({...state, ...action.payload}),
  },
});

export default UserSlice;
