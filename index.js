const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/bfhl', (req, res) => {
    console.log('Received POST request:', req.body);
    const data = req.body.data;
    const user_id = "sumanth_siddareddy_28052004";
    const email = "sumanth_siddareddy@srmap.edu.in";
    const roll_number = "AP21110011358";
  
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        user_id,
        email,
        roll_number,
        message: 'Invalid input'
      });
    }
  
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item) && /^[a-zA-Z]$/.test(item));
    const highest_alphabet = alphabets.length > 0 ? [alphabets.sort((a, b) => b.localeCompare(a, undefined, {sensitivity: 'base'}))[0]] : [];
  
    res.json({
      is_success: true,
      user_id,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_alphabet
    });
  });

  
app.get('/bfhl', (req, res) => {
    res.json({
      operation_code: 1
    });
});

  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      is_success: false,
      message: 'Something went wrong!'
    });
});
  