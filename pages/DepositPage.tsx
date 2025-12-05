

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface OptionRowProps {
    icon: string;
    label: string;
    description: string;
    onClick?: () => void;
    disabled?: boolean;
}

const OptionRow: React.FC<OptionRowProps> = ({ icon, label, description, onClick, disabled }) => (
    <div 
        onClick={!disabled ? onClick : undefined}
        className={`flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl transition-colors ${disabled ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'}`}
    >
        <div className="flex items-center justify-center size-12 rounded-full bg-search-light dark:bg-search-dark">
            <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">{icon}</span>
        </div>
        <div className="flex-1">
            <p className="font-bold text-text-light-primary dark:text-text-dark-primary">{label}</p>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{description}</p>
        </div>
        {!disabled && <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>}
    </div>
);


const DepositPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <Header title="Deposit Funds" showBackButton onBack={() => navigate(-1)} />
            <main className="flex-1 p-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col gap-3">
                    <OptionRow icon="account_balance" label="Bank Transfer" description="Deposit via a local bank transfer" onClick={() => navigate('/deposit/bank-transfer')} />
                    <OptionRow icon="credit_card" label="Card Deposit" description="Use your debit or credit card" onClick={() => navigate('/deposit/card')} />
                    <OptionRow icon="dialpad" label="USSD" description="Quick deposit using USSD code" disabled />
                    <OptionRow icon="currency_bitcoin" label="Crypto" description="Deposit using cryptocurrency" disabled />
                </div>
            </main>
        </div>
    );
};

export default DepositPage;
