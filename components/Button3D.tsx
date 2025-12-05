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

    const baseClasses = `relative w-full rounded-xl font-bold transition-all duration-150 ease-in-out transform active:translate-y-1 ${sizeClasses[size]}`;
    
    const variantClasses = {
        primary: 'bg-primary text-background-dark border-b-4 border-primary-shadow hover:-translate-y-1',
        secondary: 'bg-secondary dark:bg-secondary-dark text-text-light-primary dark:text-text-dark-primary border-b-4 border-secondary-shadow dark:border-gray-900 hover:-translate-y-1',
    };
    
    const disabledClasses = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-2';

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button3D;