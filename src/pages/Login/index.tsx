import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import AuthSlice, { AuthState } from '../../redux/auth/auth.slice';
import './index.css';

interface IFormInputs {
  email: string;
  password: string;
}


export default function index () {
  const {
    register,
    handleSubmit  } = useForm<IFormInputs>();

  const dispatch = useDispatch();
  const authState = useSelector<{auth: AuthState}, AuthState>((state) => state.auth);

  const onSubmit = (data: IFormInputs) => {
    dispatch(AuthSlice.actions.startLogin(data))
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          placeholder="example@gmail.com"
          type="email"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register('password')}
          type="password"
        />
      </div>
      <input type="submit" />
    </form>
  );
}
