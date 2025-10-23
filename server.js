// server.js - FINAL VERSION (No Body-Parser, Express Built-in Middleware)

const express = require('express');
const path = require('path');
const fs = require('fs'); 

const app = express();
const PORT = 4000;

// Directories
const LOG_FILE = path.join(__dirname, 'logs', 'submissions.log');
const PUBLIC_DIR = path.join(__dirname, 'public'); 


// --- Helper function to save data to a file ---
function logSubmission(data) {
    const timestamp = new Date().toISOString();
    const submissionId = Date.now(); 
    
    // Log entry format
    const logEntry = `[${timestamp}] - Submission ID: ${submissionId}\n` + 
                     `Name: ${data.name}\n` +
                     `Email: ${data.email}\n` +
                     `Service: ${data.service}\n` +
                     `Message: ${data.message.substring(0, 200)}...\n` +
                     `--------------------------------------------------\n`;
    
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        } else {
            console.log(`✅ Submission logged successfully. ID: ${submissionId}`);
        }
    });
}

// --- Middleware Setup ---
// 1. Static files (HTML, CSS, JS) ko 'public' folder se serve karein.
app.use(express.static(PUBLIC_DIR)); 
// 2. Form data ko URL-encoded format mein parse karna (express.urlencoded for fetch)
app.use(express.urlencoded({ extended: true })); 
// 3. JSON data ko parse karna 
app.use(express.json()); 


// --- Routes ---

// GET Route: Main Form Page
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// POST Route: Form Submission Handling
app.post('/submit-collaboration-form', (req, res) => {
    const formData = req.body;
    
    // 1. Form data ko log file mein save karo
    logSubmission(formData);

    // 2. Frontend JS ko success response bhejenge. (Status 200 OK)
    res.status(200).send({ message: "Success! Data logged." });
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`\n🚀 Server is Active!`);
    console.log(`🌐 Application running on: http://localhost:${PORT}`);
    console.log(`📥 Submissions will be logged in: ${path.basename(LOG_FILE)}\n`);
});