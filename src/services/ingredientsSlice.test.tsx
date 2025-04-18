import { expect, test, describe } from '@jest/globals';
import ingredientsReducer, {
  getIngredients,
  TIngredientsState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const testIngredient: TIngredient = {
  _id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('Тестирование экшенов слайса ингредиентов', () => {
  test('обработка getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('обработка getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: [testIngredient]
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual([testIngredient]);
  });

  test('обработка getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'ошибка загрузки' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('ошибка загрузки');
  });
});
