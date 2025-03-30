document.addEventListener('DOMContentLoaded', function() {
  const productContainer = document.querySelector('#column-three .row');
  if (!productContainer) return;

  // Clear any existing product items
  productContainer.innerHTML = '';

  // Track all products for sorting
  let allProducts = [];
  let currentSortOrder = 'name_asc'; // Default sort
  
  // Function to get URL parameters (for vendor filtering)
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Get vendor ID from URL if present
  const vendorId = getUrlParameter('vendor');
  
  // Setup sorting dropdown event listener
  const sortingDropdown = document.getElementById('productSorting');
  if (sortingDropdown) {
    sortingDropdown.addEventListener('change', function() {
      currentSortOrder = this.value;
      displayProducts(sortProducts(allProducts, currentSortOrder));
    });
  }

  // Function to sort products based on sort order
  function sortProducts(products, sortOrder) {
    const sortedProducts = [...products]; // Create a copy to avoid modifying original
    
    switch(sortOrder) {
      case 'name_asc':
        sortedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default to name ascending
        sortedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
    }
    
    return sortedProducts;
  }

  // Function to display products in the container
  function displayProducts(products) {
    // Clear container
    productContainer.innerHTML = '';
    
    // Update product count display
    const countDisplay = document.querySelector('.count-result');
    if (countDisplay) {
      countDisplay.textContent = `There are ${products.length} products.`;
    }
    
    if (products.length === 0) {
      productContainer.innerHTML = '<div class="col-12"><p>No products found.</p></div>';
      return;
    }
    
    // Create HTML for each product
    products.forEach(product => {
      const productHtml = createProductHtml(product);
      productContainer.insertAdjacentHTML('beforeend', productHtml);
    });
    
    // Add event listeners to "Add to cart" buttons
    addCartButtonListeners();
  }

  // Fetch products from JSON file
  fetch('./api/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Filter products by vendor if vendor ID is specified
      allProducts = data.products;
      if (vendorId) {
        allProducts = allProducts.filter(product => 
          product.vendor_ID === parseInt(vendorId));
      }

      // Sort and display products
      displayProducts(sortProducts(allProducts, currentSortOrder));
    })
    .catch(error => {
      console.error('Error loading products:', error);
      productContainer.innerHTML = '<div class="col-12"><p>Error loading products. Please try again later.</p></div>';
    });
  
  // Function to create HTML for a product - KEEPING ORIGINAL STYLE
  function createProductHtml(product) {
    // Format tags as a string
    const tagsString = product.tags.join(', ');
    
    return `
      <div class="col-lg-12">
        <!-- Start Product Item -->
        <div class="product-list-item">
          <div class="row" style="width: 1500px;">
            <div class="col-md-8">
              <div class="product-info">
                <h3 class="title" style="font-size: 25px;"><a href="shop-single-product.html?id=${product.product_ID}">${product.product_name}</a></h3>
                <div class="prices">
                  <span class="price">$${product.price.toFixed(2)}</span>
                </div>
                <p>Inventory: ${product.inventory}${product.inventory > 99 ? '+' : ''}<br>
                  tags: ${tagsString}</p>
                <div class="content-inner">
                  <a class="btn-theme add-to-cart" data-product-id="${product.product_ID}" href="javascript:void(0);"> Add to cart</a>
                  <div class="product-info-action">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End Product Item -->
      </div>
    `;
  }
  
  // Function to add event listeners to cart buttons
  function addCartButtonListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        console.log(`Adding product ID ${productId} to cart`);
        // Here you would add code to actually add to cart
        // Show success message
        alert('Product added to cart!');
      });
    });
  }
});