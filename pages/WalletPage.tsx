import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Button3D from '../components/Button3D';

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const isIncome = type === 'deposit' || type === 'sale';
    const icon = isIncome ? 'south_west' : 'north_east';
    const color = isIncome ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary';
    const bgColor = isIncome ? 'bg-primary/20' : 'bg-search-light dark:bg-search-dark';

    return (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
            <span className={`material-symbols-outlined ${color} text-2xl`}>{icon}</span>
        </div>
    );
};

const WalletPage: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchAppData();
            if (data?.wallet) {
                setBalance(data.wallet.balance);
                setTransactions(data.wallet.transactions);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="flex flex-col">
            <Header title="My Wallet" />

            {loading ? (
                <div className="mt-8"><LoadingSpinner text="Fetching wallet data..." /></div>
            ) : (
                <div className="p-4">
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm text-center pt-1">Current Balance</p>
                    <h1 className="text-text-light-primary dark:text-text-dark-primary text-[40px] font-bold text-center pb-3 pt-1">
                        ${balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'}
                    </h1>

                    <div className="flex justify-stretch py-3">
                        <div className="flex flex-1 gap-4">
                            <Button3D className="flex-1">Deposit</Button3D>
                            <Button3D className="flex-1" variant="secondary">Withdraw</Button3D>
                        </div>
                    </div>

                    <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold pb-2 pt-6">Recent Transactions</h3>
                    <div className="flex flex-col gap-2 py-2">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center gap-4 rounded-lg p-3">
                                <TransactionIcon type={tx.type} />
                                <div className="flex-1">
                                    <p className="font-bold text-text-light-primary dark:text-text-dark-primary">{tx.title}</p>
                                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{tx.date}</p>
                                </div>
                                <p className={`font-bold ${tx.amount > 0 ? 'text-primary' : 'text-text-light-primary dark:text-text-dark-primary'}`}>
                                    {tx.amount > 0 ? '+' : ''}${tx.amount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletPage;