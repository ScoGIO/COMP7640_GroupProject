document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const loginMessage = document.getElementById('loginMessage');

    loginButton.addEventListener('click', function () {
      // Get input values
      const userID = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      // Basic validation
      if (!userID || !password) {
        showLoginMessage('Please enter both username and password', 'error');
        return;
      }
      
      // Send credentials to backend using the global CONFIG
      fetch(`${CONFIG.SERVER_URL}user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 200) {
            // Login successful
            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(data.data));
            
            // Redirect based on user type
            if (data.data.type === 1) {
              // Customer user
              window.location.href = 'my-account.html';
            } else if (data.data.type === 2) {
              // Vendor user
              window.location.href = 'vendor-dashboard.html'; // Adjust if actual file is different
            } else if (data.data.type === 0) {
              // Admin user
              window.location.href = 'admin-dashboard.html'; // Adjust if actual file is different
            } else {
              // Fallback for unexpected user type
              console.warn('Unknown user type:', data.data.type);
              window.location.href = 'my-account.html';
            }
          } else {
            // Failed login
            showLoginMessage(data.message || 'Invalid username or password', 'error');
          }
        })
        .catch(error => {
          console.error('Login error:', error);
          showLoginMessage('An error occurred during login. Please try again.', 'error');
        });
    });

    function showLoginMessage(message, type) {
      loginMessage.textContent = message;
      loginMessage.style.display = 'block';
      loginMessage.style.color = type === 'error' ? '#dc3545' : '#28a745';

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        loginMessage.style.display = 'none';
      }, 5000);
    }
  });