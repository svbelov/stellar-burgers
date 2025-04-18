import cypress from 'cypress';

beforeEach(function () {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' });

  window.localStorage.setItem(
    'refreshToken',
    JSON.stringify('testRefreshToken')
  );
  cy.setCookie('accessToken', 'fakeToken');

  cy.viewport(1366, 768);
  cy.visit('http://localhost:4000');
});

afterEach(function () {
  cy.clearLocalStorage();
  cy.clearCookies();
});

describe('Добавление ингредиента из списка в конструктор', function () {
  it('добавление булки и начинки', function () {
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент1-булка'
    );
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент2-начинка'
    );

    cy.contains('li', 'Ингредиент1-булка').within(() => {
      cy.contains('Добавить').click();
    });
    cy.contains('li', 'Ингредиент2-начинка').within(() => {
      cy.contains('Добавить').click();
    });

    cy.get('[data-cy="constructor"]').should('contain', 'Ингредиент1-булка');
    cy.get('[data-cy="constructor"]').should('contain', 'Ингредиент2-начинка');
  });
});

describe('Работа модальных окон', function () {
  it('открытие модального окна ингредиента и закрытие кликом на кнопку', function () {
    cy.get('[data-cy="1"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').should('contain', 'Ингредиент1-булка');

    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('открытие модального окна ингредиента и закрытие кликом на оверлей', function () {
    cy.get('[data-cy="2"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="modal"]').should('contain', 'Ингредиент2-начинка');

    cy.get('[data-cy="modal-overlay-close"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Создание заказа', function () {
  it('создание заказа', function () {
    //Собирается бургер
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент1-булка'
    );
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент2-начинка'
    );
    cy.contains('li', 'Ингредиент1-булка').within(() => {
      cy.contains('Добавить').click();
    });
    cy.contains('li', 'Ингредиент2-начинка').within(() => {
      cy.contains('Добавить').click();
    });
    cy.get('[data-cy="constructor"]').should('contain', 'Ингредиент1-булка');
    cy.get('[data-cy="constructor"]').should('contain', 'Ингредиент2-начинка');

    //Вызывается клик по кнопке «Оформить заказ»
    cy.get('button').contains('Оформить заказ').click();

    //Проверяется, что модальное окно открылось и номер заказа верный
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="order-number"]').should('contain', '74812');

    //Pакрывается модальное окно и проверяется успешность закрытия
    cy.get('[data-cy="close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    //Проверяется, что конструктор пуст
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент1-булка'
    );
    cy.get('[data-cy="constructor"]').should(
      'not.contain',
      'Ингредиент2-начинка'
    );
  });
});
