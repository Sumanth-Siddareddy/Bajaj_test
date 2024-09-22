import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [responseData, setResponseData] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' }
  ];

  const validateJson = (input) => {
    try {
      JSON.parse(input);
      setIsValidJson(true);
      return true;
    } catch (e) {
      setIsValidJson(false);
      return false;
    }
  };

  const handleJsonInput = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    if (validateJson(jsonInput)) {
      const parsedInput = JSON.parse(jsonInput);
      try {
        const response = await axios.post('http://localhost:3000/bfhl', parsedInput);
        setResponseData(response.data);
        setFilteredResponse(response.data); // Initially set full response
      } catch (error) {
        console.error('Error fetching API:', error);
      }
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setFilterOptions(selectedOptions);

    if (responseData) {
      const filtered = {};
      selectedOptions.forEach(option => {
        filtered[option.value] = responseData[option.value];
      });
      setFilteredResponse(filtered);
    }
  };

  return (
    <div className="App">
      <h1>{responseData ? responseData.roll_number : 'Your Roll Number'}</h1>

      <div>
        <textarea
          placeholder='Enter valid JSON (e.g., {"data": ["A", "B", "1"]})'
          value={jsonInput}
          onChange={handleJsonInput}
        />
        {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format</p>}
        <button onClick={handleSubmit}>Submit</button>
      </div>

      {responseData && (
        <div>
          <h3>Multi Filter</h3>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
          />
        </div>
      )}

      {filteredResponse && (
        <div>
          <h3>Filtered Response</h3>
          {filterOptions.length === 0 ? (
            <p>Select filters to view data</p>
          ) : (
            Object.keys(filteredResponse).map(key => (
              <p key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${filteredResponse[key].join(', ')}`}</p>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
