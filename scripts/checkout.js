import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js';
import { products } from '../data/products.js';
import { currencyFormatter } from './utils/money.js';
import { deliveryOptions } from '../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.13/esm/index.js';

let cartSummaryHTML = '';

cart.forEach((cartItem) => {

  const matchingProduct = products.find((product) => {
    return product.id === cartItem.productId;
  });

  let { initialDeliveryDate, deliveryHTML } = deliveryOptionsHTML(cartItem);

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
      <div class="delivery-date js-delivery-date-${cartItem.productId}">
        Delivery date: ${initialDeliveryDate}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src=${matchingProduct.image}>

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${currencyFormatter.format(matchingProduct.priceCents / 100)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary">
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
          ${deliveryHTML}   
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
  });
});

document.querySelectorAll('.js-delivery-option').forEach((option) => {
  option.addEventListener('click', () => {
    const { productId, deliveryId } = option.dataset;
    updateDeliveryOption(productId, deliveryId);
    
  //   const matchingOption = deliveryOptions.find((option) => {
  //     return option.id === Number(deliveryId);
  //   });
  //   const now = dayjs();

  //   const deliveryDateElement = document.querySelector(`.js-delivery-date-${productId}`);
  //   deliveryDateElement.innerHTML = `Delivery date: ${now.add(matchingOption.deliveryTime, 'day').format('dddd, MMMM DD')}`;
  });
});

function deliveryOptionsHTML(cartItem) {
  const now = dayjs();
  let initialDeliveryDate;
  let deliveryHTML = '';

  deliveryOptions.forEach((option) => {
    const selected = cartItem.deliveryId === option.id ? 'checked' : '';
    const deliveryPrice = option.deliveryPrice === 0 ? 'FREE' : currencyFormatter.format(option.deliveryPrice / 100);
    const deliveryDate = now.add(option.deliveryTime, 'day').format('dddd, MMMM DD');
    initialDeliveryDate = cartItem.deliveryId === option.id ? deliveryDate : initialDeliveryDate;

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

  return {
    initialDeliveryDate,
    deliveryHTML
  }
}

