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
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsElement && cartTotalElement) {
      // Clear current cart items
      cartItemsElement.innerHTML = '';
      
      if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
        cartTotalElement.textContent = '$0.00';
        return;
      }
      
      // Calculate total
      let total = 0;
      
      // Add each item to the cart UI
      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
          </div>
          <div class="cart-item-actions">
            <button class="btn-quantity" data-action="decrease" data-index="${index}">-</button>
            <span class="item-quantity">${item.quantity}</span>
            <button class="btn-quantity" data-action="increase" data-index="${index}">+</button>
            <button class="btn-remove" data-index="${index}"><i class="ion-android-close"></i></button>
          </div>
        `;
        
        cartItemsElement.appendChild(itemElement);
      });
      
      // Update total
      cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
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
        
        // Create simplified HTML structure to avoid text overflow issues
        itemElement.innerHTML = `
          <a class="thumb" href="single-product.html?id=${item.id}">
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
  
  // Add event listeners
  document.addEventListener('click', function(e) {
    // Cart toggle button (assuming there's a cart icon in the header)
    if (e.target.matches('.btn-cart') || e.target.closest('.btn-cart')) {
      e.preventDefault();
    }
    
    // Remove item button
    if (e.target.matches('.minicart-remove')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      removeFromCart(index);
    }
    
    // Regular cart remove button
    if (e.target.matches('.btn-remove') || e.target.closest('.btn-remove')) {
      const button = e.target.matches('.btn-remove') ? e.target : e.target.closest('.btn-remove');
      const index = button.getAttribute('data-index');
      removeFromCart(parseInt(index));
    }
    
    // Quantity buttons
    if (e.target.matches('.btn-quantity')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      const action = e.target.getAttribute('data-action');
      updateQuantity(index, action);
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
