const express = require('express');
const isBase64 = require('is-base64');
const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

app.post('/bfhl', (req, res) => {
    try {
        const { data, file_b64, full_name, dob, email, roll_number } = req.body;

        // Validate input fields (data, full_name, dob, email, roll_number)
        if (!data || !full_name || !dob || !email || !roll_number) {
            return res.status(400).json({
                is_success: false,
                message: 'Missing required fields: data, full_name, dob, email, roll_number'
            });
        }

        // Generate user_id from full_name and dob
        const formattedName = full_name.toLowerCase().replace(/\s+/g, '_');
        const user_id = `${formattedName}_${dob.replace(/-/g, '')}`; // Assuming DOB format YYYY-MM-DD

        // Separate numbers and alphabets from 'data'
        const numbers = data.filter(item => !isNaN(item)); // Will return numeric strings
        const alphabets = data.filter(item => isNaN(item)); // Will return non-numeric strings

        // Find the highest lowercase alphabet in 'alphabets'
        const lowercaseAlphabets = alphabets.filter(item => /^[a-z]+$/.test(item));
        const highestLowercaseAlphabet = lowercaseAlphabets.length
            ? [lowercaseAlphabets.sort().pop()]
            : [];

        // File Handling
        let file_valid = false;
        let file_mime_type = null;
        let file_size_kb = null;

        if (file_b64) {
            // Check if the Base64 string is valid, allowing MIME type in the string
            if (isBase64(file_b64, { allowMime: true })) {
                const mimeTypeRegex = /^data:(.*);base64/;
                const match = file_b64.match(mimeTypeRegex);

                if (match) {
                    file_mime_type = match[1]; // Extract MIME type
                    const base64Data = file_b64.split(',')[1]; // Separate Base64 data
                    const fileBuffer = Buffer.from(base64Data, 'base64');
                    file_size_kb = (fileBuffer.length / 1024).toFixed(2); // Convert bytes to KB

                    file_valid = true;
                }
            }
        }

        // Response
        res.status(200).json({
            is_success: true,
            user_id: user_id,
            email: email,
            roll_number: roll_number,
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet,
            file_valid: file_valid,
            file_mime_type: file_mime_type,
            file_size_kb: file_size_kb
        });
    } catch (error) {
        // Catch unexpected errors
        res.status(500).json({
            is_success: false,
            message: 'An error occurred while processing the request',
            error: error.message
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        "operation_code": 1
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = (req, res) => {
    res.status(200).json({ message: "API is working!" });
  };
  