import { cart, updateCartQuantityHTML } from '../data/cart-class.js';
import { products, loadProductsFetch } from '../data/products.js';

renderProductGrid();

async function renderProductGrid() {
  try {
    await loadProductsFetch();
  } catch (error) {
    console.log(error);
    console.log('Error, please try again');
    return;
  }
  updateCartQuantityHTML(cart.totalQuantity);
  const qtyOptionAmount: number = 10;
  let productsHTML: string = '';

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
          ${generateQuantityOptions(qtyOptionAmount)}
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

  const productGridElement = document.querySelector<HTMLDivElement>('.js-products-grid');
  if (!productGridElement) {
    throw new Error('The product grid element does not exist');
  }
  productGridElement.innerHTML = productsHTML;

  const addToCartButtons = document.querySelectorAll<HTMLButtonElement>('.js-add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      const selectElement = document.querySelector<HTMLSelectElement>(
        `.js-selected-quantity-${productId}`,
      );
      if (!productId) {
        throw new Error('The product ID is not linked to the add to cart button');
      } else if (!selectElement) {
        throw new Error('Cannot find the quantity select element');
      }
      cart.addToCart(productId, Number(selectElement.value));
      updateCartQuantityHTML(cart.totalQuantity);
    });
  });
}

function generateQuantityOptions(max: number): string {
  let options = '<option selected value="1">1</option>';
  for (let i = 2; i <= max; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}