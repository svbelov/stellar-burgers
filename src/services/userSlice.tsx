import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { TOrder, TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';

import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  user: TUser | null;
  loginUserError: string | null | undefined;
  loginUserRequest: boolean;
  orders: TOrder[];
  ordersRequest: boolean;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  user: null,
  loginUserError: null,
  loginUserRequest: false,
  orders: [],
  ordersRequest: false
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.clear();
  return response;
});

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const updateUser = createAsyncThunk('user/update', updateUserApi);

export const getOrders = createAsyncThunk('user/getUserOrders', getOrdersApi);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loginUserError = null;
        state.loginUserRequest = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loginUserError = action.error.message;
        state.loginUserRequest = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginUserRequest = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = false;
        state.loginUserError = action.error.message;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loginUserRequest = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })

      // Get user
      .addCase(getUser.pending, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loginUserError = null;
        state.loginUserRequest = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.user = null;
        state.loginUserError = action.error.message;
        state.loginUserRequest = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.user = action.payload.user;
        state.loginUserError = null;
        state.loginUserRequest = false;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
      })

      // Orders
      .addCase(getOrders.pending, (state) => {
        state.ordersRequest = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loginUserError = action.error.message;
        state.ordersRequest = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.ordersRequest = false;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectLoginUserError: (state) => state.loginUserError,
    selectOrders: (state) => state.orders,
    selectOrdersRequest: (state) => state.ordersRequest,
    selectIsAuthenticated: (state) => state.isAuthenticated
  }
});

export default userSlice.reducer;

export const { authChecked } = userSlice.actions;

export const {
  selectUser,
  selectIsAuthChecked,
  selectLoginUserError,
  selectOrders,
  selectOrdersRequest,
  selectIsAuthenticated
} = userSlice.selectors;
