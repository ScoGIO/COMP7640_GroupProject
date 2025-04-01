const mockAPI = {
    // Mock user data
    users: {
      "6": {
        code: 200,
        data: {
          type: 1,
          user: {
            customerId: 1,
            userId: 6,
            userName: "John Doe",
            contactNumber: 155512345
          }
        },
        message: "success"
      },
      "1": {
        code: 200,
        data: {
          type: 2,
          user: {
            vendorId: 1,
            userId: 1,
            vendorName: "Fresh Foods Co",
            customerFeedbackScore: 4.5,
            geographicalPresence: "New York"
          }
        },
        message: "success"
      },
      "admin": {
        code: 200,
        data: {
          type: 0,
          user: {
            userID: 13,
            pwd: null,
            type: 0
          }
        },
        message: "success"
      }
    },
  
    // Mock orders data - copied from the getOrdersByCustomerId file
    customerOrders: {
      "1": {
        code: 200,
        data: [
          {
            orderId: 1,
            customerId: 1,
            totalPrice: 29.9,
            orderTime: "2025-03-31T09:00:07",
            transactions: [
              {
                transactionId: 1,
                productId: 1,
                orderId: 1,
                count: 10,
                transactionPrice: 29.9,
                status: 3
              }
            ]
          },
          {
            orderId: 8,
            customerId: 1,
            totalPrice: 59.96,
            orderTime: "2025-03-31T16:05:21",
            transactions: [
              {
                transactionId: 9,
                productId: 6,
                orderId: 8,
                count: 20,
                transactionPrice: 19.8,
                status: 3
              },
              {
                transactionId: 10,
                productId: 5,
                orderId: 8,
                count: 3,
                transactionPrice: 38.97,
                status: 3
              }
            ]
          },
          {
            orderId: 15,
            customerId: 1,
            totalPrice: 12.99,
            orderTime: "2025-03-31T11:55:13",
            transactions: [
              {
                transactionId: 18,
                productId: 5,
                orderId: 15,
                count: 1,
                transactionPrice: 12.99,
                status: 2
              }
            ]
          },
          {
            orderId: 22,
            customerId: 1,
            totalPrice: 89.97,
            orderTime: "2025-03-31T18:40:59",
            transactions: [
              {
                transactionId: 26,
                productId: 8,
                orderId: 22,
                count: 3,
                transactionPrice: 119.97,
                status: 3
              }
            ]
          },
          {
            orderId: 29,
            customerId: 1,
            totalPrice: 39.99,
            orderTime: "2025-03-31T13:40:30",
            transactions: [
              {
                transactionId: 34,
                productId: 8,
                orderId: 29,
                count: 1,
                transactionPrice: 39.99,
                status: 2
              }
            ]
          },
          {
            orderId: 31,
            customerId: 1,
            totalPrice: 199.9,
            orderTime: "2025-03-31T00:40:02",
            transactions: [
              {
                transactionId: 36,
                productId: 2,
                orderId: 31,
                count: 10,
                transactionPrice: 199.9,
                status: 0
              }
            ]
          },
          {
            orderId: 32,
            customerId: 1,
            totalPrice: 199.9,
            orderTime: "2025-03-31T00:44:44",
            transactions: [
              {
                transactionId: 37,
                productId: 2,
                orderId: 32,
                count: 10,
                transactionPrice: 199.9,
                status: 0
              }
            ]
          }
        ],
        message: "success"
      }
    },
    
    getOrdersByCustomerId: function(customerId) {
        return new Promise((resolve, reject) => {
          if (this.customerOrders[customerId]) {
            resolve(this.customerOrders[customerId]);
          } else {
            resolve({
              code: 404,
              data: [],
              message: "No orders found for this customer"
            });
          }
        });
      }
}

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('userData'));
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

    // If user is a customer, fetch and display their orders
    if (userData.type === 1 && userData.user.customerId) {
      fetchCustomerOrders(userData.user.customerId);
    }
  });
  window.mockAPI = mockAPI;
  function fetchCustomerOrders(customerId) {{
    // Check if we should use mockAPI (if real API is not available)
    if (window.mockAPI) {
      console.log("Using mock API for fetching orders");
      mockAPI.getOrdersByCustomerId(customerId)
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
    } else {
    fetch(`http://127.0.0.1:8080/commerce/order/getOrdersByCustomerId?customerId=${customerId}`)
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
  }}

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
  }}