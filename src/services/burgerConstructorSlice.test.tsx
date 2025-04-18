import { expect, test, describe } from '@jest/globals';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetOrder,
  initialState
} from './burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
  id: '1',
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

const ingredient1: TConstructorIngredient = {
  id: '2',
  _id: '2',
  name: 'Ингредиент1',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const ingredient2: TConstructorIngredient = {
  id: '3',
  _id: '3',
  name: 'Ингредиент2',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
};

describe('Тестирование экшенов конструктора бургера', () => {
  test('добавить ингредиент - булку', () => {
    const newState = burgerConstructorReducer(initialState, addIngredient(bun));
    expect(newState.constructorItems.bun).toMatchObject({
      ...bun,
      id: expect.any(String)
    });
  });

  test('добавить ингредиент - начинку', () => {
    const newState = burgerConstructorReducer(
      initialState,
      addIngredient(ingredient1)
    );
    expect(newState.constructorItems.ingredients[0]).toMatchObject({
      ...ingredient1,
      id: expect.any(String)
    });
  });

  test('удалить ингредиент', () => {
    const prevState = {
      ...initialState,
      constructorItems: {
        bun: bun,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = burgerConstructorReducer(
      prevState,
      removeIngredient(ingredient1)
    );
    expect(newState.constructorItems.ingredients).toEqual([ingredient2]);
    expect(newState.constructorItems.bun).toEqual(bun);
  });

  test('Сдвинуть ингредиент вверх', () => {
    const prevState = {
      ...initialState,
      constructorItems: {
        bun: bun,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = burgerConstructorReducer(prevState, moveUpIngredient(1));
    expect(newState.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
    expect(newState.constructorItems.bun).toEqual(bun);
  });

  test('Сдвинуть ингредиент вниз', () => {
    const prevState = {
      ...initialState,
      constructorItems: {
        bun: bun,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = burgerConstructorReducer(prevState, moveDownIngredient(0));
    expect(newState.constructorItems.ingredients).toEqual([
      ingredient2,
      ingredient1
    ]);
    expect(newState.constructorItems.bun).toEqual(bun);
  });

  test('Сбросить конструктор в исходное состояние', () => {
    const prevState = {
      ...initialState,
      constructorItems: {
        bun: bun,
        ingredients: [ingredient1, ingredient2]
      }
    };
    const newState = burgerConstructorReducer(prevState, resetOrder());
    expect(newState.constructorItems).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
