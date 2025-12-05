
import { GoogleGenAI, Type } from "@google/genai";
import { AppData, CropDetails } from '../types';

const fetchAppData = async (): Promise<AppData | null> => {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            console.error("Failed to fetch from server, using fallback.");
            return getFallbackData();
        }
        const data = await response.json();
        return data as AppData;
    } catch (error) {
        console.error("Error fetching app data from server:", error);
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
            name: "AJAYI OLALEKAN",
            title: "Farmer",
            avatar: "https://picsum.photos/seed/user/200",
            email: "ajayi.o@example.com",
            phone: "+234 801 234 5678",
            location: "Lagos, NG",
            farm: {
                name: "Olalekan Farms",
                reg: "Reg# 123456789",
                crops: "Ginger, Cocoa"
            }
        },
        wallet: {
            balance: 1500000.75,
            transactions: [{ id: "t1", type: "deposit", title: "Deposit from Bank", date: "Oct 26, 2023", amount: 750000.00 }, { id: "t2", type: "purchase", title: "Purchase: Wheat", date: "Oct 25, 2023", amount: -350000.00 }]
        }
    };
};

export const getAiMarketAnalysis = async (crop: CropDetails): Promise<string> => {
    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crop }),
        });
        if (!response.ok) return "Could not generate analysis due to a server error.";
        const { analysis } = await response.json();
        return analysis || "No analysis available at this time.";
    } catch (error) {
        console.error("Error fetching AI market analysis:", error);
        return "Could not generate analysis due to a network error.";
    }
};

export const getAiOfferSuggestion = async (crop: CropDetails): Promise<number | null> => {
     try {
        const response = await fetch('/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crop }),
        });
        if (!response.ok) return null;
        const { suggestedPrice } = await response.json();
        return suggestedPrice || null;
    } catch (error) {
        console.error("Error fetching AI offer suggestion:", error);
        return null;
    }
};


export default fetchAppData;
