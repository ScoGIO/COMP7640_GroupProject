document.addEventListener('DOMContentLoaded', function() {
  // Load checkout data from localStorage
  const checkoutData = JSON.parse(localStorage.getItem('checkout_cart'));
  
  if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
    // Redirect back to cart if no items
    window.location.href = 'shop-cart.html';
    return;
  }
  
  // Display checkout items
  const orderSummaryElement = document.getElementById('order-summary');
  if (orderSummaryElement) {
    // Clear current items
    orderSummaryElement.innerHTML = '';
    
    // Add heading
    const headingElement = document.createElement('h4');
    headingElement.textContent = 'Order Summary';
    orderSummaryElement.appendChild(headingElement);
    
    // Create order summary table
    const tableElement = document.createElement('table');
    tableElement.className = 'order-table';
    
    // Add table header
    const theadElement = document.createElement('thead');
    theadElement.innerHTML = `
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    `;
    tableElement.appendChild(theadElement);
    
    // Add table body
    const tbodyElement = document.createElement('tbody');
    
    // Add items to table
    checkoutData.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      
      const rowElement = document.createElement('tr');
      rowElement.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${itemTotal.toFixed(2)}</td>
      `;
      
      tbodyElement.appendChild(rowElement);
    });
    
    // Add subtotal row
    const subtotalRow = document.createElement('tr');
    subtotalRow.className = 'subtotal';
    subtotalRow.innerHTML = `
      <td colspan="3">Subtotal</td>
      <td>$${checkoutData.total.toFixed(2)}</td>
    `;
    tbodyElement.appendChild(subtotalRow);
    
    // Add shipping row (example - could be calculated based on address)
    const shippingRow = document.createElement('tr');
    shippingRow.className = 'shipping';
    shippingRow.innerHTML = `
      <td colspan="3">Shipping</td>
      <td>$7.00</td>
    `;
    tbodyElement.appendChild(shippingRow);
    
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total';
    const orderTotal = checkoutData.total + 7.00; // Adding shipping
    totalRow.innerHTML = `
      <td colspan="3"><strong>Total</strong></td>
      <td><strong>$${orderTotal.toFixed(2)}</strong></td>
    `;
    tbodyElement.appendChild(totalRow);
    
    tableElement.appendChild(tbodyElement);
    orderSummaryElement.appendChild(tableElement);
  }
  
  // Handle place order button
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Create order data
      const orderData = {
        items: checkoutData.items,
        total: checkoutData.total,
        shipping: 7.00,
        orderTotal: checkoutData.total + 7.00,
        orderDate: new Date().toISOString(),
        // Add customer info from form
        customer: {
          name: document.getElementById('customer-name')?.value || '',
          email: document.getElementById('customer-email')?.value || '',
          address: document.getElementById('customer-address')?.value || ''
        }
      };
      
      // Save order data (normally would send to server)
      localStorage.setItem('last_order', JSON.stringify(orderData));
      
      // Clear checkout cart
      localStorage.removeItem('checkout_cart');
      
      // Clear shopping cart
      localStorage.removeItem('cart');
      
      // Redirect to order confirmation
      window.location.href = 'order-confirmation.html';
    });
  }
});