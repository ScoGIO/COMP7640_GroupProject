// Checkout page functionality for e-commerce website

document.addEventListener('DOMContentLoaded', function() {
  // Load cart items into checkout page
  loadCheckoutItems();
});

// Load cart items from localStorage and display on checkout page
function loadCheckoutItems() {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Get elements where we'll insert cart data
  const orderProductList = document.querySelector('.your-order-product ul');
  const orderSubtotalElement = document.querySelector('.your-order-subtotal span');
  const orderTotalElement = document.querySelector('.your-order-total span');
  
  if (!orderProductList || !orderSubtotalElement || !orderTotalElement) {
    console.error('Required checkout page elements not found');
    return;
  }
  
  // Clear any example/placeholder items
  orderProductList.innerHTML = '';
  
  // Check if cart is empty
  if (cart.length === 0) {
    orderProductList.innerHTML = '<li>Your cart is empty</li>';
    orderSubtotalElement.textContent = '$0.00';
    orderTotalElement.textContent = '$0.00';
    
    // Disable place order button
    const placeOrderBtn = document.querySelector('.place-order a');
    if (placeOrderBtn) {
      placeOrderBtn.classList.add('disabled');
      placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Your cart is empty. Please add items to your cart before checkout.');
      });
    }
    
    return;
  }
  
  // Calculate totals
  let subtotal = 0;
  
  // Add each cart item to the order summary
  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;
    
    // Create list item for product
    const li = document.createElement('li');
    li.innerHTML = `${item.name} × ${item.quantity} <span>$${itemSubtotal.toFixed(2)}</span>`;
    orderProductList.appendChild(li);
  });
  
  // Update subtotal and total amounts
  orderSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  orderTotalElement.textContent = `$${subtotal.toFixed(2)}`;
  
  // Add event listener to place order button
  const placeOrderBtn = document.querySelector('.place-order a');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function(e) {
      e.preventDefault();
      processOrder();
    });
  }
}

// Process the order
function processOrder() {
  // Get selected payment method
  const selectedPayment = document.querySelector('input[name="payment_method"]:checked');
  if (!selectedPayment) {
    alert('Please select a payment method');
    return;
  }
  
  // Get cart items from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to your cart before checkout.');
    return;
  }
  
  // Get customer ID from localStorage (should be set during login)
  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const customerId = userData.customerId || '1'; // Default to 1 for demo if not logged in
  
  // Format transactions array as required by API
  const transactions = cart.map(item => ({
    productId: item.id.toString(),
    count: item.quantity
  }));
  
  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  
  // Prepare order data according to API requirements
  const orderData = {
    customerId: customerId,
    transactions: transactions,
    totalPrice: totalPrice
  };
  
  // Show loading status
  const placeOrderBtn = document.querySelector('.place-order a');
  if (placeOrderBtn) {
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.classList.add('disabled');
  }
  console.log('Placing order with data:', orderData);
  // Send order to backend
  fetch(CONFIG.SERVER_URL + 'order/addOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if (data.code === 200) {
      // Order was successful
      alert('Your order has been placed successfully! Order ID: ' + data.data.orderId);
      
      // Clear the cart
      localStorage.removeItem('cart');
      
      // Redirect to order confirmation page or home
      window.location.href = 'index.html';
    } else {
      // Handle error from server
      throw new Error(data.message || 'Error processing order');
    }
  })
  .catch(error => {
    console.error('Error processing order:', error);
    alert('Failed to process your order. Please try again. Error: ' + error.message);
    
    // Reset button
    if (placeOrderBtn) {
      placeOrderBtn.textContent = 'Place Order';
      placeOrderBtn.classList.remove('disabled');
    }
  });
}