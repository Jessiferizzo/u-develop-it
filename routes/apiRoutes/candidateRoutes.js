const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all candidates
router.get('/candidates', (req, res) => {
    //set up query for database you want 
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`;
    
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
  
  // Get a single candidate with party affiliation 
  router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id 
               WHERE candidates.id = ?`;
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
  
  
  // Create a candidate, req.body is destructured to pull body property out of the request object,
  //until now we have been passing entire request obj to the routes in req parameter
  //in the callback function we assign "errors" to receive the return from input check function
  //inputcheck verifies user info and must be imported from utils
  // Create a candidate
  router.post('/candidate', ({ body }, res) => {
    // Candidate is allowed not to be affiliated with a party
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
  
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected, party_id) VALUES (?,?,?,?)`;
    const params = [
      body.first_name,
      body.last_name,
      body.industry_connected,
      body.party_id
    ];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body,
        changes: result.affectedRows
      });
    });
  });
  
  // Update a candidate's party
  router.put('/candidate/:id', (req, res) => {
    // Candidate is allowed to not have party affiliation
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
  
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        // check if a record was found
      } else if (!result.affectedRows) {
        res.json({
          message: 'Candidate not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });
  
    //Delete a candidate
    router.delete('/candidate/:id', (req, res) => {
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

    module.exports = router;