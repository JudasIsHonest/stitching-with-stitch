
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    const activeClass = "text-primary dark:text-primary";
    const inactiveClass = "text-text-light-secondary dark:text-text-dark-secondary";
    const activeIconStyle = { fontVariationSettings: "'FILL' 1, 'wght' 600" };
    const inactiveIconStyle = { fontVariationSettings: "'FILL' 0, 'wght' 400" };

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${isActive ? activeClass : inactiveClass}`}
        >
            {({ isActive }) => (
                <>
                    <span className="material-symbols-outlined" style={isActive ? activeIconStyle : inactiveIconStyle}>
                        {icon}
                    </span>
                    <span className="text-xs font-medium">{label}</span>
                </>
            )}
        </NavLink>
    );
};

const BottomNav: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md border-t border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
            <div className="flex h-20 items-center justify-around px-4">
                <NavItem to="/" icon="storefront" label="Market" />
                <NavItem to="/wallet" icon="account_balance_wallet" label="Wallet" />
                <NavItem to="/profile" icon="person" label="Profile" />
            </div>
        </footer>
    );
};

export default BottomNav;
