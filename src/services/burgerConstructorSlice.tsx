import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

type TConstructorState = {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null | undefined;
};

const initialState: TConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    // Удаление ингредиента
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload.id
        );
    },

    // Перемещение вверх
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [
        state.constructorItems.ingredients[index],
        state.constructorItems.ingredients[index - 1]
      ] = [
        state.constructorItems.ingredients[index - 1],
        state.constructorItems.ingredients[index]
      ];
    },

    // Перемещение вниз
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      [
        state.constructorItems.ingredients[index],
        state.constructorItems.ingredients[index + 1]
      ] = [
        state.constructorItems.ingredients[index + 1],
        state.constructorItems.ingredients[index]
      ];
    },

    // Сброс заказа
    resetOrder: (state) => initialState
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = initialState.constructorItems;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message;
      });
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export default burgerConstructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetOrder
} = burgerConstructorSlice.actions;

export const { selectConstructorItems } = burgerConstructorSlice.selectors;
