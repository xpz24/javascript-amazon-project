/**
 * @typedef {Object} cartItem
 * @property {string} productId
 * @property {number} quantity
 * @property {number} deliveryId
 */

/**
 * @class Used to generate cart objects
 */
class Cart {
  #localStorageKey;
  /** @type {cartItem[]} */
  #cartItems;

  /**
   * @constructor cart Object
   * @param {string} key
   */
  constructor(key) {
    /** @readonly */
    this.#localStorageKey = key;
    /** @readonly */
    this.#cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
  }

  get totalQuantity() {
    let quantity = 0;
    this.#cartItems.forEach((item) => {
      quantity += item.quantity;
    });
    return quantity;
  }

  get cartItems() {
    /** @type {cartItem[]} */
    const deepClone = JSON.parse(JSON.stringify(this.#cartItems));
    return deepClone;
  }

  // get length() {
  //   return this.#cartItems.length
  // }

  deleteCartItems() {
    this.#cartItems.length = 0;
  }

  /**
   * Returns an object containing an item based on the given product ID
   * @param {string} productId - The ID of the cart item to find
   * @returns {cartItem} The item object that matches the given ID.
   */
  getCartItem(productId) {
    return this.#cartItems.find((item) => item.productId === productId);
  }

  /**
   * Adds an object to the cart array based on the given product ID, if it already exists
   * then updates the quantity property of the existing object. Saves the cart to localStorage.
   * @param {string} productId - The ID of the cart item to be added
   * @returns {void} void
   */
  addToCart(productId) {
    const matchingItem = this.getCartItem(productId);

    if (matchingItem) {
      matchingItem.quantity++;
    } else {
      this.#cartItems.push({
        productId: productId,
        quantity: 1,
        deliveryId: 0,
      });
    }

    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }

  /**
   * Deletes an object from the cart array based on given product ID and saves the cart in localStorage
   * @param {string} productId - The ID of the cart item to be removed
   * @returns {void} void
   */
  removeFromCart(productId) {
    const indexToRemove = this.#cartItems.findIndex((item) => item.productId === productId);
    this.#cartItems.splice(indexToRemove, 1);
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }

  /**
   * Changes the delivery option of the item in cart and saves the cart in localStorage.
   * @param {string} productId - The ID of the cart item that needs to have delivery option changed
   * @param {number} deliveryId - The new delivery option ID to assign to the cart item.
   * @returns {void} void
   */
  updateDeliveryOption(productId, deliveryId) {
    // const matchingItem = cart.find((cartItem) => {
    //   return productId === cartItem.productId;
    // });
    const matchingItem = this.getCartItem(productId);
    matchingItem.deliveryId = deliveryId;
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }
}

export const cart = new Cart('cart-oop');