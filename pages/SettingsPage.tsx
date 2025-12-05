import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface SettingsRowProps {
    icon: string;
    label: string;
    isToggle?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ icon, label, isToggle }) => (
    <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">{icon}</span>
            <p className="text-text-light-primary dark:text-text-dark-primary">{label}</p>
        </div>
        {isToggle ? (
             <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
        ) : (
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>
        )}
    </div>
);


const SettingsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            <Header title="Settings" showBackButton onBack={() => navigate(-1)} />
            <main className="flex-1 px-4 py-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="px-2 text-sm font-semibold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Notifications</h2>
                        <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                           <SettingsRow icon="local_offer" label="New Offers" isToggle />
                           <SettingsRow icon="receipt_long" label="Trade Updates" isToggle />
                           <SettingsRow icon="campaign" label="App Announcements" isToggle />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="px-2 text-sm font-semibold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Account</h2>
                        <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                           <SettingsRow icon="lock" label="Change Password" />
                           <SettingsRow icon="language" label="Language" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;