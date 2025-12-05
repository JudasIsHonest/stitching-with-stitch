
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const OptionRow: React.FC<{ icon: string; label: string; description: string }> = ({ icon, label, description }) => (
    <div className="flex items-center gap-4 p-4 bg-card-light dark:bg-card-dark rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex items-center justify-center size-12 rounded-full bg-search-light dark:bg-search-dark">
            <span className="material-symbols-outlined text-text-light-primary dark:text-text-dark-primary">{icon}</span>
        </div>
        <div className="flex-1">
            <p className="font-bold text-text-light-primary dark:text-text-dark-primary">{label}</p>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{description}</p>
        </div>
        <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
    </div>
);


const WithdrawPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <Header title="Withdraw Funds" showBackButton onBack={() => navigate(-1)} />
            <main className="flex-1 p-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col gap-3">
                     <OptionRow icon="account_balance" label="Nigerian Bank" description="Withdraw to your local bank account" />
                     <OptionRow icon="send" label="Send to User" description="Transfer funds to another AgroTrade user" />
                </div>
            </main>
        </div>
    );
};

export default WithdrawPage;
