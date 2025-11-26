const welcomeTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to H Store, ${name}! 🎉</h2>
      <p>Thank you for registering with H Store.</p>
      <a href="https://yourfrontendurl.com">Visit H Store</a>
    </div>
  `;
};

module.exports = welcomeTemplate;
