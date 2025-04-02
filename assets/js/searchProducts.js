/**
 * Search products by tags
 * @param {string|Array} tags - Single tag string or array of tag strings
 * @returns {Promise} - Promise resolving to product data
 */
async function searchProductsByTags(tags) {
  // Convert single tag string to array or use empty array if no tags
  let tagsArray = [];
  
  if (tags) {
    if (typeof tags === 'string') {
      // Split by comma if multiple tags in a string (e.g., "fruit,organic")
      tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    } else if (Array.isArray(tags)) {
      tagsArray = tags;
    }
  }
  
  try {
    const response = await fetch('http://127.0.0.1:8080/commerce/product/getProductsByTags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tagsArray)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// Expose the function globally
window.searchProductsByTags = searchProductsByTags;