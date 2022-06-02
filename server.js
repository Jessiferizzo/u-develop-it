//import express
const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


//add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

//add the express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use api routes
app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
