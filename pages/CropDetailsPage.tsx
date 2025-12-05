import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CropDetails } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Button3D from '../components/Button3D';

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const starStyle = { fontVariationSettings: "'FILL' 1" };
    
    return (
        <div className="flex items-center text-yellow-400">
            {[...Array(totalStars)].map((_, i) => (
                <span key={i} className="material-symbols-outlined !text-base" style={i < filledStars ? starStyle : {}}>
                    star
                </span>
            ))}
        </div>
    );
};

const CropDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [details, setDetails] = useState<CropDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            if (!id) return;
            setLoading(true);
            const data = await fetchAppData();
            const cropDetail = data?.cropDetails[id];
            if (cropDetail) {
                setDetails(cropDetail);
            }
            setLoading(false);
        };
        loadDetails();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header title="" showBackButton onBack={() => navigate(-1)} />
                <div className="mt-8"><LoadingSpinner text="Loading crop details..." /></div>
            </>
        );
    }

    if (!details) {
        return (
             <>
                <Header title="Not Found" showBackButton onBack={() => navigate(-1)} />
                <div className="text-center p-8 text-price-decrease">Crop details not found.</div>
             </>
        );
    }
    
    return (
        <div className="relative flex min-h-screen w-full flex-col">
            <Header title={details.name} showBackButton onBack={() => navigate(-1)} />

            <div className="flex-grow pb-28">
                <div className="px-4">
                    <div
                        className="relative bg-cover bg-center flex min-h-80 flex-col justify-end overflow-hidden rounded-2xl"
                        style={{ backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("${details.images[0]}")` }}
                    ></div>
                </div>

                <div className="px-4 pt-6">
                    <div className="rounded-2xl border border-border-light bg-card-light p-5 dark:border-border-dark dark:bg-card-dark">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary">{details.name}</h1>
                        <p className="pt-1 text-base font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">{details.origin}</p>
                        <div className="mt-4 flex items-baseline justify-between">
                            <h2 className="text-3xl font-bold leading-tight text-primary dark:text-primary">
                                ${details.price.toFixed(2)} <span className="text-base font-medium text-text-light-secondary dark:text-text-dark-secondary">{details.priceUnit}</span>
                            </h2>
                            <p className="text-base font-medium text-text-light-secondary dark:text-text-dark-secondary">{details.available}</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pt-5">
                    <div className="flex items-center gap-4 rounded-2xl border border-border-light bg-card-light p-4 dark:border-border-dark dark:bg-card-dark">
                        <img className="size-14 rounded-full object-cover" src={details.seller.avatar} alt={`Profile of ${details.seller.name}`} />
                        <div className="flex-1">
                            <p className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">{details.seller.name}</p>
                            <div className="flex items-center gap-1.5 pt-1">
                                <RatingStars rating={details.seller.rating} />
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{details.seller.rating} ({details.seller.reviews} reviews)</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-4 pt-5">
                    <h3 className="px-1 text-xl font-bold text-text-light-primary dark:text-text-dark-primary">Specifications</h3>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                        {details.specifications.map((spec, index) => (
                             <div key={index} className="rounded-lg border border-border-light bg-card-light p-3 dark:border-border-dark dark:bg-card-dark">
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{spec.label}</p>
                                <p className="mt-0.5 font-bold text-text-light-primary dark:text-text-dark-primary">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="px-4 pt-5">
                     <h3 className="px-1 text-xl font-bold text-text-light-primary dark:text-text-dark-primary">Description</h3>
                     <p className="mt-2 text-base leading-relaxed text-text-light-secondary dark:text-text-dark-secondary">{details.description}</p>
                </div>
            </div>

            <footer className="fixed bottom-0 z-20 w-full max-w-md border-t border-border-light bg-background-light/90 p-4 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/90">
                <Button3D onClick={() => navigate(`/offer/${id}`, { state: { details }})} className="w-full">
                    Start Trade
                </Button3D>
            </footer>
        </div>
    );
};

export default CropDetailsPage;