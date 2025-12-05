
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import LoadingSpinner from '../components/LoadingSpinner';

const BankTransferDetails = () => (
    <div className="flex flex-col gap-4 text-center p-4 bg-card-light dark:bg-card-dark rounded-xl">
        <p className="text-text-light-secondary dark:text-text-dark-secondary">Transfer to the account below:</p>
        <div>
            <p className="font-bold text-lg text-text-light-primary dark:text-text-dark-primary">Access Bank</p>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm">Account Name: AgroTrade Inc.</p>
        </div>
         <div>
            <p className="font-mono text-2xl font-bold text-primary tracking-widest">0123456789</p>
            <button className="text-sm text-primary underline mt-1">Copy</button>
        </div>
    </div>
);

const CardDepositForm: React.FC<{ amount: string, setAmount: (val: string) => void }> = ({ amount, setAmount }) => (
    <div className="flex flex-col gap-4">
        <label className="flex flex-col">
            <p className="font-medium pb-2">Amount (₦)</p>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 50000" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
        </label>
        <label className="flex flex-col">
            <p className="font-medium pb-2">Card Number</p>
            <input type="tel" placeholder="0000 0000 0000 0000" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
        </label>
         <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
                <p className="font-medium pb-2">Expiry</p>
                <input type="text" placeholder="MM / YY" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
            </label>
            <label className="flex flex-col">
                <p className="font-medium pb-2">CVV</p>
                <input type="number" placeholder="123" required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
            </label>
        </div>
    </div>
);

const DepositMethodPage: React.FC = () => {
    const { method } = useParams<{ method: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'form' | 'submitting' | 'success'>('form');
    const [amount, setAmount] = useState('');

    const title = method === 'bank-transfer' ? 'Bank Transfer' : 'Card Deposit';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
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
                    <h2 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary mt-6">Deposit Initiated!</h2>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2">
                        {method === 'card' && `Your deposit of ₦${parseFloat(amount).toLocaleString()} was successful.`}
                        {method === 'bank-transfer' && 'Your balance will be updated once the transfer is confirmed.'}
                    </p>
                    <div className="w-full mt-8">
                        <Button3D onClick={() => navigate('/wallet')}>Back to Wallet</Button3D>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col">
            <Header title={title} showBackButton onBack={() => navigate(-1)} />
            <main className="flex-1 p-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                 <form onSubmit={handleSubmit} className="flex flex-col gap-8 pt-4 pb-28">
                    {method === 'bank-transfer' && <BankTransferDetails />}
                    {method === 'card' && <CardDepositForm amount={amount} setAmount={setAmount} />}
                    
                    {status === 'submitting' && <LoadingSpinner text="Processing..." />}

                    <div className="fixed bottom-0 left-0 right-0 p-4 mx-auto max-w-md bg-background-light/90 dark:bg-background-dark/90 border-t border-border-light dark:border-border-dark backdrop-blur-sm">
                         <Button3D type="submit" disabled={status === 'submitting'} className="w-full">
                            {method === 'bank-transfer' ? 'I Have Transferred' : 'Complete Deposit'}
                         </Button3D>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default DepositMethodPage;
