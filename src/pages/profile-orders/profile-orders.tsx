import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrders,
  selectOrders,
  selectOrdersRequest
} from '../../services/userSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const request = useSelector(selectOrdersRequest);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  if (request) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
