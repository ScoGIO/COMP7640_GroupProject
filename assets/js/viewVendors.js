/**
 * Load vendors from backend and display in the vendor list dropdown
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find the vendor list element
    const vendorList = document.getElementById('vendorList');
    
    if (!vendorList) return;
    
    // Fetch the vendors data
    fetch('./api/vendors.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Clear loading message
        vendorList.innerHTML = '';
        
        // Check if vendors exist in the response
        if (data && data.vendors && Array.isArray(data.vendors)) {
          // Loop through each vendor and create a menu item
          data.vendors.forEach(vendor => {
            const listItem = document.createElement('li');
            listItem.className = 'menu-item';
            
            const link = document.createElement('a');
            link.className = 'menu-item-title';
            link.href = `shop.html?vendor=${vendor.vendor_ID}`;
            link.textContent = vendor.vendor_name;
            
            // Optional: Add vendor rating/location as small text
            const ratingSpan = document.createElement('small');
            ratingSpan.textContent = ` (${vendor.customer_feedback_score}★)`;
            ratingSpan.style.marginLeft = '5px';
            ratingSpan.style.fontSize = '0.8em';
            
            link.appendChild(ratingSpan);
            listItem.appendChild(link);
            vendorList.appendChild(listItem);
          });
        } else {
          // No vendors found
          const noVendors = document.createElement('li');
          noVendors.className = 'menu-item';
          noVendors.textContent = 'No vendors available';
          vendorList.appendChild(noVendors);
        }
      })
      .catch(error => {
        console.error('Error fetching vendors:', error);
        vendorList.innerHTML = '<li class="menu-item">Error loading vendors</li>';
      });
  });