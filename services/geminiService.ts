import { GoogleGenAI, Type } from "@google/genai";
import { AppData } from '../types';

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
                - Create 8 unique 'marketListings' of type 'CropListing'. Include a mix of global and African cash crops. For example: Cocoa from Ghana, Coffee from Ethiopia, Cashew nuts from Ivory Coast, Tea from Kenya, Cotton from Egypt, Hard Red Wheat from USA, Soybeans from Brazil, and Canola from Canada. Make prices realistic (e.g., price per bushel or ton).
                - For each of the 8 listings, create a corresponding 'cropDetails' entry. The key should be the listing's id. Populate all fields of 'CropDetails', including a seller with a plausible name and rating, and detailed specifications. Use picsum.photos for image URLs.
                - Create a 'userProfile' of type 'UserProfile' for a farmer named Jordan Campbell.
                - Create a 'wallet' object with a realistic 'balance' and 6 sample 'transactions' of type 'Transaction'.
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
            { id: "1", name: "Hard Red Wheat", farm: "Green Acres Farm", region: "Midwest, USA", postedTime: "2h ago", price: 8.50, priceUnit: "/ bushel", priceChange: 2.5, image: "https://picsum.photos/seed/wheat/200", grade: "Grade 1" },
            { id: "2", name: "Forastero Cocoa Beans", farm: "Ashanti Gold Farms", region: "Ashanti, Ghana", postedTime: "3h ago", price: 3200, priceUnit: "/ ton", priceChange: 5.1, image: "https://picsum.photos/seed/cocoa/200", grade: "Grade A" },
            { id: "3", name: "Soybeans", farm: "Valley Organics", region: "Southeast, Brazil", postedTime: "5h ago", price: 14.20, priceUnit: "/ bushel", priceChange: -1.2, image: "https://picsum.photos/seed/soy/200", grade: "Grade 2" },
            { id: "4", name: "Arabica Coffee Beans", farm: "Yirgacheffe Union", region: "Yirgacheffe, Ethiopia", postedTime: "8h ago", price: 4.5, priceUnit: "/ lb", priceChange: -0.5, image: "https://picsum.photos/seed/coffee/200", grade: "Specialty Grade" }
        ],
        cropDetails: {
            "1": {
                id: "1", name: "Hard Red Wheat", farm: "Green Acres Farm", region: "Midwest, USA", postedTime: "2h ago", price: 8.50, priceUnit: "/ bushel", priceChange: 2.5, image: "https://picsum.photos/seed/wheat/800", grade: "Grade 1",
                origin: "From Kansas, USA", available: "5000 bushels available", images: ["https://picsum.photos/seed/wheat/800"],
                seller: { name: "Johnathan Miller", avatar: "https://picsum.photos/seed/seller1/200", rating: 4.5, reviews: 34 },
                specifications: [{ label: "Moisture", value: "13.5%" }, { label: "Protein", value: "12.5%" }],
                description: "High-quality hard red winter wheat, perfect for baking and milling. Harvested this season."
            },
            "2": {
                id: "2", name: "Forastero Cocoa Beans", farm: "Ashanti Gold Farms", region: "Ashanti, Ghana", postedTime: "3h ago", price: 3200, priceUnit: "/ ton", priceChange: 5.1, image: "https://picsum.photos/seed/cocoa/800", grade: "Grade A",
                origin: "From Kumasi, Ghana", available: "15 Tons available", images: ["https://picsum.photos/seed/cocoa/800"],
                seller: { name: "Kwame Asante", avatar: "https://picsum.photos/seed/seller2/200", rating: 4.9, reviews: 88 },
                specifications: [{ label: "Bean Count", value: "95-105/100g" }, { label: "Moisture", value: "7.5%" }],
                description: "Sun-dried Forastero cocoa beans, known for their rich, full-bodied chocolate flavor. Certified Fair Trade."
            }
        },
        userProfile: {
            name: "Jordan Campbell", title: "Farmer", avatar: "https://picsum.photos/seed/user/200", email: "jordan.c@example.com", phone: "(555) 123-4567", location: "Saskatoon, SK",
            farm: { name: "Campbell Family Farms", reg: "Reg# 987654321", crops: "Canola, Wheat" }
        },
        wallet: {
            balance: 1250.75,
            transactions: [{ id: "t1", type: "deposit", title: "Deposit from Bank", date: "Oct 26, 2023", amount: 500.00 }, { id: "t2", type: "purchase", title: "Purchase: Wheat", date: "Oct 25, 2023", amount: -250.00 }]
        }
    };
};

export default fetchAppData;