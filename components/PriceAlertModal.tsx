import React, { useState } from 'react';
import { CropListing, PriceAlert } from '../types';
import Button3D from './Button3D';

interface Props {
    crop: CropListing;
    existingAlert?: PriceAlert;
    onClose: () => void;
    onSetAlert: (alert: PriceAlert) => void;
    onRemoveAlert: (cropId: string) => void;
}

const PriceAlertModal: React.FC<Props> = ({ crop, existingAlert, onClose, onSetAlert, onRemoveAlert }) => {
    const [condition, setCondition] = useState<'above' | 'below'>(existingAlert?.condition || 'above');
    const [targetPrice, setTargetPrice] = useState<string>(existingAlert?.targetPrice.toString() || crop.price.toFixed(2));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const price = parseFloat(targetPrice);
        if (!isNaN(price) && price > 0) {
            onSetAlert({
                cropId: crop.id,
                cropName: crop.name,
                condition,
                targetPrice: price,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-card-dark rounded-2xl w-full max-w-sm p-6 text-white animate-scaleIn" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">Set Price Alert</h2>
                        <p className="text-text-dark-secondary mt-1">For {crop.name}</p>
                    </div>
                    <button onClick={onClose} className="text-text-dark-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    <p className="text-sm text-center text-text-dark-secondary">
                        Current Price: ₦{crop.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {crop.priceUnit}
                    </p>

                    <div className="mt-4">
                        <label className="text-sm font-medium text-text-dark-secondary">Notify me when price is:</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setCondition('above')}
                                className={`py-2 rounded-lg transition-colors text-sm font-bold ${condition === 'above' ? 'bg-primary text-background-dark' : 'bg-search-dark'}`}
                            >
                                Above
                            </button>
                            <button
                                type="button"
                                onClick={() => setCondition('below')}
                                className={`py-2 rounded-lg transition-colors text-sm font-bold ${condition === 'below' ? 'bg-primary text-background-dark' : 'bg-search-dark'}`}
                            >
                                Below
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                         <label className="text-sm font-medium text-text-dark-secondary">Target Price:</label>
                         <div className="relative mt-2">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-dark-secondary">₦</span>
                             <input
                                type="number"
                                step="0.01"
                                value={targetPrice}
                                onChange={e => setTargetPrice(e.target.value)}
                                className="form-input w-full rounded-xl text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-dark bg-search-dark focus:border-primary h-14 pl-8 pr-4"
                                required
                            />
                         </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-3">
                         <Button3D type="submit">{existingAlert ? 'Update Alert' : 'Set Alert'}</Button3D>
                         {existingAlert && (
                             <Button3D type="button" variant="secondary" onClick={() => onRemoveAlert(crop.id)}>
                                 Remove Alert
                             </Button3D>
                         )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PriceAlertModal;