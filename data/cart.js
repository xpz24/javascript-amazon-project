/**
 * Contains the list of cartItem Objects
 * @type {{ productId: string; quantity: number; deliveryId: number; }[]}
 */
export const cart = JSON.parse(localStorage.getItem('cart')) || []; // This is the production code for cart

/**
 * Adds an object to the cart array based on the given product ID, if it already exists, then updates the quantity property of the existing object. Saves the cart to localStorage.
 * @param {string} productId - The ID of the cart item to be added
 * @returns {void} void
 */
export function addToCart(productId) {
  const matchingItem = getCartItem(productId);

  if (matchingItem) {
    matchingItem.quantity++;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryId: 0,
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Deletes an object from the cart array based on given product ID and saves the cart in localStorage
 * @param {string} productId - The ID of the cart item to be removed
 * @returns {void} void
 */
export function removeFromCart(productId) {
  const indexToRemove = cart.findIndex(
    (cartItem) => cartItem.productId === productId,
  );
  cart.splice(indexToRemove, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Changes the delivery option of the item in cart and saves the cart in localStorage.
 * @param {string} productId - The ID of the cart item that needs to have delivery option changed
 * @param {number} deliveryId - The new delivery option ID to assign to the cart item.
 * @returns {void} void
 */
export function updateDeliveryOption(productId, deliveryId) {
  // const matchingItem = cart.find((cartItem) => {
  //   return productId === cartItem.productId;
  // });
  const matchingItem = getCartItem(productId);
  matchingItem.deliveryId = deliveryId;
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Returns an object containing an item based on the given product ID
 * @param {string} productId - The ID of the cart item to find
 * @returns {{
 *  productId: string,
 *  quantity: number,
 *  deliveryId: number
 * }} The item object that matches the given ID.
 */
export function getCartItem(productId) {
  return cart.find((cartItem) => cartItem.productId === productId);
}
