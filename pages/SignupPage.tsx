import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { AuthContext } from '../auth/AuthContext';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically create a new user account
        login(); // Log the user in immediately after signup
        navigate('/');
    };
    
    return (
        <div className="flex flex-col h-full">
            <Header title="Sign Up" showBackButton onBack={() => navigate('/welcome')} />
            <div className="flex-1 flex flex-col p-4">
                <form onSubmit={handleSignup} className="flex flex-col gap-6 pt-8">
                    <div>
                        <label className="flex flex-col">
                            <p className="text-text-light-primary dark:text-text-dark-primary font-medium pb-2">Full Name</p>
                            <input
                                type="text"
                                className="form-input w-full rounded-xl text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:border-primary h-14 px-4"
                                placeholder="Jordan Campbell"
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label className="flex flex-col">
                            <p className="text-text-light-primary dark:text-text-dark-primary font-medium pb-2">Email Address</p>
                            <input
                                type="email"
                                className="form-input w-full rounded-xl text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:border-primary h-14 px-4"
                                placeholder="you@example.com"
                                required
                            />
                        </label>
                    </div>
                     <div>
                        <label className="flex flex-col">
                            <p className="text-text-light-primary dark:text-text-dark-primary font-medium pb-2">Password</p>
                            <input
                                type="password"
                                className="form-input w-full rounded-xl text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:border-primary h-14 px-4"
                                placeholder="Create a password"
                                required
                            />
                        </label>
                    </div>
                    <div className="pt-4">
                        <Button3D type="submit" className="w-full">Create Account</Button3D>
                    </div>
                </form>
                 <p className="text-center text-sm text-text-light-secondary dark:text-text-dark-secondary pt-6">
                    Already have an account? <Link to="/login" className="font-bold text-primary">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
