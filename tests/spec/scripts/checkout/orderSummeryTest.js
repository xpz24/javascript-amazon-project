import { renderOrderSummary } from '../../../../scripts/checkout/orderSummary.js';
import { cart, addToCart } from '../../../../data/cart.js';

describe('Test Suite: renderOrderSummary', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([])); // Just incase localStorage interferes with the testing
    cart.length = 0;
  });

  it('Displays the cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    addToCart('15b6fc6f-327a-4ec4-896f-486349e85a3d');

    const testContainerElement = document.querySelector('.js-test-container');
    testContainerElement.innerHTML = `
      <div class="js-order-summary"></div>
    `;
    renderOrderSummary();

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(
      2,
    );
    testContainerElement.innerHTML = '';
  });
});
