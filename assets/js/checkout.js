document.addEventListener('DOMContentLoaded', function() {
  // Load checkout data from localStorage
  const checkoutData = JSON.parse(localStorage.getItem('checkout_cart'));
  
  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
    // Redirect back to shop if no items
    window.location.href = 'shop.html';
    return;
  }
  
  // Update the product list on checkout page
  const orderProductList = document.querySelector('.your-order-product ul');
  if (orderProductList) {
    // Clear current items
    orderProductList.innerHTML = '';
    
    // Add each item to the order summary
    checkoutData.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <span class="product-title">${item.name} × ${item.quantity}</span>
        <span class="product-price">$${itemTotal.toFixed(2)}</span>
      `;
      
      orderProductList.appendChild(listItem);
    });
  }
  
  // Update subtotal
  const subtotalElement = document.querySelector('.your-order-subtotal span');
  if (subtotalElement) {
    subtotalElement.textContent = `$${checkoutData.total.toFixed(2)}`;
  }
  
  // Update shipping
  const shippingElement = document.querySelector('.your-order-shipping');
  if (shippingElement) {
    shippingElement.innerHTML = `
      <h3>Shipping <span>$7.00</span></h3>
    `;
  }
  
  // Update total
  const totalElement = document.querySelector('.your-order-total');
  if (totalElement) {
    const orderTotal = checkoutData.total + 7.00; // Adding shipping
    totalElement.innerHTML = `
      <h3>Total <span>$${orderTotal.toFixed(2)}</span></h3>
    `;
  }
  
  // Handle place order button
  const placeOrderButton = document.getElementById('place-order-btn');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate form fields (simplified validation)
      const firstName = document.querySelector('input[type="text"]').value;
      
      if (!firstName) {
        alert('Please fill in the required fields');
        return;
      }
      
      // Create order data
      const orderData = {
        items: checkoutData.items,
        subtotal: checkoutData.total,
        shipping: 7.00,
        total: checkoutData.total + 7.00,
        orderDate: new Date().toISOString()
      };
      
      // Save order data
      localStorage.setItem('last_order', JSON.stringify(orderData));
      
      // Clear checkout and cart data
      localStorage.removeItem('checkout_cart');
      localStorage.removeItem('cart');
      
      // Redirect to success page or show success message
      alert('Order placed successfully!');
      window.location.href = 'index.html';
    });
  }
});