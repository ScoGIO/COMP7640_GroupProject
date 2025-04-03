// Cart functionality for e-commerce website

// Initialize cart from localStorage or create empty array
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
window.addToCart = function(product) {
  const cart = getCart();
  
  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex !== -1) {
    // If product exists, increase quantity
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
  } else {
    // If not, add new product with quantity 1
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }
  
  // Save updated cart
  saveCart(cart);
  
  // Show confirmation modal
  showCartConfirmation(product);
  
  // Update cart count display if exists
  updateCartCount();
  
  return cart;
};

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  
  // Refresh cart display
  loadCartItems();
  
  // Update total price
  updateCartTotal();
  
  // Update cart count
  updateCartCount();
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity > 0) {
      item.quantity = quantity;
    } else {
      // If quantity is 0 or negative, remove item
      return removeFromCart(productId);
    }
    
    saveCart(cart);
    
    // Update subtotal for this item
    updateItemSubtotal(productId);
    
    // Update total price
    updateCartTotal();
    
    // Update cart count
    updateCartCount();
  }
}

// Calculate item subtotal
function calculateItemSubtotal(item) {
  return item.price * item.quantity;
}

// Update subtotal display for a specific item
function updateItemSubtotal(productId) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    const subtotalElement = document.querySelector(`.cart-item-${productId} .subtotal`);
    if (subtotalElement) {
      subtotalElement.textContent = `$${calculateItemSubtotal(item).toFixed(2)}`;
    }
  }
}

// Update cart total price
function updateCartTotal() {
  const cart = getCart();
  const totalElement = document.querySelector('.grand-total span');
  
  if (totalElement) {
    const total = cart.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

// Update cart count in header
function updateCartCount() {
  const cart = getCart();
  const countElement = document.querySelector('.cart-count');
  
  if (countElement) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElement.textContent = count;
  }
}

// Show cart confirmation modal
function showCartConfirmation(product) {
  // Get modal elements
  const modal = document.getElementById('action-CartAddModal');
  const productNameElement = modal.querySelector('.product-name a');
  const productImageElement = modal.querySelector('.thumb img');
  
  // Update modal content
  if (productNameElement) {
    productNameElement.textContent = product.name;
    productNameElement.href = `shop-single-product.html?id=${product.id}`;
  }
  
  // Show modal using Bootstrap
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  
  // Auto hide after 2 seconds
  setTimeout(() => {
    bsModal.hide();
  }, 2000);
}

// Load cart items into the shopping cart page
function loadCartItems() {
  // Check if we're on the cart page
  const cartTableBody = document.querySelector('.cart-table tbody');
  if (!cartTableBody) return;
  
  const cart = getCart();
  
  // Clear current cart items
  cartTableBody.innerHTML = '';
  
  if (cart.length === 0) {
    // If cart is empty, show message
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">Your cart is empty</td>
      </tr>
    `;
    return;
  }
  
  // Add each cart item to the table
  cart.forEach(item => {
    const itemHtml = `
      <tr class="cart-item-${item.id}">
        <td class="width-name">
          <div class="product-name"><a href="shop-single-product.html?id=${item.id}">${item.name}</a></div>
        </td>
        <td class="width-price">
          <span class="product-price">$${item.price.toFixed(2)}</span>
        </td>
        <td class="width-quantity">
          <div class="pro-qty">
            <input type="number" class="quantity-input" data-product-id="${item.id}" value="${item.quantity}" min="1">
          </div>
        </td>
        
        <td class="width-subtotal">
          <span class="subtotal">$${calculateItemSubtotal(item).toFixed(2)}</span>
        </td>
        <td class="width-remove">
          <button class="remove-product" data-product-id="${item.id}">×</button>
        </td>
      </tr>
    `;
    
    cartTableBody.insertAdjacentHTML('beforeend', itemHtml);
  });
  
  // Add event listeners for quantity inputs
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const productId = this.getAttribute('data-product-id');
      const quantity = parseInt(this.value, 10);
      updateCartItemQuantity(productId, quantity);
    });
  });
  
  // Add event listeners for remove buttons
  document.querySelectorAll('.remove-product').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id');
      removeFromCart(productId);
    });
  });
  
  // Update total
  updateCartTotal();
}

// Initialize cart functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Load cart items if on cart page
  loadCartItems();
  
  // Update cart count in header
  updateCartCount();
});