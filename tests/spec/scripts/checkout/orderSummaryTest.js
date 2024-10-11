import { renderOrderSummary } from '../../../../scripts/checkout/orderSummary.js';
import { cart, addToCart } from '../../../../data/cart.js';

describe('Test Suite: renderOrderSummary', () => {
  /**
   * @type {{productId: string, quantity: number}[]}
   */
  const testProducts = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
    },
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
    },
  ];

  const testContainerElement = document.querySelector('.js-test-container');

  beforeEach(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([])); // Just incase localStorage interferes with the testing
    cart.length = 0;

    testProducts.forEach((product) => {
      for (let i = 0; i < product.quantity; i++) {
        addToCart(product.productId);
      }
    });

    // testContainerElement.innerHTML = `
    //   <div class="js-order-summary"></div>
    // `;
    const orderSummaryElement = document.createElement('div');
    orderSummaryElement.classList.add('js-order-summary');
    testContainerElement.appendChild(orderSummaryElement);

    renderOrderSummary();
    fixImagePath(testContainerElement);
  });

  afterEach(() => {
    testContainerElement.innerHTML = ''; //uncomment to view the render on test page
  });

  it('Display the cart', () => {
    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(2);

    testProducts.forEach((product) => {
      const quantityElement = document.querySelector(`.js-product-quantity-${product.productId}`);
      const quantityDivElement = /**@type {HTMLDivElement} */ (quantityElement);

      expect(quantityDivElement.innerText).toContain(`Quantity: ${product.quantity}`);
    });
  });

  it('Removes a product', () => {
    let count = cart.length; // Replace with manual count if needed eg:- 2 if adding to items to cart

    expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(count);

    testProducts.forEach((product) => {
      /**@type {HTMLSpanElement} */
      const deleteLink = document.querySelector(`.js-delete-link-${product.productId}`);
      deleteLink.click();
      count--;

      expect(cart.length).toEqual(count);

      expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(count);
    });

    expect(count).toEqual(0);
  });
});

/**
 * Fixes the image paths for rendered view
 * @param {Element} testContainerElement - The element that contains all the generated HTML
 * @returns void
 */
function fixImagePath(testContainerElement) {
  // Fix image paths for test render
  const images = testContainerElement.querySelectorAll('img');
  images.forEach((image) => {
    image.src = `../images/${image.src.split('/images/')[1]}`;
  });
}

// export const viewHtmlButton = document.createElement('button');
// /**
//  * Renders the test view on a new tab
//  * @param {Element} testContainerElement - The element that contains all the generated HTML
//  * @returns void
//  */
// function generateTestView(testContainerElement) {
//   fixImagePath(testContainerElement);

//   viewHtmlButton.innerText = 'displayCart';
//   const htmlContent = testContainerElement.innerHTML;

//   viewHtmlButton.addEventListener('click', () => {
//     const baseUrl = window.location.origin;

//     const html = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <title>Test View</title>
//         <link rel="stylesheet" href="${baseUrl}/styles/shared/general.css">
//         <link rel="stylesheet" href="${baseUrl}/styles/pages/checkout/checkout.css">
//       </head>
//       <body>
//         ${htmlContent}
//         <script src="${baseUrl}/dist/orderSummary.bundle.js" type="module"></script>
//       </body>
//       </html>
//     `;

//     const blob = new Blob([html], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
//     window.open(url, '_blank');
//   });
// }
