
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => {
    const actualTo = to === "/" ? "/market" : to;
    const activeClass = "text-primary dark:text-primary";
    const inactiveClass = "text-text-light-secondary dark:text-text-dark-secondary";
    const activeIconStyle = { fontVariationSettings: "'FILL' 1, 'wght' 600" };
    const inactiveIconStyle = { fontVariationSettings: "'FILL' 0, 'wght' 400" };

    return (
        <NavLink
            to={actualTo}
            end
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 transition-colors duration-200 w-20 ${isActive ? activeClass : inactiveClass}`}
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
    const navigate = useNavigate();
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-md">
            <div className="relative h-20 border-t border-border-light bg-background-light/80 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
                <div className="flex h-full items-center justify-between px-8">
                    {/* Left Items */}
                    <div className="flex items-center gap-8">
                         <NavItem to="/" icon="storefront" label="Market" />
                         <NavItem to="/wallet" icon="account_balance_wallet" label="Wallet" />
                    </div>
                    {/* Right Items */}
                     <div className="flex items-center">
                         <NavItem to="/profile" icon="person" label="Profile" />
                    </div>
                </div>
            </div>

             {/* Floating Action Button */}
             <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <button 
                    onClick={() => navigate('/list-crop')}
                    className="flex items-center justify-center size-16 rounded-full bg-primary text-background-dark shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-105 active:scale-95"
                    aria-label="List a new crop for sale"
                >
                    <span className="material-symbols-outlined !text-3xl">add</span>
                </button>
            </div>
        </footer>
    );
};

export default BottomNav;
