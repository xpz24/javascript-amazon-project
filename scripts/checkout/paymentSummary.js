import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { currencyFormatter } from "../utils/money.js";

export function renderPaymentSummary() {
  let totalQuantity = 0;
  let itemTotalCents = 0;
  let totalShippingCents = 0;

  cart.forEach((cartItem) => {
    // const matchingProduct = products.find((product) => {
    //   return product.id === cartItem.productId;
    // });
    const matchingProduct = getProduct(cartItem.productId);
    // const matchingDeliveryOption = deliveryOptions.find((option) => {
    //   return option.id === cartItem.deliveryId;
    // });
    const matchingDeliveryOption = getDeliveryOption(cartItem.deliveryId);

    totalQuantity += cartItem.quantity;
    itemTotalCents += matchingProduct.priceCents * cartItem.quantity;
    totalShippingCents += matchingDeliveryOption.deliveryPrice;
  });

  const subTotalCents = itemTotalCents + totalShippingCents;
  const taxCents = subTotalCents * 10 / 100;
  const totalCents = subTotalCents + taxCents;

  // console.log(totalQuantity);
  // console.log(currencyFormatter.format(itemTotalCents / 100));
  // console.log(currencyFormatter.format(totalShippingCents / 100));
  // console.log(currencyFormatter.format(subTotalCents / 100));
  // console.log(currencyFormatter.format(taxCents / 100));
  // console.log(currencyFormatter.format(totalCents / 100));

  const paymentSummaryHTML = `
  <div class="payment-summary-title">
    Order Summary
  </div>

  <div class="payment-summary-row">
    <div>Items (${totalQuantity}):</div>
    <div class="payment-summary-money">${currencyFormatter.format(itemTotalCents / 100)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Shipping &amp; handling:</div>
    <div class="payment-summary-money">${currencyFormatter.format(totalShippingCents / 100)}</div>
  </div>

  <div class="payment-summary-row subtotal-row">
    <div>Total before tax:</div>
    <div class="payment-summary-money">${currencyFormatter.format(subTotalCents / 100)}</div>
  </div>

  <div class="payment-summary-row">
    <div>Estimated tax (10%):</div>
    <div class="payment-summary-money">${currencyFormatter.format(taxCents / 100)}</div>
  </div>

  <div class="payment-summary-row total-row">
    <div>Order total:</div>
    <div class="payment-summary-money">${currencyFormatter.format(totalCents / 100)}</div>
  </div>

  <button class="place-order-button button-primary">
    Place your order
  </button>
  `;

  const paymentSummaryElement = document.querySelector('.js-payment-summary');
  paymentSummaryElement.innerHTML = paymentSummaryHTML;

  document.querySelector('.js-return-to-home-link').innerHTML = `${totalQuantity} items`;
  
}

