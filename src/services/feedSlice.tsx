import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';

type TFeedState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null | undefined;
  total: number;
  totalToday: number;
  orderByNumber: TOrder | null;
};

export const initialState: TFeedState = {
  orders: [],
  loading: false,
  error: null,
  total: 0,
  totalToday: 0,
  orderByNumber: null
};

export const getFeeds = createAsyncThunk('feed/getAll', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => await getOrderByNumberApi(number)
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get feeds
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get order by number
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderByNumber = action.payload.orders[0];
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectLoadingState: (state) => state.loading,
    selectTotal: (state) => state.total,
    selectTotalToday: (state) => state.totalToday,
    selectOrderByNumber: (state) => state.orderByNumber
  }
});

export default feedSlice.reducer;

export const {
  selectOrders,
  selectLoadingState,
  selectTotal,
  selectTotalToday,
  selectOrderByNumber
} = feedSlice.selectors;
