export const cart = [];

export function addToCart(productID) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productID === cartItem.productID) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productID: productID,
      quantity: 1
    });
  }
}