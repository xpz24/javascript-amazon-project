import { addToCart, cart } from '../../../data/cart.js';

describe('Test Suite: Add to Cart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([])); // Just incase localStorage interferes with the testing
    cart.length = 0;
  });

  it('Product already in cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(cart));
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(2);
  });

  it('Product not in cart', () => {
    addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');

    expect(cart.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledOnceWith('cart', JSON.stringify(cart));
    expect(cart[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cart[0].quantity).toEqual(1);
  });
});
