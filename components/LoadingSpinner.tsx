
import React from 'react';

const LoadingSpinner: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
