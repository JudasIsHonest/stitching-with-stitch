import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CropDetails } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { getAiOfferSuggestion } from '../services/geminiService';


const SubmitOfferPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [details, setDetails] = useState<CropDetails | null>(location.state?.details || null);

    const [quantity, setQuantity] = useState(10);
    const [offerPrice, setOfferPrice] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [isSuggesting, setIsSuggesting] = useState(false);


    useEffect(() => {
        if (!details) {
            console.log("Details not found in state, would need to fetch for id:", id);
            navigate(`/details/${id}`);
        }
    }, [details, id, navigate]);

    const handleQuantityChange = (amount: number) => {
        setQuantity(prev => Math.max(1, prev + amount));
    };
    
    const handleAiSuggestion = async () => {
        if (!details) return;
        setIsSuggesting(true);
        const suggestedPrice = await getAiOfferSuggestion(details);
        if (suggestedPrice) {
            setOfferPrice(suggestedPrice.toFixed(2));
        }
        setIsSuggesting(false);
    };

    const platformFeeRate = 0.01;
    const { totalOfferValue, platformFee, total } = useMemo(() => {
        const price = parseFloat(offerPrice);
        if (isNaN(price) || price <= 0) {
            return { totalOfferValue: 0, platformFee: 0, total: 0 };
        }
        const totalOfferValue = quantity * price;
        const platformFee = totalOfferValue * platformFeeRate;
        const total = totalOfferValue + platformFee;
        return { totalOfferValue, platformFee, total };
    }, [quantity, offerPrice, platformFeeRate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    if (!details) {
        return <LoadingSpinner text="Loading..." />;
    }

    if (status === 'success') {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-8 animate-scaleIn">
                <div className="flex flex-col items-center gap-4 bg-card-light dark:bg-card-dark p-8 rounded-2xl w-full max-w-sm text-center">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary text-white">
                        <span className="material-symbols-outlined !text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">Offer Submitted!</h2>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary">Your offer for {details.name} has been sent to {details.seller.name}.</p>
                    <Button3D onClick={() => navigate('/wallet')} className="mt-4 w-full">View in Wallet</Button3D>
                </div>
            </div>
        );
    }
    
    if (status === 'loading') {
         return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <LoadingSpinner text="Submitting Offer..."/>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <Header title="Make an Offer" showBackButton onBack={() => navigate(-1)} />

            <div className="flex-grow px-4 pt-4 pb-28 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="mb-6 rounded-2xl bg-card-light dark:bg-card-dark p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Asking: ₦{details.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {details.priceUnit}</p>
                            <p className="text-text-light-primary dark:text-text-dark-primary text-base font-bold">{details.name}</p>
                            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Seller: {details.seller.name}</p>
                        </div>
                        <img className="w-20 h-20 bg-center bg-cover rounded-lg flex-shrink-0" src={details.image} alt={details.name} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center gap-4 bg-card-light dark:bg-card-dark px-4 min-h-16 rounded-xl justify-between">
                         <div className="flex items-center gap-4">
                            <div className="text-text-light-primary dark:text-text-dark-primary flex items-center justify-center rounded-full bg-search-light dark:bg-search-dark shrink-0 size-10">
                                <span className="material-symbols-outlined">scale</span>
                            </div>
                            <p className="text-text-light-primary dark:text-text-dark-primary text-base">Quantity ({details.priceUnit.replace('/', '')})</p>
                        </div>
                        <div className="flex items-center gap-3 text-text-light-primary dark:text-text-dark-primary">
                            <button type="button" onClick={() => handleQuantityChange(-1)} className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full bg-search-light dark:bg-search-dark">-</button>
                            <input className="text-base font-medium w-12 p-0 text-center bg-transparent focus:outline-none border-none" type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} />
                            <button type="button" onClick={() => handleQuantityChange(1)} className="text-xl font-medium flex h-8 w-8 items-center justify-center rounded-full bg-search-light dark:bg-search-dark">+</button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="flex flex-col">
                            <div className="flex justify-between items-center pb-2">
                                <p className="text-text-light-primary dark:text-text-dark-primary text-base font-medium">Your Offer per Unit</p>
                                <button
                                    type="button"
                                    onClick={handleAiSuggestion}
                                    disabled={isSuggesting}
                                    className="flex items-center gap-1.5 text-primary font-bold text-sm px-2 py-1 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-50"
                                >
                                    {isSuggesting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <span>Getting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined !text-base">auto_awesome</span>
                                            <span>Suggest Offer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-light-secondary dark:text-text-dark-secondary">₦</span>
                                <input
                                    className="form-input w-full rounded-xl text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:border-primary h-16 pl-8 pr-4"
                                    placeholder={details.price.toFixed(2)}
                                    type="number"
                                    step="0.01"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    required
                                />
                            </div>
                        </label>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-light dark:border-border-dark">
                        <div className="flex justify-between py-2"><p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Total Offer Value</p><p className="text-text-light-primary dark:text-text-dark-primary font-bold">₦{totalOfferValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                        <div className="flex justify-between py-2"><p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Platform Fee (1%)</p><p className="text-text-light-primary dark:text-text-dark-primary">₦{platformFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                        <div className="flex justify-between py-2 mt-2 border-t border-border-light dark:border-border-dark"><p className="font-bold text-text-light-primary dark:text-text-dark-primary">Total</p><p className="text-primary font-bold text-lg">₦{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 mx-auto max-w-md bg-background-light/90 dark:bg-background-dark/90 border-t border-border-light dark:border-border-dark backdrop-blur-sm">
                         <Button3D type="submit" disabled={total <= 0} className="w-full">Submit Offer</Button3D>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitOfferPage;