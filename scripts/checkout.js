import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';

// new Promise((resolve) => {
//   loadProducts(() => resolve());
// }).then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });

// loadProductsFetch().then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });

renderCheckoutPage();

async function renderCheckoutPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log(error);
    console.log('Error, please try again');
  }
  renderOrderSummary();
  renderPaymentSummary();
}
