
const express = require('express');
const { GoogleGenAI, Type } = require('@google/genai');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname)));


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAppDataPrompt = `
    Generate a complete JSON object for a cash crop trading app. The root object should be of type AppData.
    - Create 20 unique 'marketListings' of type 'CropListing'. Include a diverse mix of global and African cash crops. For example: Cocoa from Ghana (country: "Ghana"), Coffee from Ethiopia (country: "Ethiopia"), Cashew nuts from Ivory Coast (country: "Ivory Coast"), Nigerian Ginger (country: "Nigeria"), Tanzanian Cashews (country: "Tanzania"), Tea from Kenya (country: "Kenya"), Cotton from Egypt (country: "Egypt"), Hard Red Wheat from USA (country: "USA"), Soybeans from Brazil (country: "Brazil"), and Canola from Canada (country: "Canada"). Make prices realistic in Nigerian Naira (₦) (e.g., price per bushel or ton). Include a 'country' field for each listing.
    - For each of the 20 listings, create a corresponding 'cropDetails' entry in an array. Each object in the array should conform to the 'CropDetails' type. Populate all fields, including the 'country' field, a seller with a plausible name and rating, and detailed specifications. Use picsum.photos for image URLs. The 'id' of each detail object must match the 'id' of a market listing.
    - Create a 'userProfile' of type 'UserProfile' for a farmer named 'AJAYI OLALEKAN'. Localize all profile details to Nigeria (e.g., location: "Lagos, NG", phone with Nigerian country code, email: "ajayi.o@example.com").
    - Create a 'wallet' object with a realistic 'balance' in Naira and 6 sample 'transactions' of type 'Transaction'.
    Ensure the entire output is a single, valid JSON object that strictly adheres to the provided schema.
`;

app.get('/api/data', async (req, res) => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set on server");
        }
        
        // Made the call more robust by removing strict config and parsing text
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: getAppDataPrompt,
        });
        
        if (response.text) {
            let cleanedText = response.text.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
            } else if (cleanedText.startsWith('```')) {
                 cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
            }

            const rawData = JSON.parse(cleanedText);
            
            // Transform cropDetails array into a map
            const cropDetailsMap = rawData.cropDetails.reduce((acc, detail) => {
                acc[detail.id] = detail;
                return acc;
            }, {});

            const appData = {
                ...rawData,
                cropDetails: cropDetailsMap,
            };
            res.json(appData);
        } else {
             res.status(500).json({ error: "Failed to generate data from Gemini." });
        }
    } catch (error) {
        console.error("Error in /api/data:", error);
        res.status(500).json({ error: 'Failed to fetch data from Gemini API.', details: error.message });
    }
});

app.post('/api/analyze', async (req, res) => {
    try {
        const { crop } = req.body;
        if (!crop) {
            return res.status(400).json({ error: 'Crop data is required.' });
        }
        
        const prompt = `
            You are a senior agricultural market analyst.
            Based on the following cash crop details, provide a brief market analysis and a price trend prediction in 2-3 sentences.
            Be insightful but concise.

            Crop: ${crop.name}
            Origin: ${crop.origin}
            Asking Price: ₦${crop.price.toLocaleString('en-US')} ${crop.priceUnit}
            Specifications: ${crop.specifications.map(s => `${s.label}: ${s.value}`).join(', ')}

            Assume current global market conditions are stable with slight volatility in the agricultural sector due to weather uncertainties. The currency is Nigerian Naira (₦).
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        res.json({ analysis: response.text });

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        res.status(500).json({ error: 'Failed to get analysis from Gemini API.' });
    }
});

app.post('/api/suggest', async (req, res) => {
    try {
        const { crop } = req.body;
        if (!crop) {
            return res.status(400).json({ error: 'Crop data is required.' });
        }

        const prompt = `
            Given that ${crop.name} has an asking price of ₦${crop.price.toLocaleString('en-US')} ${crop.priceUnit}, suggest a competitive but fair counter-offer price per unit in Nigerian Naira (₦).
            Consider that a slight negotiation is standard in this market. The suggested price should be slightly lower than the asking price but not insultingly low.
            Output only the numeric value for the price.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedPrice: { type: Type.NUMBER },
                    },
                    required: ["suggestedPrice"],
                },
            },
        });
        
        if (response.text) {
            res.json(JSON.parse(response.text));
        } else {
            res.status(500).json({ error: "Failed to generate suggestion from Gemini." });
        }

    } catch (error) {
        console.error("Error in /api/suggest:", error);
        res.status(500).json({ error: 'Failed to get suggestion from Gemini API.' });
    }
});

// Catch-all to serve index.html for any other request (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
