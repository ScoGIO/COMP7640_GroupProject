document.addEventListener('DOMContentLoaded', function () {
  // Check if user is logged in
  const userData = JSON.parse(localStorage.getItem('userData'));
  
  // If user data exists, update the header
  if (userData && userData.user) {
    // Get the user's name
    const userName = userData.user.userName || 'User';
    
    // Update desktop header
    const desktopAccountText = document.querySelector('.header-top-info .header-action-dropdown-acc .current-item');
    if (desktopAccountText) {
      desktopAccountText.textContent = userName;
    }
    
    // Update mobile header (keep the icon, just add tooltip or aria-label)
    const mobileAccountIcon = document.querySelector('.header-middle .header-action-dropdown-acc .current-item');
    if (mobileAccountIcon) {
      mobileAccountIcon.setAttribute('title', userName);
      mobileAccountIcon.setAttribute('aria-label', userName);
    }
    
    // Update all sign out links to properly log out
    const signOutLinks = document.querySelectorAll('.info-dropdown a[href="login.html"]');
    signOutLinks.forEach(link => {
      link.textContent = 'Sign Out';
      link.href = 'javascript:void(0)';
      link.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear user data on logout
        localStorage.removeItem('userData');
        // Redirect to home page
        window.location.href = 'index.html';
      });
    });
    
    // Change all "My Account" text in dropdown
    const myAccountLinks = document.querySelectorAll('.info-dropdown a[href="my-account.html"]');
    myAccountLinks.forEach(link => {
      link.textContent = 'My Account';
    });
  } else {
    // If not logged in, update login links to go to login page
    const signOutLinks = document.querySelectorAll('.info-dropdown a[href="login.html"]');
    signOutLinks.forEach(link => {
      link.textContent = 'Sign In';
      link.href = 'login-register.html';
    });
  }

  if (!userData) {
    // Redirect to login if not logged in
    window.location.href = 'login-register.html';
    return;
  }

  // Update user name in the welcome message
  const welcomeMessage = document.querySelector('.welcome p strong');
  if (welcomeMessage && userData.type === 1) {
    welcomeMessage.textContent = userData.user.userName;
  }
  console.log('User name:', userData.user ? userData.user.userName : 'User data structure issue');
  
  // If user is a customer, fetch and display their orders
  if (userData.type === 1 && userData.user.customerId) {
    fetchCustomerOrders(userData.user.customerId);
  }
});

function fetchCustomerOrders(customerId) {
  // Fetch orders for the logged-in customer
  fetch(`${CONFIG.SERVER_URL}order/getOrdersByCustomerId?customerId=${customerId}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        displayOrders(data.data);
      } else {
        console.error('Error fetching orders:', data.message);
      }
    })
    .catch(error => {
      console.error('Failed to fetch orders:', error);
    });
}

function displayOrders(orders) {
  const tableBody = document.querySelector('#orders .myaccount-table tbody');
  const tableHead = document.querySelector('#orders .myaccount-table thead tr');

  // Make sure table headers are correctly set
  if (tableHead) {
    tableHead.innerHTML = `
      <th>Order ID</th>
      <th>Date</th>
      <th>Items</th>
      <th>Status</th>
      <th>Total</th>
      <th>Action</th>
    `;
  }

  if (tableBody) {
    // Clear existing content
    tableBody.innerHTML = '';

    if (orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6">No orders found</td>
        </tr>
      `;
      return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

    // Add each order to the table
    orders.forEach(order => {
      // Determine order status based on transactions
      let statusText = 'Processing';
      let statusClass = 'text-warning';

      if (order.transactions && order.transactions.length > 0) {
        // Use the status of the first transaction as indicator
        // Status codes: 0 = pending, 1 = processing, 2 = shipped, 3 = delivered
        const status = order.transactions[0].status;

        if (status === 0) {
          statusText = 'Pending';
          statusClass = 'text-secondary';
        } else if (status === 1) {
          statusText = 'Processing';
          statusClass = 'text-primary';
        } else if (status === 2) {
          statusText = 'Shipped';
          statusClass = 'text-info';
        } else if (status === 3) {
          statusText = 'Delivered';
          statusClass = 'text-success';
        }
      }

      // Format date
      const orderDate = new Date(order.orderTime);
      const formattedDate = orderDate.toLocaleDateString() + ' ' +
        orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create a summary of items
      let itemsSummary = '';
      if (order.transactions && order.transactions.length > 0) {
        itemsSummary = `${order.transactions.length} item(s)`;
      } else {
        itemsSummary = 'No items';
      }

      // Create row
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${formattedDate}</td>
        <td>${itemsSummary}</td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>$${order.totalPrice.toFixed(2)}</td>
        <td><a href="#" class="check-btn sqr-btn view-order-details" data-order-id="${order.orderId}">View</a></td>
      `;

      tableBody.appendChild(row);
    });

    // Add event listeners to view buttons
    document.querySelectorAll('.view-order-details').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const orderId = this.getAttribute('data-order-id');
        const order = orders.find(o => o.orderId == orderId);
        if (order) {
          showOrderDetails(order);
        }
      });
    });
  }
}

function showOrderDetails(order) {
  // Create a modal to display order details
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'orderDetailsModal';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-hidden', 'true');

  // Format date
  const orderDate = new Date(order.orderTime);
  const formattedDate = orderDate.toLocaleDateString() + ' ' +
    orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Create transaction rows
  let transactionRows = '';
  if (order.transactions && order.transactions.length > 0) {
    order.transactions.forEach(transaction => {
      // Status text based on status code
      let statusText = 'Pending';
      if (transaction.status === 1) statusText = 'Processing';
      else if (transaction.status === 2) statusText = 'Shipped';
      else if (transaction.status === 3) statusText = 'Delivered';

      transactionRows += `
        <tr>
          <td>${transaction.transactionId}</td>
          <td>${transaction.productId}</td>
          <td>${transaction.count}</td>
          <td>$${transaction.transactionPrice.toFixed(2)}</td>
          <td>${statusText}</td>
        </tr>
      `;
    });
  } else {
    transactionRows = `<tr><td colspan="5">No items in this order</td></tr>`;
  }

  modal.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Order #${order.orderId} Details</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="order-info mb-4">
            <p><strong>Order Date:</strong> ${formattedDate}</p>
            <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
          </div>
          <h6 class="mb-3">Items</h6>
          <div class="table-responsive">
            <table class="table table-bordered">
              <thead class="thead-light">
                <tr>
                  <th>Transaction ID</th>
                  <th>Product ID</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactionRows}
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Create and initialize the Bootstrap modal
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();

  // Remove modal from DOM after it's hidden
  modal.addEventListener('hidden.bs.modal', function () {
    document.body.removeChild(modal);
  });
}

// Handle logout button
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', function () {
    // Clear user data on logout
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
  });
}