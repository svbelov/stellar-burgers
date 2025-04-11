import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { Navigate } from 'react-router-dom';

import { TLoginData } from '@api';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginUser,
  selectIsAuthChecked,
  selectLoginUserError
} from '../../services/userSlice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errorText = useSelector(selectLoginUserError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const userLoginData: TLoginData = { email, password };
    dispatch(loginUser(userLoginData));
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
