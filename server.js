const express = require('express');
const html_routes = require('./html-routes.js');
const api_routes = require('./api-routes.js');
const PORT = process.env.PORT || 3000;
// dynamically set the port
const app = express();

// Express middleware will always run the operation
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(html_routes);
app.use(api_routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

