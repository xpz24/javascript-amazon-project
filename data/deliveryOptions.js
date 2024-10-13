/**
 * @typedef {Object} deliveryOption
 * @property {number} id
 * @property {number} deliveryTime
 * @property {number} deliveryPrice
 */

/**
 * Returns an object containing a delivery option based on the given delivery ID
 * @param {number} optionId - ID of the delivery option to find
 * @returns {deliveryOption} The delivery object that matches the given ID
 */
export function getDeliveryOption(optionId) {
  return deliveryOptions.find((option) => option.id === optionId); // || deliveryOptions[0];
}

/**
 * @type {deliveryOption[]}
 */
export const deliveryOptions = [
  {
    id: 0,
    deliveryTime: 7,
    deliveryPrice: 0,
  },
  {
    id: 1,
    deliveryTime: 3,
    deliveryPrice: 499,
  },
  {
    id: 2,
    deliveryTime: 1,
    deliveryPrice: 999,
  },
];
