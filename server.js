//import express
const express = require('express');
const mysql = require('mysql2');

//add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

//add the express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to mysql database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );






// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

//start express as port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  