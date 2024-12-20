import { cart } from '../../data/cart-class.js';
import { Product } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder, Order } from '../../data/orders.js';

/**
 * This function is used to render the payment summary of the checkout page
 */
export function renderPaymentSummary(): void {
  let totalQuantity = 0;
  let itemTotalCents = 0;
  let totalShippingCents = 0;
  const cartItems = cart.cartItems;

  cartItems.forEach((item) => {
    const matchingProduct = Product.getProduct(item.productId);
    const matchingDeliveryOption = getDeliveryOption(item.deliveryId);

    totalQuantity += item.quantity;
    itemTotalCents += matchingProduct.priceCents * item.quantity;
    totalShippingCents += matchingDeliveryOption.deliveryPrice;
  });

  const subTotalCents = itemTotalCents + totalShippingCents;
  const taxCents = (subTotalCents * 10) / 100;
  const totalCents = subTotalCents + taxCents;

  // console.log(totalQuantity);
  // console.log(formatCurrency(itemTotalCents));
  // console.log(formatCurrency(totalShippingCents));
  // console.log(formatCurrency(subTotalCents));
  // console.log(formatCurrency(taxCents));
  // console.log(formatCurrency(totalCents));

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${totalQuantity}):</div>
    <div class="payment-summary-money">${formatCurrency(itemTotalCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">${formatCurrency(totalShippingCents)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">${formatCurrency(subTotalCents)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">${formatCurrency(taxCents)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">${formatCurrency(totalCents)}</div>
  </div>

  <button class="place-order-button button-primary js-place-order">
    Place your order
  </button>
  `;

  const paymentSummaryElement = document.querySelector<HTMLDivElement>('.js-payment-summary');
  if (!paymentSummaryElement) {
    throw new Error('paymentSummaryElement does not exist');
  }
  paymentSummaryElement.innerHTML = paymentSummaryHTML;

  const returnHomeElement = document.querySelector<HTMLLinkElement>('.js-return-to-home-link');
  if (!returnHomeElement) {
    throw new Error('returnHomeElement does not exist');
  }
  returnHomeElement.innerHTML = `${totalQuantity} items`;

  const placeOrderButton = document.querySelector<HTMLButtonElement>('.js-place-order');
  if (!placeOrderButton) {
    throw new Error('placeOrderButton does not exist');
  }
  placeOrderButton.addEventListener('click', async () => {
    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart.cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error(`Order failed with status: ${response.status}`);
      }

      const order: Order = await response.json();
      addOrder(order);
      window.location.href = 'orders.html';
    } catch (error) {
      console.log(`Unexpected error:\n${error}`);
      alert('An error occurred while placing your order. Please try again.');
    }
  });
}
