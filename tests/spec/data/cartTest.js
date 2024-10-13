import { cart } from '../../../data/cart-class.js';

describe('Test Suite: Add to Cart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([])); // Just incase localStorage interferes with the testing
    cart.deleteCartItems();
  });

  it('Product already in cart', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    const cartItems = cart.cartItems;

    expect(cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledWith('cart-oop', JSON.stringify(cartItems));
    expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    expect(cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cartItems[0].quantity).toEqual(2);
  });

  it('Product not in cart', () => {
    cart.addToCart('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    const cartItems = cart.cartItems;

    expect(cartItems.length).toEqual(1);
    expect(localStorage.setItem).toHaveBeenCalledOnceWith('cart-oop', JSON.stringify(cartItems));
    expect(cartItems[0].productId).toEqual('e43638ce-6aa0-4b85-b27f-e1d07eb678c6');
    expect(cartItems[0].quantity).toEqual(1);
  });
});
