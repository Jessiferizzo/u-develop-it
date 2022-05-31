//import express
const express = require('express');

//add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

//add the express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());






//get test route
app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

//start express as port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  