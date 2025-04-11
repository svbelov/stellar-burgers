import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from '../../services/userSlice';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const name = useSelector(selectUser)?.name;
  return <AppHeaderUI userName={name} />;
};
