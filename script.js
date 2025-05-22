const app = document.getElementById('app');

// Define the content for each section
const routes = {
  home: '<h1>Welcome to Home Page</h1><p>This is the home section.</p>',
  about: '<h1>About Us</h1><p>Learn more about us here.</p>',
  contact: '<h1>Contact Us</h1><p>Get in touch via email or phone.</p>',
};

// Function to navigate between sections
function navigate(route) {
  app.innerHTML = routes[route] || '<h1>404 - Page Not Found</h1>';
}

// Load the home page content by default
navigate('home');