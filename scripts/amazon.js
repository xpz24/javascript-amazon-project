import { cart } from '../data/cart-oop.js';
import { products } from '../data/products.js';

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
          src="${product.starsUrl}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.price}
      </div>

      <div class="product-quantity-container">
        <select class="js-selected-quantity-${product.id}">
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
      ${product.extraInfoHTML()}
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
  document.querySelector('.js-cart-quantity').innerHTML = String(cart.totalQuantity);
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  const HTMLButton = /** @type {HTMLButtonElement} */ (button);
  HTMLButton.addEventListener('click', () => {
    const productId = HTMLButton.dataset.productId;
    /** @type {HTMLSelectElement} */
    const selectElement = document.querySelector(`.js-selected-quantity-${productId}`)
    cart.addToCart(productId, Number(selectElement.value));
    updateCartQuantity();
  });
});
