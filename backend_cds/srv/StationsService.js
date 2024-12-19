const axios = require('axios');
const BASE_API_URL = 'https://de1.api.radio-browser.info/json';




module.exports = async function StationsService() {
    const db = await cds.connect.to('db');
    const {User, Stations, SavedStations} = db.entities;
    this.on('getGenres', async (req) => {
        try {

            const response = await axios.get(`${BASE_API_URL}/tags`);
            const genres = response.data.map(tag => tag.name).filter(tag => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
            return genres;
        } catch (error) {
            req.reject(error);
        }

    });
    this.on('getStations', async (req) => {
        const term = req.data.genre || '';
        
        try {

            if (term === '') {
                console.log("Term is empty - from server")
                const response = await axios.get(`${BASE_API_URL}/tags`);
                const genres = response.data
                    .map(tag => tag.name)
                    .filter(tag => /^(?=.*[A-Za-z])[A-Za-z ]{4,}$/.test(tag));
                return genres;
            }

            // fetch by country
            else if (/^[A-Z][a-z]*$/.test(term)) {
                const response = await axios.get(`${BASE_API_URL}/stations/bycountry/${term}`);
                const httpsStations = response.data.filter(station =>
                    station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
                );

                if (httpsStations.length === 0) {
                    return [];
                } else {
                    return httpsStations;
                }
            }

            // fetch by tag
            else {
                const response = await axios.get(`${BASE_API_URL}/stations/bytag/${term}`);
                const httpsStations = response.data.filter(station =>
                    station.url_resolved && station.url_resolved.toLowerCase().startsWith('https')
                );

                if (httpsStations.length === 0) {
                    return [];
                } else {
                    return httpsStations;
                }
            }
        } catch (error) {

            req.reject(`Error fetching radios for: ${term}`);
        }
    });
    

    

}