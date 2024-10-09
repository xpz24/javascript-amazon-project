/**
 * @type {{ productId: string; quantity: number; deliveryId: number; }[]}
 */
export const cart = JSON.parse(localStorage.getItem('cart')) || []; // This is the production code for cart


export function addToCart(productId) {
  const matchingItem = getCartItem(productId);

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryId: 0
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(productId) {
  const indexToRemove = cart.findIndex(cartItem => cartItem.productId === productId);
  cart.splice(indexToRemove, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryId) {
  const matchingItem = cart.find((cartItem) => {
    return productId === cartItem.productId;
  });

  matchingItem.deliveryId = Number(deliveryId);
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartItem(productId) {
  return cart.find(cartItem => cartItem.productId === productId);
}