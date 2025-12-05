import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Transaction } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import BalanceTrendChart from '../components/BalanceTrendChart';

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const isIncome = type === 'deposit' || type === 'sale';
    const icon = isIncome ? 'south_west' : 'north_east';
    const color = isIncome ? 'text-primary' : 'text-text-dark-primary';
    const bgColor = isIncome ? 'bg-primary/20' : 'bg-white/10';

    return (
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
            <span className={`material-symbols-outlined ${color} text-2xl`}>{icon}</span>
        </div>
    );
};

const useAnimatedCounter = (endValue: number) => {
    const [count, setCount] = useState(0);
    // FIX: Initialize useRef with null to satisfy overloads that expect an argument.
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const startValue = count;
        const duration = 1200; // ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = 1 - Math.pow(1 - percentage, 3); // easeOutCubic
            
            const animatedValue = startValue + (endValue - startValue) * easedPercentage;
            setCount(animatedValue);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                 setCount(endValue); // Ensure it ends on the exact value
            }
        };
        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [endValue]);

    return count;
};


const WalletPage: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const animatedBalance = useAnimatedCounter(balance || 0);

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

    const initialBalance = useMemo(() => {
        if (!balance || transactions.length === 0) return 0;
        return transactions.reduce((acc, tx) => acc - tx.amount, balance);
    }, [balance, transactions]);

    return (
        <div className="flex flex-col">
            <Header title="My Wallet" />

            {loading ? (
                <div className="mt-8"><LoadingSpinner text="Fetching wallet data..." /></div>
            ) : (
                <div className="p-4">
                    {/* Wallet Card */}
                    <div className="relative aspect-[1.586] w-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-gradient-to-br from-gray-800 to-black text-white animate-fadeInUp">
                        <div className="absolute inset-0 shimmer-effect opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-sm opacity-70">Current Balance</p>
                            <p className="text-4xl font-bold tracking-tight mt-1">
                                ₦{animatedBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                         <div className="relative z-10 h-16 -mx-6 -mb-6">
                            {transactions.length > 1 && <BalanceTrendChart transactions={transactions} initialBalance={initialBalance} />}
                        </div>
                    </div>

                    <div className="flex justify-stretch py-5 gap-4">
                        <Button3D className="flex-1">
                            <span className="material-symbols-outlined !text-xl mr-2">add</span>
                            Deposit
                        </Button3D>
                        <Button3D className="flex-1" variant="secondary">
                             <span className="material-symbols-outlined !text-xl mr-2">remove</span>
                            Withdraw
                        </Button3D>
                    </div>

                    <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold pb-2 pt-2">Recent Transactions</h3>
                    <div className="flex flex-col gap-2 py-2">
                        {transactions.map((tx, index) => (
                            <div 
                                key={tx.id} 
                                className="flex items-center gap-4 rounded-xl p-3 bg-card-light dark:bg-card-dark animate-fadeInUp"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <TransactionIcon type={tx.type} />
                                <div className="flex-1">
                                    <p className="font-bold text-text-light-primary dark:text-text-dark-primary">{tx.title}</p>
                                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">{tx.date}</p>
                                </div>
                                <p className={`font-bold ${tx.amount > 0 ? 'text-price-increase' : 'text-text-light-primary dark:text-text-dark-primary'}`}>
                                    {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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