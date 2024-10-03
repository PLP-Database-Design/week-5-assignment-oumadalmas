// Import dependencies
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
    if (err) {
        return console.log('Error connecting to the database: ' + err);
    }
    console.log('Successfully connected to MySQL: ', db.threadId);
});

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// QUESTION 1. RETRIEVE ALL PATIENTS
app.get('/patients', (req, res) => {
    // SQL query to retrieve all patients
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching patients: ', err);
            return res.status(500).json({ error: 'Failed to retrieve patients' });
        }

        res.json(results); // Return the list of patients as JSON
    });
});

// QUESTION 2. RETRIEVE ALL PROVIDERS
app.get('/providers', (req, res) => {
    // SQL query to retrieve all providers
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching providers: ', err);
            return res.status(500).json({ error: 'Failed to retrieve providers' });
        }

        res.json(results); // Return the list of providers as JSON
    });
});

// QUESTION 3. FILTER PATIENTS BY FIRST NAME
app.get('/patients/filter', (req, res) => {
    const { first_name } = req.query; // Get the first_name from the query params

    // SQL query to filter patients by their first name
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

    db.query(query, [first_name], (err, results) => {
        if (err) {
            console.error('Error fetching patients: ', err);
            return res.status(500).json({ error: 'Failed to retrieve patients' });
        }

        // If no patients are found, return a 404
        if (results.length === 0) {
            return res.status(404).json({ message: `No patients found with first name: ${first_name}` });
        }

        res.json(results); // Return the filtered list of patients
    });
});

// QUESTION 4. RETRIEVE ALL PROVIDERS BY THEIR SPECIALTY
app.get('/providers/filter', (req, res) => {
    const { provider_specialty } = req.query; // Get the provider_specialty from the query params

    // SQL query to filter providers by their specialty
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

    db.query(query, [provider_specialty], (err, results) => {
        if (err) {
            console.error('Error fetching providers: ', err);
            return res.status(500).json({ error: 'Failed to retrieve providers' });
        }

        // If no providers are found, return a 404
        if (results.length === 0) {
            return res.status(404).json({ message: `No providers found with specialty: ${provider_specialty}` });
        }

        res.json(results); // Return the filtered list of providers
    });
});

// Start and listen on port 3300
app.listen(3300, () => {
    console.log('Server is running on port 3300...');
});

