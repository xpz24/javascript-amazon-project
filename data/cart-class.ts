import { safeGetProduct } from './products.js';

export interface CartItem {
  productId: string;
  quantity: number;
  deliveryId: number;
}

interface ICart {
  get totalQuantity(): number;
  get cartItems(): CartItem[];
  deleteCartItems: () => void;
  getCartItem: (s: string) => CartItem;
  addToCart: (s: string, n: number) => void;
  overrideQuantity: (s: string, n: number) => void;
  removeFromCart: (s: string) => void;
  updateDeliveryOption: (s: string, n: number) => void;
}

/**
 * Used to generate cart objects
 */
class Cart implements ICart {
  readonly #maxCapacity: number = 99;
  readonly #localStorageKey: string;
  readonly #cartItems: CartItem[];
  #totalQuantity: number = 0;

  constructor(key: string) {
    this.#localStorageKey = key;
    this.#cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey) || '[]');
    this.#totalQuantity = this.#cartItems.reduce((sum, item) => sum + item.quantity, 0); // Cache totalQuantity
  }

  get totalQuantity() {
    let quantity = 0;
    this.#cartItems.forEach((item) => {
      quantity += item.quantity;
    });
    return quantity;
  }

  get cartItems() {
    const deepClone = JSON.parse(JSON.stringify(this.#cartItems)) as CartItem[];
    return deepClone;
  }

  deleteCartItems() {
    this.#cartItems.length = 0;
    this.#saveToStorage();
  }

  /**
   * Returns an object containing an item based on the given product ID
   */
  getCartItem(productId: string) {
    const matchingCartItem = this.#cartItems.find((item) => item.productId === productId);
    if (!matchingCartItem) {
      throw new Error('Matching Cart Item not found');
    }
    return matchingCartItem;
  }

  /**
   * Adds an object to the cart array based on the given product ID, if it already exists
   * then updates the quantity property of the existing object. Saves the cart to localStorage.
   */
  addToCart(productId: string, quantity = 1) {
    if (this.totalQuantity + quantity > this.#maxCapacity) {
      alert('The cart cannot hold more than 99 items');
      return;
    }

    const matchingItem = safeGetCartItem(this, productId);
    if (matchingItem) {
      matchingItem.quantity = Math.min(matchingItem.quantity + quantity, this.#maxCapacity);
    } else {
      const matchingProduct = safeGetProduct(productId);
      if (!matchingProduct) {
        throw new Error('Product not found in in the product list');
      }
      this.#cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryId: 0,
      });
    }

    this.#totalQuantity += quantity;
    this.#saveToStorage();
  }

  /**
   * Replaces the quantity of an item inside the cart
   * Saves the cart to localStorage.
   */
  overrideQuantity(productId: string, quantity: number) {
    const matchingItem = this.getCartItem(productId);

    const newQuantity = this.totalQuantity - matchingItem.quantity + quantity;
    if (newQuantity > this.#maxCapacity) {
      alert('The cart cannot hold more than 99 items');
      return;
    }
    matchingItem.quantity = Math.min(quantity, this.#maxCapacity);
    this.#saveToStorage();
  }

  /**
   * Deletes an object from the cart array based on given product ID and saves the cart in localStorage
   */
  removeFromCart(productId: string) {
    const indexToRemove = this.#cartItems.findIndex((item) => item.productId === productId);
    if (indexToRemove === -1) {
      throw new Error('Product not found in the cart');
    }
    this.#cartItems.splice(indexToRemove, 1);
    this.#saveToStorage();
  }

  /**
   * Changes the delivery option of the item in cart and saves the cart in localStorage.
   */
  updateDeliveryOption(productId: string, deliveryId: number) {
    // const matchingItem = cart.find((cartItem) => {
    //   return productId === cartItem.productId;
    // });
    const matchingItem = this.getCartItem(productId);
    matchingItem.deliveryId = deliveryId;
    this.#saveToStorage();
  }

  #saveToStorage(): void {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.#cartItems));
  }
}

export function updateCartQuantityHTML(quantity: number): void {
  const cartQuantityElement = document.querySelector<HTMLDivElement>('.js-cart-quantity');
  if (!cartQuantityElement) {
    throw new Error('The cart quantity element does not exist');
  }
  cartQuantityElement.innerHTML = String(quantity);
}

function safeGetCartItem(cart: Cart, productId: string): CartItem | null {
  try {
    return cart.getCartItem(productId);
  } catch {
    return null; // Return null if cart item not found
  }
}

export const cart = new Cart('cart-oop');
