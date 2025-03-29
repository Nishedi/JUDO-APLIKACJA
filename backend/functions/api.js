const express = require('express');
const serverless = require('serverless-http');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Zezwala na CORS ze wszystkich domen
app.use(express.json()); // Parsowanie JSON

const router = express.Router();

// Endpoint testowy
router.get('/', (req, res) => {
    res.send('App is running.. xd');
});

// Endpoint do wysyłania SMS
router.post('/send-sms', async (req, res) => {
    try {
        const smsParams = req.body; // Pobieranie danych z frontendu
        console.log("Otrzymane params:", smsParams);

        // Wysyłanie żądania do API SMSPlanet
        const response = await axios.get('https://api2.smsplanet.pl/sms', {
            params: smsParams,
            headers: {
                Authorization: `Bearer sW578FWEa29075d740204f68bbf397489c569ab2`,
                Accept: 'application/json'
            }
        });

        console.log("Odpowiedź API SMSPlanet:", response.data);

        res.status(200).json({
            message: "SMS wysłany!",
            receivedParams: smsParams,
            smsResponse: response.data
        });

    } catch (error) {
        console.error("Błąd wysyłania SMS:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.message,
            details: error.response?.data || null
        });
    }
});

// Ustawienie ścieżki Netlify Functions
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
