import React from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

interface IFormInputs {
  email: string;
  password: string;
}

const onSubmit = (data: IFormInputs) => {
  console.log(data);
};

export default function index () {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInputs>();

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
