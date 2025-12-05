
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CropListing } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';

const MarketPage: React.FC = () => {
    const [listings, setListings] = useState<CropListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchAppData();
                if (data) {
                    setListings(data.marketListings);
                } else {
                    setError("Failed to load market data.");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredListings = useMemo(() => {
        return listings.filter(listing =>
            listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.farm.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [listings, searchTerm]);

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-2 p-4 pb-2">
                <h1 className="text-text-light-primary dark:text-text-dark-primary tracking-tight text-[34px] font-bold leading-tight">Market</h1>
            </div>
            
            {/* Search Bar */}
            <div className="px-4 py-3">
                <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-search-light dark:bg-search-dark">
                        <div className="text-text-light-secondary dark:text-text-dark-secondary flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-text-light-secondary dark:placeholder:text-text-dark-secondary px-2 text-base font-normal leading-normal"
                            placeholder="Search by crop or farm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </label>
            </div>

            {/* Content */}
            {loading ? (
                <div className="mt-8">
                  <LoadingSpinner text="Fetching market data..."/>
                </div>
            ) : error ? (
                <div className="text-center p-8 text-price-decrease">{error}</div>
            ) : (
                <div className="flex flex-col gap-3 p-4">
                    {filteredListings.map(item => (
                        <Link to={`/details/${item.id}`} state={{ listingId: item.id }} key={item.id} className="block group">
                            <div className="flex flex-col gap-4 bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm hover:shadow-lg active:scale-[0.98] transition-all duration-300 group-hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[60px]" />
                                    <div className="flex flex-1 flex-col justify-center">
                                        <p className="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal">{item.name}</p>
                                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">{item.farm} • {item.region}</p>
                                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">Posted {item.postedTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold leading-normal">
                                        ${item.price.toFixed(2)}
                                        <span className="text-sm font-normal text-text-light-secondary dark:text-text-dark-secondary"> {item.priceUnit}</span>
                                    </p>
                                    <div className={`flex items-center gap-1 ${item.priceChange >= 0 ? 'text-price-increase' : 'text-price-decrease'}`}>
                                        <span className="material-symbols-outlined !text-base">
                                            {item.priceChange >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
                                        </span>
                                        <p className="text-sm font-medium">{Math.abs(item.priceChange)}%</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MarketPage;
