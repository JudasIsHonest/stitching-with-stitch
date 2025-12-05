import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import fetchAppData from '../services/geminiService';
import LoadingSpinner from '../components/LoadingSpinner';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { AuthContext } from '../auth/AuthContext';

interface InfoRowProps {
    icon: string;
    label: string;
    hasChevron?: boolean;
    onClick?: () => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, hasChevron, onClick }) => (
    <div className={`flex items-center gap-4 px-4 h-14 justify-between ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
        <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">{icon}</span>
            <p className="flex-1 truncate text-base text-text-light-primary dark:text-text-dark-primary">{label}</p>
        </div>
        {hasChevron && <span className="material-symbols-outlined text-text-light-secondary dark:text-text-dark-secondary">chevron_right</span>}
    </div>
);

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchAppData();
            if (data?.userProfile) {
                setProfile(data.userProfile);
            }
            setLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="flex flex-col">
            <Header title="Profile" />
            
            {loading ? (
                <div className="mt-8"><LoadingSpinner text="Loading profile..."/></div>
            ) : !profile ? (
                <div className="text-center p-8 text-price-decrease">Could not load profile.</div>
            ) : (
                <main className="flex-1 px-4 pb-8">
                    <div className="flex w-full flex-col items-center gap-4 py-6">
                        <img className="rounded-full h-32 w-32 object-cover" src={profile.avatar} alt={profile.name} />
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-[22px] font-bold text-text-light-primary dark:text-text-dark-primary">{profile.name}</p>
                            <p className="text-base text-text-light-secondary dark:text-text-dark-secondary">{profile.title}</p>
                        </div>
                        <Button3D className="w-full">Edit Profile</Button3D>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                             <h2 className="px-2 text-sm font-semibold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Personal Details</h2>
                             <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                                <InfoRow icon="mail" label={profile.email} />
                                <InfoRow icon="phone" label={profile.phone} />
                                <InfoRow icon="location_on" label={profile.location} />
                             </div>
                        </div>

                         <div className="flex flex-col gap-2">
                             <h2 className="px-2 text-sm font-semibold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Farm Information</h2>
                             <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                                <InfoRow icon="agriculture" label={profile.farm.name} />
                                <InfoRow icon="domain" label={profile.farm.reg} />
                                <InfoRow icon="grass" label={profile.farm.crops} />
                             </div>
                        </div>

                        <div className="flex flex-col gap-2">
                             <h2 className="px-2 text-sm font-semibold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">Settings</h2>
                             <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                                <InfoRow icon="notifications" label="Notifications" hasChevron onClick={() => navigate('/settings')} />
                                <InfoRow icon="account_balance" label="Linked Bank Account" hasChevron onClick={() => navigate('/settings')} />
                                <InfoRow icon="help_outline" label="Help & Support" hasChevron onClick={() => navigate('/settings')} />
                             </div>
                        </div>
                        
                        <div className="flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-card-dark">
                           <div onClick={logout} className="flex items-center gap-4 px-4 h-14 justify-start text-price-decrease cursor-pointer">
                                <span className="material-symbols-outlined">logout</span>
                                <p className="flex-1 truncate text-base font-semibold">Log Out</p>
                           </div>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default ProfilePage;
