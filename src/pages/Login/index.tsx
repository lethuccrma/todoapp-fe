import React from 'react';
import { useForm } from 'react-hook-form';
import './index.css';

interface IFormInputs {
  firstName: string;
  lastName: string;
  isDeveloper: boolean;
  email: string;
}

export default function index () {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInputs>();

  const onSubmit = (data: IFormInputs) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input {...register('firstName')} placeholder="Kotaro" />
        {errors?.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <label>Last Name</label>
        <input {...register('lastName')} placeholder="Sugawara" />
      </div>

      <div>
        <label htmlFor="isDeveloper">Is an developer?</label>
        <input
          type="checkbox"
          {...register('isDeveloper')}
          placeholder="luo"
          value="yes"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          placeholder="bluebill1049@hotmail.com"
          type="email"
        />
      </div>
      <input type="submit" />
    </form>
  );
}
