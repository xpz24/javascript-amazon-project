import { cart, addToCart } from '../data/cart.js';
import { products, Clothing } from '../data/products.js';

updateCartQuantity();

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      ${product instanceof Clothing ? product.extraInfoHTML() : ''
      /* Normally using polymorphism be better I think as there would be multiple
      child classes and they each might need overrides for extraInfoHTML()*/}
      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity() {
  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity').innerHTML = String(totalQuantity);
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  const HTMLButton = /** @type {HTMLButtonElement} */ (button);
  HTMLButton.addEventListener('click', () => {
    const productId = HTMLButton.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
  });
});
