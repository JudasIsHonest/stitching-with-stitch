import React from 'react';

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'normal' | 'small';
}

const Button3D: React.FC<Button3DProps> = ({ children, className = '', variant = 'primary', size = 'normal', ...props }) => {
    
    const sizeClasses = {
        normal: 'h-14 px-5 text-base',
        small: 'h-10 px-4 text-sm',
    };

    const baseClasses = `relative w-full rounded-xl font-bold transition-all duration-150 ease-in-out transform flex items-center justify-center ${sizeClasses[size]}`;
    
    const variantClasses = {
        primary: `
            bg-gradient-to-b from-primary-light to-primary text-background-dark
            shadow-[0_6px_0_0_#0c7c32] hover:shadow-[0_4px_0_0_#0c7c32] active:shadow-[0_1px_0_0_#0c7c32]
            hover:-translate-y-0.5 active:translate-y-1 active:from-primary active:to-primary
        `,
        secondary: `
            bg-gradient-to-b from-white to-secondary dark:from-zinc-600 dark:to-secondary-dark text-text-light-primary dark:text-text-dark-primary
            shadow-[0_6px_0_0_#a8a8ad] dark:shadow-[0_6px_0_0_#1a1a1c]
            hover:shadow-[0_4px_0_0_#a8a8ad] dark:hover:shadow-[0_4px_0_0_#1a1a1c]
            active:shadow-[0_1px_0_0_#a8a8ad] dark:active:shadow-[0_1px_0_0_#1a1a1c]
            hover:-translate-y-0.5 active:translate-y-1 active:from-secondary active:to-secondary dark:active:from-secondary-dark dark:active:to-secondary-dark
        `,
    };
    
    const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[0_2px_0_0_#a8a8ad] dark:disabled:shadow-[0_2px_0_0_#1a1a1c]';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center">{children}</span>
        </button>
    );
};

export default Button3D;
