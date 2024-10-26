import { orders } from '../data/orders.js';
import { formatCurrency } from './utils/money.js';
import { Product, loadProductsFetch } from '../data/products.js';
import { cart, updateCartQuantityHTML } from '../data/cart-class.js';
import dayjs from 'dayjs';
import { ProductOrdered } from '../data/orders.js';

renderOrdersPage();

async function renderOrdersPage() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log(error);
    console.log('Error, please try again');
  }

  let ordersHTML = '';

  orders.forEach((order) => {
    const orderDate = dayjs(order.orderTime).format('MMMM DD');
    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
        ${renderDetailsGrid(order.products)}
        </div>
      </div>
    `;
  });
  const ordersGridElement = document.querySelector<HTMLDivElement>('.js-orders-grid');
  if (!ordersGridElement) {
    throw new Error('The orders grid element does not exist');
  }
  ordersGridElement.innerHTML = ordersHTML;

  function renderDetailsGrid(products: ProductOrdered[]): string {
    let productHTML = '';

    products.forEach((product) => {
      const productObject = Product.getProduct(product.productId);
      if (!productObject) {
        throw new Error('Could not find the product to render the details');
      }
      const deliveryDate = dayjs(product.estimatedDeliveryTime).format('MMMM DD');

      productHTML += `
      <div class="product-image-container">
        <img src="${productObject.image}" />
      </div>

      <div class="product-details">
        <div class="product-name">
          ${productObject.name}
        </div>
        <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
        <div class="product-quantity">Quantity: ${product.quantity}</div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png" />
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
    });

    return productHTML;
  }
  cart.deleteCartItems();
  updateCartQuantityHTML(cart.totalQuantity);
  // const cartQuantityElement = document.querySelector('.js-cart-quantity');
  // cartQuantityElement && (cartQuantityElement.innerHTML = `${cart.totalQuantity}`);
}
