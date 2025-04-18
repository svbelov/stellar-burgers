import { expect, test } from '@jest/globals';
import store, { rootReducer } from './store';

describe('Правильная инициализация rootReducer', () => {
  test('rootReducer инициализирует состояние как в store', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, action);
    expect(initialState).toEqual(store.getState());
  });
});
