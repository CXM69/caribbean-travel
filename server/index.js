require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));

const PORT = process.env.PORT || 5050;

// Test route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Flight search route
app.get('/search-flights', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!origin || !destination || !date) {
      return res
        .status(400)
        .json({ error: 'Origin, destination, and date are required.' });
    }

    if (!rapidApiKey) {
      return res.status(500).json({ error: 'Server is missing RAPIDAPI_KEY.' });
    }

    const response = await axios.get(
      'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
      {
        params: {
          originSkyId: origin,
          destinationSkyId: destination,
          date,
          adults: 1,
          currency: 'USD',
          countryCode: 'US',
          market: 'en-US',
        },
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com',
        },
        timeout: 15000,
      }
    );

    const results = response.data?.data?.itineraries || [];

    // Normalize results
    const formatted = results.map((f) => ({
      price: f.price?.formatted,
      departure: f.legs[0]?.departure,
      arrival: f.legs[0]?.arrival,
      airline: f.legs[0]?.carriers?.marketing[0]?.name,
      deeplink: f.deeplink || null,
    }));

    res.json(formatted);
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Flight API failed.';

    console.error('Flight search failed:', message);
    res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
