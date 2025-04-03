document.addEventListener('DOMContentLoaded', function() {
  const productContainer = document.querySelector('#column-three .row');
  if (!productContainer) return;

  // Clear any existing product items
  productContainer.innerHTML = '';

  // Track all products for sorting
  let allProducts = [];
  let currentSortOrder = 'name_asc'; // Default sort
  
  // Function to get URL parameters (for vendor filtering and search)
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  // Get vendor ID and tags from URL if present
  const vendorId = getUrlParameter('vendor');
  const searchTags = getUrlParameter('tags');
  
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
        sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default to name ascending
        sortedProducts.sort((a, b) => a.productName.localeCompare(b.productName));
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

  // Function to create HTML for a product
  function createProductHtml(product) {
    // Format tags as a string
    const tagsString = product.tagsList ? product.tagsList.join(', ') : '';
    
    return `
      <div class="col-lg-12">
        <!-- Start Product Item -->
        <div class="product-list-item">
          <div class="row" style="width: 1500px;">
            <div class="col-md-8">
              <div class="product-info">
                <h3 class="title" style="font-size: 25px;"><a href="shop-single-product.html?id=${product.productId}">${product.productName}</a></h3>
                <div class="prices">
                  <span class="price">$${product.price.toFixed(2)}</span>
                </div>
                <p>Inventory: ${product.inventory}${product.inventory > 99 ? '+' : ''}<br>
                  Vendor: ${product.vendor ? product.vendor.vendorName : 'Unknown'}<br>
                  Tags: ${tagsString}</p>
                <div class="content-inner">
                  <a class="btn-theme add-to-cart" data-product-id="${product.productId}" href="javascript:void(0);"> Add to cart</a>
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
        const product = allProducts.find(p => p.productId == productId);
        
        if (product) {
          // Use the addToCart function from cart.js
          window.addToCart({
            id: product.productId,
            name: product.productName,
            price: product.price
          });
        }
      });
    });
  }

  // Load products based on search criteria or load all
  if (searchTags) {
    // Show loading indicator
    productContainer.innerHTML = '<div class="col-12 text-center"><p>Loading search results...</p></div>';
    
    // Split tags by comma if multiple tags are provided
    const tagsArray = searchTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    fetch(CONFIG.SERVER_URL + 'product/getProductsByTags', {
      method: 'Post',  
      headers: {
        'Content-Type': 'application/json',  // 声明我们发送的是 JSON 数据
        'Accept': 'application/json'
      },
      body: JSON.stringify(tagsArray)  
    })
    .then(response => {
      if (!response.ok) {
        console.log(tagsArray);
        console.log(JSON.stringify({ tags: tagsArray }));
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.code === 200 && data.data) {
        allProducts = data.data;
        
        // Filter by vendor if vendor ID is specified
        if (vendorId) {
          allProducts = allProducts.filter(product => 
            product.vendorId === parseInt(vendorId));
        }
        
        // Sort and display products
        displayProducts(sortProducts(allProducts, currentSortOrder));
      } else {
        throw new Error(data.message || 'Error fetching products');
      }
    })
    .catch(error => {
      console.error('Error searching products:', error);
      productContainer.innerHTML = `<div class="col-12"><p>Error loading search results: ${error.message}</p></div>`;
    });
  } else {
    // If no search tags, load all vendors and their products
    fetch(CONFIG.SERVER_URL + 'vendor/getAllVendorsAndProducts')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.code === 200 && data.data && data.data.vendors) {
          // Extract all products from all vendors
          let products = [];
          data.data.vendors.forEach(vendor => {
            if (vendor.products) {
              // Add vendor info to each product
              const vendorProducts = vendor.products.map(product => ({
                ...product,
                vendor: {
                  vendorID: vendor.vendorID,
                  vendorName: vendor.vendorName
                }
              }));
              products = products.concat(vendorProducts);
            }
          });
          
          allProducts = products;
          
          // Filter by vendor if vendor ID is specified
          if (vendorId) {
            allProducts = allProducts.filter(product => 
              product.vendorId === parseInt(vendorId));
          }

          // Sort and display products
          displayProducts(sortProducts(allProducts, currentSortOrder));
        } else {
          throw new Error(data.message || 'Error fetching products');
        }
      })
      .catch(error => {
        console.error('Error loading products:', error);
        productContainer.innerHTML = `<div class="col-12"><p>Error loading products: ${error.message}</p></div>`;
      });
  }
});