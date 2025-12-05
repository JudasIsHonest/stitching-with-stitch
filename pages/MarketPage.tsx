import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CropListing, PriceAlert } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import PriceAlertModal from '../components/PriceAlertModal';
import { NotificationContext } from '../context/NotificationContext';
import Button3D from '../components/Button3D';

const MarketPage: React.FC = () => {
    const [listings, setListings] = useState<CropListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [alertModalCrop, setAlertModalCrop] = useState<CropListing | null>(null);
    const { addNotification } = useContext(NotificationContext);
    const navigate = useNavigate();

    // Load initial data and alerts from storage
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

        const savedAlerts = localStorage.getItem('priceAlerts');
        if (savedAlerts) {
            setAlerts(JSON.parse(savedAlerts));
        }
    }, []);
    
    // Simulate real-time price updates and check alerts
    useEffect(() => {
        const interval = setInterval(() => {
            setListings(prevListings => {
                if (prevListings.length === 0) return [];
                
                const updatedListings = prevListings.map(listing => {
                    const changePercent = (Math.random() - 0.5) * 0.02; // max 1% change
                    const newPrice = listing.price * (1 + changePercent);
                    return { ...listing, price: newPrice };
                });

                checkAlerts(updatedListings);
                return updatedListings;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [alerts]); // Rerun effect if alerts change

    const checkAlerts = (updatedListings: CropListing[]) => {
        let triggeredAlerts: PriceAlert[] = [];
        const activeAlerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]') as PriceAlert[];

        for (const alert of activeAlerts) {
            const crop = updatedListings.find(c => c.id === alert.cropId);
            if (!crop) continue;

            const conditionMet =
                (alert.condition === 'above' && crop.price >= alert.targetPrice) ||
                (alert.condition === 'below' && crop.price <= alert.targetPrice);

            if (conditionMet) {
                addNotification(`Price Alert: ${alert.cropName} reached ₦${crop.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!`);
                triggeredAlerts.push(alert);
            }
        }
        
        if (triggeredAlerts.length > 0) {
            const remainingAlerts = activeAlerts.filter(a => !triggeredAlerts.some(ta => ta.cropId === a.cropId));
            setAlerts(remainingAlerts);
            localStorage.setItem('priceAlerts', JSON.stringify(remainingAlerts));
        }
    };


    const handleSetAlert = (alert: PriceAlert) => {
        const newAlerts = [...alerts.filter(a => a.cropId !== alert.cropId), alert];
        setAlerts(newAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
        setAlertModalCrop(null);
    };
    
     const handleRemoveAlert = (cropId: string) => {
        const newAlerts = alerts.filter(a => a.cropId !== cropId);
        setAlerts(newAlerts);
        localStorage.setItem('priceAlerts', JSON.stringify(newAlerts));
        setAlertModalCrop(null);
    };

    const countries = useMemo(() => {
        const uniqueCountries = new Set(listings.map(l => l.country));
        return ['All Countries', ...Array.from(uniqueCountries).sort()];
    }, [listings]);

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  listing.farm.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCountry = !selectedCountry || selectedCountry === 'All Countries' || listing.country === selectedCountry;
            return matchesSearch && matchesCountry;
        });
    }, [listings, searchTerm, selectedCountry]);

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div className="flex flex-col gap-2 p-4 pb-2">
                <h1 className="text-text-light-primary dark:text-text-dark-primary tracking-tight text-[34px] font-bold leading-tight">Market</h1>
            </div>
            
            {/* Search and Filter */}
            <div className="px-4 py-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
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
                 <div className="relative h-12">
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full h-full form-select appearance-none rounded-xl border-none bg-search-light dark:bg-search-dark text-text-light-primary dark:text-text-dark-primary focus:outline-0 focus:ring-2 focus:ring-primary/50 pl-4 pr-10"
                    >
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-light-secondary dark:text-text-dark-secondary">
                        <span className="material-symbols-outlined">arrow_drop_down</span>
                    </div>
                </div>
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
                    {filteredListings.map((item, index) => {
                        const hasAlert = alerts.some(a => a.cropId === item.id);
                        const cropDetailsFromListing = { ...item, origin: `From ${item.region}, ${item.country}`, available: 'Varies', images: [item.image], seller: { name: item.farm, avatar: '', rating: 0, reviews: 0 }, specifications: [], description: '' };
                        return (
                        <div key={item.id} className="relative flex flex-col gap-4 bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm transition-all duration-300 animate-fadeInUp hover:-translate-y-1" style={{ animationDelay: `${index * 50}ms` }}>
                            <Link to={`/details/${item.id}`} state={{ listingId: item.id }} className="block">
                                <div className="flex items-start gap-4">
                                    <img src={item.image} alt={item.name} className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[60px]" />
                                    <div className="flex flex-1 flex-col justify-center">
                                        <p className="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal">{item.name}</p>
                                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">{item.farm} • {item.country}</p>
                                        <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">Posted {item.postedTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold leading-normal">
                                        ₦{item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        <span className="text-sm font-normal text-text-light-secondary dark:text-text-dark-secondary"> {item.priceUnit}</span>
                                    </p>
                                    <div className={`flex items-center gap-1 ${item.priceChange >= 0 ? 'text-price-increase' : 'text-price-decrease'}`}>
                                        <span className="material-symbols-outlined !text-base">
                                            {item.priceChange >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'}
                                        </span>
                                        <p className="text-sm font-medium">{Math.abs(item.priceChange)}%</p>
                                    </div>
                                </div>
                            </Link>

                             <div className="flex items-center gap-3 pt-4 border-t border-border-light dark:border-border-dark">
                                <Button3D
                                    size="small"
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => navigate(`/offer/${item.id}`, { state: { details: cropDetailsFromListing } })}
                                >
                                    Buy
                                </Button3D>
                                <Button3D
                                    size="small"
                                    className="flex-1"
                                    onClick={() => navigate('/list-crop', { state: { crop: item } })}
                                >
                                    Sell
                                </Button3D>
                            </div>

                             <button onClick={() => setAlertModalCrop(item)} className={`absolute top-4 right-4 flex items-center justify-center size-8 rounded-full transition-colors ${hasAlert ? 'bg-primary/20 text-primary' : 'bg-black/20 text-white'}`}>
                                <span className="material-symbols-outlined !text-lg">{hasAlert ? 'notifications_active' : 'notifications'}</span>
                            </button>
                        </div>
                    )})}
                </div>
            )}
            {alertModalCrop && (
                <PriceAlertModal
                    crop={alertModalCrop}
                    existingAlert={alerts.find(a => a.cropId === alertModalCrop.id)}
                    onClose={() => setAlertModalCrop(null)}
                    onSetAlert={handleSetAlert}
                    onRemoveAlert={handleRemoveAlert}
                />
            )}
        </div>
    );
};

export default MarketPage;