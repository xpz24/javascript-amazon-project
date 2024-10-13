import { cart } from '../../data/cart-class.js';
import { Product } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import dayjs from 'dayjs';

/**
 * This function is used to render the order summary of the checkout page
 */
export function renderOrderSummary() {
  let cartSummaryHTML = '';
  const now = dayjs();
  const cartItems = cart.cartItems;
  cartItems.forEach((item) => {
    // const matchingProduct = products.find((product) => {
    //   return product.id === cartItem.productId;
    // });
    const matchingProduct = Product.getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryId);
    const deliveryDateString = now.add(deliveryOption.deliveryTime, 'day').format('dddd, MMMM DD');

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${item.productId}">
      <div class="delivery-date js-delivery-date-${item.productId}">
        Delivery date: ${deliveryDateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src=${matchingProduct.image}>

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${matchingProduct.price}
          </div>
          <div class="product-quantity js-product-quantity-${item.productId}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${item.productId}">${item.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${item.productId}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${item.productId}" data-product-id="${item.productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
          Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(item, now)}   
        </div>
      </div>
    </div>
    `;
  });
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Example Using Type Guard, use when unsure of the link type
  // document.querySelectorAll('.js-delete-link').forEach((link) => {
  //   if (link instanceof HTMLSpanElement) {
  //     link.addEventListener('click', () => {
  //     const productId = link.dataset.productId;
  //     removeFromCart(productId);
  //     document.querySelector(`.js-cart-item-container-${productId}`).remove();
  //     renderPaymentSummary();
  //     });
  //   }
  // });

  // Using JSDoc, use when you are sure of the type of link
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    /**
     * This is the span element used for deletion
     * @type {HTMLSpanElement} // This part is type declaration
     */
    const spanLink = /** @type {HTMLSpanElement} */ (link); // This part is explicit type casting
    spanLink.addEventListener('click', () => {
      const productId = spanLink.dataset.productId;
      cart.removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    /** @type {HTMLSpanElement} */
    const spanLink = /** @type {HTMLSpanElement} */ (link);
    spanLink.addEventListener('click', () => {
      const productId = spanLink.dataset.productId;
      const cartItem = cart.getCartItem(productId);

      if (spanLink.innerText.trim() === 'Update') {
        const quantityLabelElement = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabelElement.innerHTML = `
          <input class="js-quantity-input-${productId}" type="number" value="${cartItem.quantity}" style="width: 50px;">
        `;
        spanLink.innerText = 'Save';
      } else if (spanLink.innerText.trim() === 'Save') {
        /** @type {HTMLInputElement}*/
        const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInputElement.value);
        if (newQuantity <= 0) {
          alert('Quantity must be greater than zero.');
          return;
        }
        cart.overrideQuantity(productId, newQuantity);
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    const divOption = /** @type {HTMLDivElement} */ (option);
    divOption.addEventListener('click', () => {
      const { productId, deliveryId } = divOption.dataset;
      cart.updateDeliveryOption(productId, Number(deliveryId));
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  /**
   * Generates the delivery options HTML based on the items in cart and the current time represented by a dayjs object
   * @param {{productId: string, quantity: number, deliveryId: number}} cartItem - item in the cart
   * @param {dayjs.Dayjs} now - dayjs object representing the current date
   * @returns {string} the generated deliveryHTML
   */
  function deliveryOptionsHTML(cartItem, now) {
    //const now = dayjs();
    let deliveryHTML = '';

    deliveryOptions.forEach((option) => {
      const selected = cartItem.deliveryId === option.id ? 'checked' : '';
      const deliveryPrice =
        option.deliveryPrice === 0 ? 'FREE' : formatCurrency(option.deliveryPrice);
      const deliveryDate = now.add(option.deliveryTime, 'day').format('dddd, MMMM DD');

      deliveryHTML += `
      <div class="delivery-option js-delivery-option" data-delivery-id="${option.id}" data-product-id="${cartItem.productId}">
        <input type="radio" ${selected}
          class="delivery-option-input"
          name="delivery-option-${cartItem.productId}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${deliveryPrice} Shipping
          </div>
        </div>
      </div>
      `;
    });

    return deliveryHTML;
  }
}
