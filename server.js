//import express
const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');


//add port designation and app expression
const PORT = process.env.PORT || 3001;
const app = express();

//add the express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to mysql database
const db = mysql.createConnection(
    {
      host: '127.0.0.1',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: '',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );


// Get all candidates
app.get('/api/candidates', (req, res) => {
  //set up query for database you want 
    const sql = `SELECT * FROM candidates`;
  
    //passing two parameters, sql query and err parameter,
    // rows is data retrieved from database
    db.query(sql, (err, rows) => {
      if (err) {
  // if error, sever sends back status 500 and chain .json method to send a message, in the method, 
  //will be the property of error and value of error.message, then empty return to stop the process
        res.status(500).json({ error: err.message });
        return;
      }
  //if error doesnt trigger, server has to send back data, passing two properties, 
  //first a message with a value of success, data property with value of rows sent by database
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// Get a single candidate
app.get('/api/candidate/:id', (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

//Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Candidate not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// Create a candidate, req.body is destructured to pull body property out of the request object,
//until now we have been passing entire request obj to the routes in req parameter
//in the callback function we assign "errors" to receive the return from input check function
//inputcheck verifies user info and must be imported from utils
app.post('/api/candidate', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name',
    'last_name',
    'industry_connected'
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }

  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?,?,?)`;
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
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
  