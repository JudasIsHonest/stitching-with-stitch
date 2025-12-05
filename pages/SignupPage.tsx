
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { AuthContext } from '../auth/AuthContext';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        country: 'Nigeria',
        userType: 'Farmer',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("New user data:", formData);
        login();
        navigate('/');
    };
    
    return (
        <div className="flex flex-col h-full">
            <Header title="Create Account" showBackButton onBack={() => navigate('/welcome')} />
            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSignup} className="flex flex-col gap-5 p-4 pt-6 pb-28">
                    <label className="flex flex-col">
                        <p className="font-medium pb-2">Full Name</p>
                        <input type="text" name="fullName" onChange={handleChange} required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                    </label>
                    <label className="flex flex-col">
                        <p className="font-medium pb-2">Email Address</p>
                        <input type="email" name="email" onChange={handleChange} required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                    </label>
                    <label className="flex flex-col">
                        <p className="font-medium pb-2">Phone Number</p>
                        <input type="tel" name="phone" onChange={handleChange} required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <p className="font-medium pb-2">Country</p>
                            <select name="country" value={formData.country} onChange={handleChange} required className="form-select h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50">
                                <option>Nigeria</option>
                                <option>Ghana</option>
                                <option>Kenya</option>
                                <option>Ethiopia</option>
                                <option>Tanzania</option>
                            </select>
                        </label>
                        <label className="flex flex-col">
                            <p className="font-medium pb-2">I am a...</p>
                            <select name="userType" value={formData.userType} onChange={handleChange} required className="form-select h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50">
                                <option>Farmer</option>
                                <option>Buyer</option>
                                <option>Broker</option>
                            </select>
                        </label>
                    </div>
                     <label className="flex flex-col">
                        <p className="font-medium pb-2">Password</p>
                        <input type="password" name="password" onChange={handleChange} required className="form-input h-14 px-4 rounded-xl bg-card-light dark:bg-card-dark border-border-light dark:border-border-dark focus:ring-primary/50" />
                    </label>
                    
                     <p className="text-center text-xs text-text-light-secondary dark:text-text-dark-secondary pt-2">
                        By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                    
                    <div className="fixed bottom-0 left-0 right-0 p-4 mx-auto max-w-md bg-background-light/90 dark:bg-background-dark/90 border-t border-border-light dark:border-border-dark backdrop-blur-sm">
                         <Button3D type="submit" className="w-full">Create Account</Button3D>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
