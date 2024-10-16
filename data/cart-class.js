/**
 * @typedef {Object} CartItem
 * @property {string} productId
 * @property {number} quantity
 * @property {number} deliveryId
 */

/**
 * @class Used to generate cart objects
 */
class Cart {
  #maxCapacity = 99;
  #localStorageKey;
  /** @type {CartItem[]} */
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
    /** @type {CartItem[]} */
    const deepClone = JSON.parse(JSON.stringify(this.#cartItems));
    return deepClone;
  }

  deleteCartItems() {
    this.#cartItems.length = 0;
    this.#saveToStorage();
  }

  /**
   * Returns an object containing an item based on the given product ID
   * @param {string} productId - The ID of the cart item to find
   * @returns {CartItem} The item object that matches the given ID.
   */
  getCartItem(productId) {
    return this.#cartItems.find((item) => item.productId === productId);
  }

  /**
   * Adds an object to the cart array based on the given product ID, if it already exists
   * then updates the quantity property of the existing object. Saves the cart to localStorage.
   * @param {string} productId - The ID of the cart item to be added
   * @param {number} quantity - The quantity of cart item to be added
   * @returns {void} void
   */
  addToCart(productId, quantity = 1) {
    if (this.totalQuantity + quantity > this.#maxCapacity) {
      alert('The cart cannot hold more than 99 items');
      return;
    }

    const matchingItem = this.getCartItem(productId);
    if (matchingItem) {
      matchingItem.quantity = Math.min(matchingItem.quantity + quantity, this.#maxCapacity);
    } else {
      this.#cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryId: 0,
      });
    }

    this.#saveToStorage();
  }

  /**
   * Replaces the quantity of an item inside the cart
   * Saves the cart to localStorage.
   * @param {string} productId - The ID of the cart item to be modified
   * @param {number} quantity - The quantity to replace with
   * @returns {void} void
   */
  overrideQuantity(productId, quantity) {
    const matchingItem = this.getCartItem(productId);
    if (this.totalQuantity - matchingItem.quantity + quantity > this.#maxCapacity) {
      alert('The cart cannot hold more than 99 items');
      return;
    }

    if (matchingItem) {
      matchingItem.quantity = Math.min(quantity, this.#maxCapacity);
    }
    this.#saveToStorage();
  }

  /**
   * Deletes an object from the cart array based on given product ID and saves the cart in localStorage
   * @param {string} productId - The ID of the cart item to be removed
   * @returns {void} void
   */
  removeFromCart(productId) {
    const indexToRemove = this.#cartItems.findIndex((item) => item.productId === productId);
    this.#cartItems.splice(indexToRemove, 1);
    this.#saveToStorage();
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
    this.#saveToStorage();
  }

  #saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }
}

export const cart = new Cart('cart-oop');
