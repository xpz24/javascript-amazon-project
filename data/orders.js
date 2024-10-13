/**
 * @typedef {object} ProductOrdered
 * @property {string} productId
 * @property {number} quantity
 * @property {string} estimatedDeliveryTime
 * @property {number | null} variation
 */

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {string} orderTime
 * @property {number} totalCostCents
 * @property {ProductOrdered[]} products
 */

/** @type {Order[]} */
export const orders = JSON.parse(localStorage.getItem('orders')) || [];


/**
 * Prepends the order to order list
 * @param {Order} order - Object representing the order
 * @returns {void} void
 */
export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
