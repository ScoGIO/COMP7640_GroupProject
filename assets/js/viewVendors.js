/**
 * Load vendors from backend and display in the vendor list dropdown
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find the vendor list element
    
    // Fetch the vendors data
    fetch(CONFIG.SERVER_URL + 'vendor/getAllVendorsAndProducts', {
        method: 'GET',})
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Clear loading message
        vendorList.innerHTML = '';
        console.log('Vendors data:', data);
        // Check if vendors exist in the response
        if (data && data.data.vendors && Array.isArray(data.data.vendors)) {
          // Loop through each vendor and create a menu item
          data.data.vendors.forEach(vendor => {
            const listItem = document.createElement('li');
            listItem.className = 'menu-item';
            
            const link = document.createElement('a');
            link.className = 'menu-item-title';
            link.href = `shop.html?vendor=${vendor.vendorID}`;
            link.textContent = vendor.vendorName;
            
            // Optional: Add vendor rating/location as small text
            const ratingSpan = document.createElement('small');
            ratingSpan.textContent = ` (${vendor.customerFeedbackScore}★)`;
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
        
        // Add hover behavior for dropdown menu
        setupVendorDropdownHoverBehavior();
      })
      .catch(error => {
        console.error('Error fetching vendors:', error);
        vendorList.innerHTML = '<li class="menu-item">Error loading vendors</li>';
        
        // Still setup hover behavior even if fetch fails
        setupVendorDropdownHoverBehavior();
      });
      
    // Function to set up hover behavior for the vendor dropdown
    function setupVendorDropdownHoverBehavior() {
      const verticalMenu = document.querySelector('.vertical-menu');
      const menuBtn = document.querySelector('.vertical-menu .menu-btn');
      const vmenuContent = document.querySelector('.vmenu-content');
      
      if (!verticalMenu || !menuBtn || !vmenuContent) return;
      
      // Show dropdown on button hover
      menuBtn.addEventListener('mouseover', function() {
        vmenuContent.classList.remove('vmenu-content-none');
      });
      
      // Show dropdown on menu content hover
      vmenuContent.addEventListener('mouseover', function() {
        vmenuContent.classList.remove('vmenu-content-none');
      });
      
      // Hide dropdown when mouse leaves the entire menu area
      verticalMenu.addEventListener('mouseleave', function() {
        vmenuContent.classList.add('vmenu-content-none');
      });
      
      // Make dropdown initially visible when button is clicked
      menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        vmenuContent.classList.toggle('vmenu-content-none');
      });
    }
  });