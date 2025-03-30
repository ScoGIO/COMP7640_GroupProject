// Example fix for load-header.js
fetch('components/header.html')
  .then(response => response.text())
  .then(data => {
    // Insert the HTML
    document.getElementById('header-container').innerHTML = data;
    
    // Handle scripts if needed (this is complex, generally better to avoid)
    const scriptTags = document.getElementById('header-container').querySelectorAll('script');
    scriptTags.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => 
        newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  });