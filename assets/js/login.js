const mockResponses = {
    "6": { // username "6" (customer)
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
    "1": { // username "1" (vendor)
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
    }
  };

  const mockMode = true; // Set to false to disable mock responses


document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const loginMessage = document.getElementById('loginMessage');

    loginButton.addEventListener('click', function () {
      // Get input values
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;

      // Basic validation
      if (!username || !password) {
        showLoginMessage('Please enter both username and password', 'error');
        return;
      }
      if (mockMode) {
        console.log("Using mock login data");
        // Simulate API response with mock data
        const response = mockResponses[username] || { 
          code: 400, 
          message: "Incorrect username or password" 
        };
        
        if (response.code === 200) {
          // Login successful
          localStorage.setItem('userData', JSON.stringify(response.data));
          
          // Redirect based on user type
          if (response.data.type === 1) {
            window.location.href = 'my-account.html';
          } else if (response.data.type === 2) {
            window.location.href = 'vendor-dashboard.html';
          } else if (response.data.type === 0) {
            window.location.href = 'admin-dashboard.html';
          }
        } else {
          // Failed login
          showLoginMessage(response.message || 'Invalid username or password', 'error');
        }
      } else {
      // Send credentials to backend
      fetch('http://127.0.0.1:8080/commerce/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
    }});

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