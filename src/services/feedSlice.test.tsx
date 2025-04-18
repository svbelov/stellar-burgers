import { expect, test, describe } from '@jest/globals';
import feedReducer, {
  getFeeds,
  getOrderByNumber,
  TFeedState
} from './feedSlice';
import { TOrder } from '@utils-types';

const testOrder: TOrder = {
  _id: '6800fc5fe8e61d001cec308b',
  status: 'done',
  name: 'Бургер тест',
  createdAt: '2025-04-07T13:04:31.799Z',
  updatedAt: '2025-03-29T19:12:57.253Z',
  number: 74812,
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0942',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ]
};

const initialState: TFeedState = {
  orders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0,
  orderByNumber: null
};

describe('Тестирование экшенов слайса ленты заказов', () => {
  test('обработка getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка getFeeds.fulfilled', () => {
    const payload = {
      orders: [testOrder],
      total: 100,
      totalToday: 18
    };
    const action = { type: getFeeds.fulfilled.type, payload };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([testOrder]);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(18);
  });

  test('обработка getFeeds.rejected', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: { message: 'ошибка загрузки' }
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('ошибка загрузки');
  });

  test('обработка getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка getOrderByNumber.fulfilled', () => {
    const payload = {
      orders: [testOrder]
    };
    const action = { type: getOrderByNumber.fulfilled.type, payload };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orderByNumber).toEqual(testOrder);
  });

  test('обработка getOrderByNumber.rejected', () => {
    const action = {
      type: getOrderByNumber.rejected.type,
      error: { message: 'ошибка: заказ не найден' }
    };
    const state = feedReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('ошибка: заказ не найден');
  });
});
