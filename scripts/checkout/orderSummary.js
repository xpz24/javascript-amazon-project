import { cart, removeFromCart, updateDeliveryOption, getCartItem } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';
  const now = dayjs();

  cart.forEach((cartItem) => {

    // const matchingProduct = products.find((product) => {
    //   return product.id === cartItem.productId;
    // });
    const matchingProduct = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryId);
    const deliveryDateString = now.add(deliveryOption.deliveryTime, 'day').format('dddd, MMMM DD');

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
      <div class="delivery-date js-delivery-date-${cartItem.productId}">
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
            ${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${cartItem.productId}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${cartItem.productId}">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartItem.productId}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
          Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(cartItem, now)}   
        </div>
      </div>
    </div>
    `;
  });
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const cartItem = getCartItem(productId);

      if (link.innerText.trim() === 'Update') {
        const quantityLabelElement = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabelElement.innerHTML = `
          <input class="js-quantity-input-${productId}" type="number" value="${cartItem.quantity}" style="width: 50px;">
        `;
        link.innerText = 'Save';
      } else if (link.innerText.trim() === 'Save') {
        const quantityInputElement = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(quantityInputElement.value);
        if (newQuantity <= 0) {
          alert("Quantity must be greater than zero.");
          return;
        }
        cartItem.quantity = newQuantity;
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    option.addEventListener('click', () => {
      const { productId, deliveryId } = option.dataset;
      updateDeliveryOption(productId, deliveryId);
      renderOrderSummary();
      renderPaymentSummary();

      //   const matchingOption = deliveryOptions.find((option) => {
      //     return option.id === Number(deliveryId);
      //   });
      //   const now = dayjs();

      //   const deliveryDateElement = document.querySelector(`.js-delivery-date-${productId}`);
      //   deliveryDateElement.innerHTML = `Delivery date: ${now.add(matchingOption.deliveryTime, 'day').format('dddd, MMMM DD')}`;
    });
  });

  function deliveryOptionsHTML(cartItem, now) {
    //const now = dayjs();
    let deliveryHTML = '';

    deliveryOptions.forEach((option) => {
      const selected = cartItem.deliveryId === option.id ? 'checked' : '';
      const deliveryPrice = option.deliveryPrice === 0 ? 'FREE' : formatCurrency(option.deliveryPrice / 100);
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