const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const BASE_API_URL = 'https://de1.api.radio-browser.info/json'; 

// Get all genres
app.get('/api/genres', async (req, res) => {
  try {

    const response = await axios.get(`${BASE_API_URL}/tags`);
    const genres = response.data.map(tag => tag.name).filter(tag => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// Get radio stations
app.get('/api/radios/:term', async (req, res) => {
  const term = req.params.term || '';
  try {
    
    if (term === '') {
      console.log("Term is empty - from server")
      const response = await axios.get(`${BASE_API_URL}/tags`);
      const genres = response.data
        .map(tag => tag.name)
        .filter(tag => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
      return res.json(genres);  
    }

    // fetch by country
    else if (/^[A-Z][a-z]*$/.test(term)) {
      const response = await axios.get(`${BASE_API_URL}/stations/bycountry/${term}`);
      const httpsStations = response.data.filter(station => 
        station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
      );

      if (httpsStations.length === 0) {
        return res.json([]);
      } else {
        return res.json(httpsStations); 
      }
    }

    // fetch by tag
    else {
      const response = await axios.get(`${BASE_API_URL}/stations/bytag/${term}`);
      const httpsStations = response.data.filter(station => 
        station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
      );

      if (httpsStations.length === 0) {
        return res.json([]);  
      } else {
        return res.json(httpsStations); 
      }
    }
  } catch (error) {
    
    res.status(500).json({ error: `Error fetching radios for: ${term}` });
  }
});


// audio-recognition request
app.post('/api/identify-song', async (req, res) => {
  console.log(req.body);
  const { streamUrl } = req.body;

  try {
      
      const response = await axios.post('http://localhost:5001/identify', { streamUrl });

      
      res.json(response.data);
  } catch (error) {
      console.error("Error in identify-song route:", error);
      res.status(500).json({ error: "Failed to identify song" });
  }
});



app.listen(5000, () => {
  console.log('Backend server is running on port 5000');
});
