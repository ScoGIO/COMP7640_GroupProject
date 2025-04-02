document.addEventListener('DOMContentLoaded', function() {
  // Initialize the shopping cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Function to update cart UI
  function updateCartUI() {
    // Update cart count in header (all instances)
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
      element.textContent = getTotalQuantity();
    });
    
    // Update cart amount in header (all instances)
    const cartAmountElements = document.querySelectorAll('.cart-amount');
    cartAmountElements.forEach(element => {
      element.textContent = `$${calculateTotal().toFixed(2)}`;
    });
    
    // Update minicart total (all instances)
    const minicartTotalElements = document.querySelectorAll('.minicart-subtotal .total');
    minicartTotalElements.forEach(element => {
      element.textContent = `$${calculateTotal().toFixed(2)}`;
    });
    
    // Update minicart items
    updateMiniCartItems();
    
    // Update cart page if on cart page
    updateCartPage();
    
    // Save cart to localStorage
    saveCart();
  }

  // Function to save cart to localStorage
  function saveCart() {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart:', error);
      // Show fallback message to user
    }
  }

  // Function to update mini cart items in header
  function updateMiniCartItems() {
    const minicartListElements = document.querySelectorAll('.minicart-list');
    
    minicartListElements.forEach(list => {
      // Clear current items
      list.innerHTML = '';
      
      if (cart.length === 0) {
        list.innerHTML = '<div class="minicart-item"><p>Your cart is empty</p></div>';
        return;
      }
      
      // Add each item to minicart
      cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'minicart-item';
        
        itemElement.innerHTML = `
          <a class="thumb" href="shop-single-product.html?id=${item.id}">
            <span>${item.name}</span>
            <span class="quantity-number">${item.quantity}x</span>
          </a>
          <p class="quantity-price">$${(item.price * item.quantity).toFixed(2)}</p>
          <button class="minicart-remove" data-index="${index}" type="button">×</button>
        `;
        
        list.appendChild(itemElement);
      });
    });
  }
  
  // Function to update cart page
  function updateCartPage() {
    // Check if we're on the cart page
    const cartTable = document.querySelector('.cart-table tbody');
    if (!cartTable) return;
    
    // Clear table
    cartTable.innerHTML = '';
    
    if (cart.length === 0) {
      // Display empty cart message
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="6" style="text-align: center; padding: 30px;">
          <p>Your cart is empty</p>
          <a href="shop.html" class="btn-theme">Continue Shopping</a>
        </td>
      `;
      cartTable.appendChild(emptyRow);
      
      // Update totals
      updateCartTotals(0);
      return;
    }
    
    // Add table header if not present
    const headerRow = document.querySelector('.cart-table thead tr');
    if (!headerRow || headerRow.children.length === 0) {
      const headerElement = document.querySelector('.cart-table thead');
      if (headerElement) {
        headerElement.innerHTML = `
          <tr>
            <th class="product-thumbnail">Image</th>
            <th class="product-name">Product</th>
            <th class="product-price">Price</th>
            <th class="product-quantity">Quantity</th>
            <th class="product-subtotal">Total</th>
            <th class="product-remove">Remove</th>
          </tr>
        `;
      }
    }
    
    // Add each item to the cart table
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="product-thumbnail">
          <a href="shop-single-product.html?id=${item.id}">
            <img src="assets/img/shop/cart-placeholder.webp" alt="${item.name}" width="80">
          </a>
        </td>
        <td class="product-name">
          <a href="shop-single-product.html?id=${item.id}">${item.name}</a>
        </td>
        <td class="product-price">$${item.price.toFixed(2)}</td>
        <td class="product-quantity">
          <div class="quantity">
            <button class="qty-decrease" data-index="${index}">-</button>
            <input type="text" value="${item.quantity}" readonly>
            <button class="qty-increase" data-index="${index}">+</button>
          </div>
        </td>
        <td class="product-subtotal">$${itemTotal.toFixed(2)}</td>
        <td class="product-remove">
          <button class="remove-item" data-index="${index}">×</button>
        </td>
      `;
      
      cartTable.appendChild(row);
    });
    
    // Update cart totals section
    updateCartTotals(calculateTotal());
    
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        updateQuantity(index, 'decrease');
      });
    });
    
    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        updateQuantity(index, 'increase');
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.dataset.index);
        removeFromCart(index);
      });
    });
  }
  
  // Function to update cart totals section on cart page
  function updateCartTotals(subtotal) {
    // Update subtotal in the grand total section
    const subtotalElement = document.querySelector('.grand-total-content h3 span');
    if (subtotalElement) {
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update the total price
    const totalElement = document.querySelector('.grand-total h4 span');
    if (totalElement) {
      const shippingCost = 5.00; // Default shipping cost
      const total = subtotal + shippingCost;
      totalElement.textContent = `$${total.toFixed(2)}`;
    }
  }
  
  // Function to calculate total cart value
  function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  // Function to get total quantity of items in cart
  function getTotalQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
  
  // Function to add item to cart
  window.addToCart = function(product) {
    // Validate required product properties
    if (!product || !product.id || !product.name || isNaN(product.price)) {
      console.error('Invalid product data:', product);
      return false;
    }
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    // Update cart UI
    updateCartUI();
  };
  
  // Function to remove item from cart
  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }
  
  // Function to update item quantity
  function updateQuantity(index, action) {
    if (action === 'increase') {
      cart[index].quantity += 1;
    } else if (action === 'decrease') {
      if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
      } else {
        removeFromCart(index);
        return;
      }
    }
    
    updateCartUI();
  }
  
  // Add event listeners for minicart interactions
  document.addEventListener('click', function(e) {
    // Minicart remove button
    if (e.target.matches('.minicart-remove')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      removeFromCart(index);
    }
    
    // Checkout button - store cart data for checkout page
    if (e.target.matches('.cart-button') || e.target.closest('.cart-button')) {
      if (cart.length > 0) {
        // Store cart data for checkout page
        localStorage.setItem('checkout_cart', JSON.stringify({
          items: cart,
          total: calculateTotal(),
          timestamp: new Date().toISOString()
        }));
        // Let the default link behavior handle navigation
      } else {
        e.preventDefault();
        alert('Your cart is empty');
      }
    }
  });
  
  // Initialize cart UI on page load
  updateCartUI();
});
