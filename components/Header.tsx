import React from 'react';

interface HeaderProps {
    title: string;
    showBackButton?: boolean;
    onBack?: () => void;
    headerRight?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, onBack, headerRight }) => {
    return (
        <div className="sticky top-0 z-10 flex h-16 items-center bg-background-light/80 px-4 pt-2 backdrop-blur-sm dark:bg-background-dark/80">
            <div className="flex w-12 items-center justify-start">
                {showBackButton && (
                    <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full text-text-light-primary dark:text-text-dark-primary">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                )}
            </div>
            <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-text-light-primary dark:text-text-dark-primary truncate">
                {title}
            </h1>
            <div className="flex w-12 items-center justify-end">
                {headerRight}
            </div>
        </div>
    );
};

export default Header;
