import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from '../../types/IUser';

const initialState: IUser = {
  id: '',
  updatedAt: new Date(),
  createdAt: new Date(),
  email: '',
  firstName: '',
  lastName: '',
  avatar: '',
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => (action.payload),
  },
});

export default UserSlice;
