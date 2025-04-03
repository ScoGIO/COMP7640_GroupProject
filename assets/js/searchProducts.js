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
  console.log('Tags array:', tagsArray);
  
  try {
    // FIXED: Use proper query parameters for GET request instead of body
    const queryParams = new URLSearchParams();
    tagsArray.forEach(tag => queryParams.append('tag', tag));
    
    const response = await fetch(`${CONFIG.SERVER_URL}product/getProductsByTags?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: JSON.stringify({  tagsArray }) // Send as JSON body if needed by backend
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