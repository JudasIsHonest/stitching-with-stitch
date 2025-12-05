import { GoogleGenAI, Type } from "@google/genai";
import { AppData, CropDetails } from '../types';

const fetchAppData = async (): Promise<AppData | null> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `
                Generate a complete JSON object for a cash crop trading app. The root object should be of type AppData.
                - Create 20 unique 'marketListings' of type 'CropListing'. Include a diverse mix of global and African cash crops. For example: Cocoa from Ghana (country: "Ghana"), Coffee from Ethiopia (country: "Ethiopia"), Cashew nuts from Ivory Coast (country: "Ivory Coast"), Nigerian Ginger (country: "Nigeria"), Tanzanian Cashews (country: "Tanzania"), Tea from Kenya (country: "Kenya"), Cotton from Egypt (country: "Egypt"), Hard Red Wheat from USA (country: "USA"), Soybeans from Brazil (country: "Brazil"), and Canola from Canada (country: "Canada"). Make prices realistic in Nigerian Naira (₦) (e.g., price per bushel or ton). Include a 'country' field for each listing.
                - For each of the 20 listings, create a corresponding 'cropDetails' entry. The key should be the listing's id. Populate all fields of 'CropDetails', including the 'country' field, a seller with a plausible name and rating, and detailed specifications. Use picsum.photos for image URLs.
                - Create a 'userProfile' of type 'UserProfile' for a farmer named Jordan Campbell.
                - Create a 'wallet' object with a realistic 'balance' in Naira and 6 sample 'transactions' of type 'Transaction'.
                Ensure the entire output is a single, valid JSON object that strictly adheres to the provided schema.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        marketListings: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    farm: { type: Type.STRING },
                                    region: { type: Type.STRING },
                                    country: { type: Type.STRING },
                                    postedTime: { type: Type.STRING },
                                    price: { type: Type.NUMBER },
                                    priceUnit: { type: Type.STRING },
                                    priceChange: { type: Type.NUMBER },
                                    image: { type: Type.STRING },
                                    grade: { type: Type.STRING },
                                },
                            },
                        },
                        cropDetails: {
                            type: Type.OBJECT,
                        },
                        userProfile: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                title: { type: Type.STRING },
                                avatar: { type: Type.STRING },
                                email: { type: Type.STRING },
                                phone: { type: Type.STRING },
                                location: { type: Type.STRING },
                                farm: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        reg: { type: Type.STRING },
                                        crops: { type: Type.STRING },
                                    },
                                },
                            },
                        },
                        wallet: {
                            type: Type.OBJECT,
                            properties: {
                                balance: { type: Type.NUMBER },
                                transactions: {
                                    type: Type.ARRAY,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            id: { type: Type.STRING },
                                            type: { type: Type.STRING },
                                            title: { type: Type.STRING },
                                            date: { type: Type.STRING },
                                            amount: { type: Type.NUMBER },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        
        if (response.text) {
             return JSON.parse(response.text) as AppData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching app data from Gemini:", error);
        return getFallbackData();
    }
};

const getFallbackData = (): AppData => {
    return {
        marketListings: [
            { id: "1", name: "Hard Red Wheat", farm: "Green Acres Farm", region: "Midwest", country: "USA", postedTime: "2h ago", price: 12500, priceUnit: "/ bushel", priceChange: 2.5, image: "https://picsum.photos/seed/wheat/200", grade: "Grade 1" },
            { id: "2", name: "Forastero Cocoa Beans", farm: "Ashanti Gold Farms", region: "Ashanti", country: "Ghana", postedTime: "3h ago", price: 4500000, priceUnit: "/ ton", priceChange: 5.1, image: "https://picsum.photos/seed/cocoa/200", grade: "Grade A" },
            { id: "3", name: "Soybeans", farm: "Valley Organics", region: "Southeast", country: "Brazil", postedTime: "5h ago", price: 20000, priceUnit: "/ bushel", priceChange: -1.2, image: "https://picsum.photos/seed/soy/200", grade: "Grade 2" },
            { id: "4", name: "Arabica Coffee Beans", farm: "Yirgacheffe Union", region: "Yirgacheffe", country: "Ethiopia", postedTime: "8h ago", price: 7000, priceUnit: "/ lb", priceChange: -0.5, image: "https://picsum.photos/seed/coffee/200", grade: "Specialty Grade" },
            { id: "5", name: "Nigerian Ginger", farm: "Kaduna Spice Co.", region: "Kaduna", country: "Nigeria", postedTime: "1d ago", price: 850000, priceUnit: "/ ton", priceChange: 3.2, image: "https://picsum.photos/seed/ginger/200", grade: "Grade A" },
            { id: "6", name: "Tanzanian Cashews", farm: "Mtwara Groves", region: "Mtwara", country: "Tanzania", postedTime: "1d ago", price: 2300000, priceUnit: "/ ton", priceChange: 1.8, image: "https://picsum.photos/seed/cashew/200", grade: "W320" },
            { id: "7", name: "Kenyan Tea", farm: "Kericho Highlands", region: "Kericho", country: "Kenya", postedTime: "2d ago", price: 3500, priceUnit: "/ kg", priceChange: 0.8, image: "https://picsum.photos/seed/tea/200", grade: "BP1" },
            { id: "8", name: "Egyptian Cotton", farm: "Nile Delta Textiles", region: "Nile Delta", country: "Egypt", postedTime: "2d ago", price: 1500, priceUnit: "/ lb", priceChange: -2.1, image: "https://picsum.photos/seed/cotton/200", grade: "Giza 87" },

        ],
        cropDetails: {
            "1": {
                id: "1", name: "Hard Red Wheat", farm: "Green Acres Farm", region: "Midwest", country: "USA", postedTime: "2h ago", price: 12500, priceUnit: "/ bushel", priceChange: 2.5, image: "https://picsum.photos/seed/wheat/800", grade: "Grade 1",
                origin: "From Kansas, USA", available: "5000 bushels available", images: ["https://picsum.photos/seed/wheat/800"],
                seller: { name: "Johnathan Miller", avatar: "https://picsum.photos/seed/seller1/200", rating: 4.5, reviews: 34 },
                specifications: [{ label: "Moisture", value: "13.5%" }, { label: "Protein", value: "12.5%" }],
                description: "High-quality hard red winter wheat, perfect for baking and milling. Harvested this season."
            },
            "2": {
                id: "2", name: "Forastero Cocoa Beans", farm: "Ashanti Gold Farms", region: "Ashanti", country: "Ghana", postedTime: "3h ago", price: 4500000, priceUnit: "/ ton", priceChange: 5.1, image: "https://picsum.photos/seed/cocoa/800", grade: "Grade A",
                origin: "From Kumasi, Ghana", available: "15 Tons available", images: ["https://picsum.photos/seed/cocoa/800"],
                seller: { name: "Kwame Asante", avatar: "https://picsum.photos/seed/seller2/200", rating: 4.9, reviews: 88 },
                specifications: [{ label: "Bean Count", value: "95-105/100g" }, { label: "Moisture", value: "7.5%" }],
                description: "Sun-dried Forastero cocoa beans, known for their rich, full-bodied chocolate flavor. Certified Fair Trade."
            },
            "5": {
                id: "5", name: "Nigerian Ginger", farm: "Kaduna Spice Co.", region: "Kaduna", country: "Nigeria", postedTime: "1d ago", price: 850000, priceUnit: "/ ton", priceChange: 3.2, image: "https://picsum.photos/seed/ginger/800", grade: "Grade A",
                origin: "From Kaduna, Nigeria", available: "50 Tons available", images: ["https://picsum.photos/seed/ginger/800"],
                seller: { name: "Amina Bello", avatar: "https://picsum.photos/seed/seller5/200", rating: 4.7, reviews: 45 },
                specifications: [{ label: "Oil Content", value: "2%" }, { label: "Moisture", value: "10%" }],
                description: "Potent and spicy ginger, sourced from the premier growing regions of Nigeria."
            },
        },
        userProfile: {
            name: "Jordan Campbell", title: "Farmer", avatar: "https://picsum.photos/seed/user/200", email: "jordan.c@example.com", phone: "(555) 123-4567", location: "Saskatoon, SK",
            farm: { name: "Campbell Family Farms", reg: "Reg# 987654321", crops: "Canola, Wheat" }
        },
        wallet: {
            balance: 1500000.75,
            transactions: [{ id: "t1", type: "deposit", title: "Deposit from Bank", date: "Oct 26, 2023", amount: 750000.00 }, { id: "t2", type: "purchase", title: "Purchase: Wheat", date: "Oct 25, 2023", amount: -350000.00 }]
        }
    };
};

export const getAiMarketAnalysis = async (crop: CropDetails): Promise<string> => {
    try {
        if (!process.env.API_KEY) throw new Error("API_KEY not set");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

        return response.text ?? "No analysis available at this time.";

    } catch (error) {
        console.error("Error fetching AI market analysis:", error);
        return "Could not generate analysis due to an error.";
    }
};

export const getAiOfferSuggestion = async (crop: CropDetails): Promise<number | null> => {
    try {
        if (!process.env.API_KEY) throw new Error("API_KEY not set");
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
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
            const parsed = JSON.parse(response.text);
            return parsed.suggestedPrice || null;
        }
        return null;

    } catch (error) {
        console.error("Error fetching AI offer suggestion:", error);
        return null;
    }
};


export default fetchAppData;