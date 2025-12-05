import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { UserProfile } from '../types';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState<UserProfile | null>(location.state?.profile);

    useEffect(() => {
        if (!profile) {
            // If no profile data is passed, try to load from local storage or redirect
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            } else {
                navigate('/profile');
            }
        }
    }, [profile, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, section?: 'farm') => {
        const { name, value } = e.target;
        if (section === 'farm') {
            setProfile(prev => prev ? { ...prev, farm: { ...prev.farm, [name]: value } } : null);
        } else {
            setProfile(prev => prev ? { ...prev, [name]: value } : null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (profile) {
            localStorage.setItem('userProfile', JSON.stringify(profile));
            // A slight delay to ensure localStorage has saved before navigating
            setTimeout(() => navigate('/profile'), 100);
        }
    };

    if (!profile) {
        return null; // Or a loading spinner
    }

    return (
        <div className="flex flex-col">
            <Header title="Edit Profile" showBackButton onBack={() => navigate('/profile')} />
            <div className="flex-grow p-4 pb-28 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 pt-4">
                    
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold">Personal Details</h2>
                        <label className="flex flex-col">
                             <p className="font-medium pb-2">Full Name</p>
                             <input type="text" name="name" value={profile.name} onChange={handleChange} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                        <label className="flex flex-col">
                             <p className="font-medium pb-2">Title</p>
                             <input type="text" name="title" value={profile.title} onChange={handleChange} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Email</p>
                             <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Phone</p>
                             <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Location</p>
                             <input type="text" name="location" value={profile.location} onChange={handleChange} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold">Farm Information</h2>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Farm Name</p>
                             <input type="text" name="name" value={profile.farm.name} onChange={(e) => handleChange(e, 'farm')} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Registration #</p>
                             <input type="text" name="reg" value={profile.farm.reg} onChange={(e) => handleChange(e, 'farm')} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                         <label className="flex flex-col">
                             <p className="font-medium pb-2">Main Crops</p>
                             <input type="text" name="crops" value={profile.farm.crops} onChange={(e) => handleChange(e, 'farm')} className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                        </label>
                    </div>


                    <div className="fixed bottom-0 left-0 right-0 p-4 mx-auto max-w-md bg-background-light/90 dark:bg-background-dark/90 border-t border-border-light dark:border-border-dark backdrop-blur-sm">
                         <Button3D type="submit" className="w-full">
                            Save Changes
                         </Button3D>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfilePage;
