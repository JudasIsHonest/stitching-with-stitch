import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { CropListing } from '../types';

const ListCropPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prefillData = location.state?.crop as CropListing | undefined;

    const [cropName, setCropName] = useState(prefillData?.name || '');
    const [grade, setGrade] = useState(prefillData?.grade || '');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState(prefillData?.price.toString() || '');
    const [priceUnit, setPriceUnit] = useState(prefillData?.priceUnit || '/ ton');
    const [description, setDescription] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(prefillData?.image || null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col h-full">
                <Header title="Success" />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-scaleIn">
                    <div className="flex items-center justify-center size-16 rounded-full bg-primary text-white">
                        <span className="material-symbols-outlined !text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mt-6">Crop Listed!</h2>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2">Your listing for {cropName} is now live on the market.</p>
                    <div className="w-full mt-8">
                        <Button3D onClick={() => navigate('/market')}>Back to Market</Button3D>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col">
            <Header title="List a Crop for Sale" showBackButton onBack={() => navigate(-1)} />
            <div className="flex-grow p-4 pb-28 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                 <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative aspect-video w-full bg-card-light dark:bg-card-dark rounded-xl flex items-center justify-center cursor-pointer overflow-hidden group"
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Crop preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-text-light-secondary dark:text-text-dark-secondary">
                                <span className="material-symbols-outlined !text-4xl">add_photo_alternate</span>
                                <p className="mt-2 text-sm">Upload Photo</p>
                            </div>
                        )}
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-symbols-outlined text-white !text-4xl">photo_camera</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col col-span-2">
                             <p className="font-medium pb-2">Crop Name</p>
                             <input type="text" value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g., Hard Red Wheat" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Grade</p>
                             <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g., Grade 1" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                        <label className="flex flex-col">
                             <p className="font-medium pb-2">Quantity</p>
                             <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g., 5000" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Price (₦)</p>
                             <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g., 12500" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Unit</p>
                             <select value={priceUnit} onChange={e => setPriceUnit(e.target.value)} required className="form-select h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50">
                                <option>/ ton</option>
                                <option>/ bushel</option>
                                <option>/ lb</option>
                                <option>/ kg</option>
                             </select>
                        </label>
                         <label className="flex flex-col col-span-2">
                             <p className="font-medium pb-2">Description</p>
                             <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Add a brief description..." required className="form-textarea h-28 p-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50"></textarea>
                        </label>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 mx-auto max-w-md bg-background-light/90 dark:bg-background-dark/90 border-t border-border-light dark:border-border-dark backdrop-blur-sm">
                         <Button3D type="submit" disabled={status === 'submitting'} className="w-full">
                            {status === 'submitting' ? 'Listing...' : 'List Crop for Sale'}
                         </Button3D>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListCropPage;