import { cart, CartItem } from '../../data/cart-class.js';
import { Product } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import dayjs from 'dayjs';

/**
 * This function is used to render the order summary of the checkout page
 */
export function renderOrderSummary(): void {
  let cartSummaryHTML = '';
  const now = dayjs();
  const cartItems = cart.cartItems;
  cartItems.forEach((item) => {
    // const matchingProduct = products.find((product) => {
    //   return product.id === cartItem.productId;
    // });
    const matchingProduct = Product.getProduct(item.productId);
    const deliveryOption = getDeliveryOption(item.deliveryId);
    if (!matchingProduct) {
      throw new Error('No matching product found');
    } else if (!deliveryOption) {
      throw new Error('No matching delivery option found');
    }
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
  const orderSummaryElement = document.querySelector<HTMLDivElement>('.js-order-summary');
  if (!orderSummaryElement) {
    throw new Error('orderSummaryElement does not exist');
  }
  orderSummaryElement.innerHTML = cartSummaryHTML;

  // Example Using Type Guard, use when unsure of the link type //Old comments when using JSdocs
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

  const itemDeleteLink = document.querySelectorAll<HTMLSpanElement>('.js-delete-link');
  itemDeleteLink.forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      productId && cart.removeFromCart(productId);
      const cartItemElement = document.querySelector<HTMLDivElement>(
        `.js-cart-item-container-${productId}`,
      );
      cartItemElement && cartItemElement.remove();
      renderPaymentSummary();
    });
  });

  const quantityUpdateLinks = document.querySelectorAll<HTMLSpanElement>('.js-update-link');
  quantityUpdateLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      if (!productId) {
        throw new Error('Dataset does not have the product ID');
      }
      const cartItem = cart.getCartItem(productId);

      if (link.innerText.trim() === 'Update') {
        const quantityLabelElement = document.querySelector<HTMLSpanElement>(
          `.js-quantity-label-${productId}`,
        );
        quantityLabelElement &&
          (quantityLabelElement.innerHTML = `
          <input class="js-quantity-input-${productId}" type="number" value="${cartItem.quantity}" style="width: 50px;">
        `);
        link.innerText = 'Save';
      } else if (link.innerText.trim() === 'Save') {
        const quantityInputElement = document.querySelector<HTMLInputElement>(
          `.js-quantity-input-${productId}`,
        );
        if (!quantityInputElement) {
          throw new Error('Quantity input element not found');
        }
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

  const deliveryOptionsElements = document.querySelectorAll<HTMLDivElement>('.js-delivery-option');
  deliveryOptionsElements.forEach((option) => {
    option.addEventListener('click', () => {
      const { productId, deliveryId } = option.dataset;
      if (productId && deliveryId) {
        cart.updateDeliveryOption(productId, Number(deliveryId));
        renderOrderSummary();
        renderPaymentSummary();
      }
    });
  });

  /**
   * Generates the delivery options HTML based on the items in cart and the current time represented by a dayjs object
   */
  function deliveryOptionsHTML(cartItem: CartItem, now: dayjs.Dayjs): string {
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
