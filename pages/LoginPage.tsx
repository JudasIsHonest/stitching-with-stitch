
import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Button3D from '../components/Button3D';
import { AuthContext } from '../auth/AuthContext';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically validate credentials
        login();
        navigate('/');
    };
    
    return (
        <div className="flex flex-col h-full">
            <Header title="Log In" showBackButton onBack={() => navigate('/welcome')} />
            <div className="flex-1 flex flex-col p-4">
                <form onSubmit={handleLogin} className="flex flex-col gap-6 pt-8">
                    <div>
                        <label className="flex flex-col">
                            <p className="text-text-light-primary dark:text-text-dark-primary font-medium pb-2">Email Address</p>
                            <input
                                type="email"
                                className="form-input w-full rounded-xl text-text-light-primary dark:text-text-dark-primary focus:ring-2 focus:ring-primary/50 border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark focus:border-primary h-14 px-4"
                                placeholder="you@example.com"
                                defaultValue="ajayi.o@example.com"
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
                                placeholder="••••••••"
                                defaultValue="password"
                                required
                            />
                        </label>
                    </div>
                    <div className="pt-4">
                        <Button3D type="submit" className="w-full">Log In</Button3D>
                    </div>
                </form>
                <p className="text-center text-sm text-text-light-secondary dark:text-text-dark-secondary pt-6">
                    Don't have an account? <Link to="/signup" className="font-bold text-primary">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
