import { expect, test, describe } from '@jest/globals';
import userReducer, {
  authChecked,
  getOrders,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  TUserState,
  updateUser
} from './userSlice';
import { TOrder, TUser } from '@utils-types';

const testUser: TUser = {
  email: 'test@mail.ru',
  name: 'TestName'
};

const testUserUpdated: TUser = {
  email: 'update-test@mail.ru',
  name: 'UpdatedTestName'
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false,
  orders: [],
  ordersRequest: false
};

const testOrders: TOrder[] = [
  {
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
  }
];

describe('Тестирование экшенов слайса пользователя', () => {
  test('обработка authChecked', () => {
    const state = userReducer(initialState, authChecked());
    expect(state.isAuthChecked).toBe(true);
  });

  // Register

  test('обработка registerUser.pending', () => {
    const action = { type: registerUser.pending.type, payload: testUser };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull;
    expect(state.loginUserError).toBeNull;
    expect(state.loginUserRequest).toBe(true);
  });

  test('обработка registerUser.fulfilled', () => {
    const action = { type: registerUser.fulfilled.type, payload: testUser };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(testUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loginUserRequest).toBe(false);
  });

  test('обработка registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      error: { message: 'ошибка при регистрации' }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loginUserError).toBe('ошибка при регистрации');
    expect(state.loginUserRequest).toBe(false);
  });

  // Login

  test('обработка loginUser.pending', () => {
    const action = { type: loginUser.pending.type, payload: testUser };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  test('обработка loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: testUser
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(testUser);
    expect(state.loginUserRequest).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('обработка loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: { message: 'ошибка при входе' }
    };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBe('ошибка при входе');
    expect(state.isAuthChecked).toBe(true);
  });

  //Logout

  test('обработка logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type, payload: testUser };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  test('обработка logoutUser.fulfilled', () => {
    const prevState = {
      ...initialState,
      user: testUser,
      isAuthenticated: true
    };
    const state = userReducer(prevState, { type: logoutUser.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  test('обработка logoutUser.rejected', () => {
    const action = {
      type: logoutUser.rejected.type,
      error: { message: 'ошибка при выходе' }
    };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBe('ошибка при выходе');
    expect(state.isAuthChecked).toBe(false);
  });

  //Get user

  test('обработка getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  test('обработка getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: { user: testUser }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(testUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserRequest).toBe(false);
  });

  test('обработка getUser.rejected', () => {
    const action = {
      type: getUser.rejected.type,
      error: { message: 'ошибка получения данных' }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserError).toBe('ошибка получения данных');
    expect(state.loginUserRequest).toBe(false);
  });

  //Update user

  test('обработка updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  test('обработка updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: { user: testUserUpdated }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(testUserUpdated);
    expect(state.loginUserRequest).toBe(false);
    expect(state.isAuthenticated).toBe(true);
  });

  test('обработка updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'ошибка при обновлении' }
    };
    const state = userReducer(initialState, action);
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toBe('ошибка при обновлении');
  });

  test('обработка getOrders.pending', () => {
    const action = { type: getOrders.pending.type };
    const state = userReducer(initialState, action);
    expect(state.ordersRequest).toBe(true);
  });

  //Orders

  test('обработка getOrders.fulfilled', () => {
    const action = {
      type: getOrders.fulfilled.type,
      payload: testOrders
    };
    const state = userReducer(initialState, action);
    expect(state.orders).toEqual(testOrders);
    expect(state.ordersRequest).toBe(false);
  });

  test('обработка getOrders.rejected', () => {
    const action = {
      type: getOrders.rejected.type,
      error: { message: 'ошибка загрузки заказов' }
    };
    const state = userReducer(initialState, action);
    expect(state.ordersRequest).toBe(false);
    expect(state.loginUserError).toBe('ошибка загрузки заказов');
  });
});
