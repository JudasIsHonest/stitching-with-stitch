import React from 'react';
import { Transaction } from '../types';

interface Props {
    transactions: Transaction[];
    initialBalance: number;
}

const BalanceTrendChart: React.FC<Props> = ({ transactions, initialBalance }) => {
    const balanceHistory = React.useMemo(() => {
        let currentBalance = initialBalance;
        const history = [initialBalance];
        // Create history in chronological order
        [...transactions].reverse().forEach(tx => {
            currentBalance += tx.amount;
            history.push(currentBalance);
        });
        return history;
    }, [transactions, initialBalance]);

    if (balanceHistory.length < 2) return null;

    const width = 400;
    const height = 64;
    const padding = 2;

    const maxBalance = Math.max(...balanceHistory);
    const minBalance = Math.min(...balanceHistory);
    const range = maxBalance - minBalance;

    const points = balanceHistory.map((balance, i) => {
        const x = (i / (balanceHistory.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((balance - minBalance) / (range || 1)) * (height - padding * 2) - padding;
        return `${x},${y}`;
    }).join(' ');

    const lastPointY = parseFloat(points.split(' ').pop()?.split(',')[1] || '0');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#13ec5b" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#13ec5b" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polyline
                fill="url(#chartGradient)"
                stroke="#13ec5b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={`${padding},${height} ${points} ${width - padding},${height}`}
            />
             <circle cx={width - padding - 1} cy={lastPointY} r="3" fill="#13ec5b" />
        </svg>
    );
};

export default BalanceTrendChart;
