const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Enable CORS for the frontend
app.use(express.json());

const BASE_API_URL = 'https://de1.api.radio-browser.info/json'; // Radio Browser API base URL

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

// Get radio stations by search term
app.get('/api/radios/:term', async (req, res) => {
  const term = req.params.term || '';
  try {
    // If term is empty, fetch genres
    if (term === '') {
      console.log("Term is empty - from server")
      const response = await axios.get(`${BASE_API_URL}/tags`);
      const genres = response.data
        .map(tag => tag.name)
        .filter(tag => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
      return res.json(genres);  // Return after sending the response
    }

    // If term matches a country format, fetch stations by country
    else if (/^[A-Z][a-z]*$/.test(term)) {
      const response = await axios.get(`${BASE_API_URL}/stations/bycountry/${term}`);
      const httpsStations = response.data.filter(station => 
        station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
      );

      if (httpsStations.length === 0) {
        return res.json([]);
      } else {
        return res.json(httpsStations);  // Return here with stations if available
      }
    }

    // If term does not match country format, treat it as a tag and fetch by tag
    else {
      const response = await axios.get(`${BASE_API_URL}/stations/bytag/${term}`);
      const httpsStations = response.data.filter(station => 
        station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
      );

      if (httpsStations.length === 0) {
        return res.json([]);  // Return here
      } else {
        return res.json(httpsStations);  // Return here with stations if available
      }
    }
  } catch (error) {
    // If an error occurs, send a 500 response
    res.status(500).json({ error: `Error fetching radios for: ${term}` });
  }
});

app.post('/api/identify-song', async (req, res) => {
  console.log(req.body);
  const { streamUrl } = req.body;

  try {
      // Forward the stream URL to the audio-recognition service
      const response = await axios.post('http://localhost:5001/identify', { streamUrl });

      // Send back the response from the audio-recognition service
      res.json(response.data);
  } catch (error) {
      console.error("Error in identify-song route:", error);
      res.status(500).json({ error: "Failed to identify song" });
  }
});



// Server listening on port 5000
app.listen(5000, () => {
  console.log('Backend server is running on port 5000');
});
