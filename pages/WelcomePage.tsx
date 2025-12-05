import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button3D from '../components/Button3D';

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full p-8 justify-between text-center">
            <div className="flex-1 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-primary text-8xl" style={{fontVariationSettings: "'FILL' 1"}}>
                    grass
                </span>
                <h1 className="text-4xl font-bold text-text-light-primary dark:text-text-dark-primary mt-4">AgroTrade</h1>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mt-2">Your global marketplace for cash crops.</p>
            </div>
            
            <div className="flex flex-col gap-4">
                <Button3D onClick={() => navigate('/login')} variant="secondary">Log In</Button3D>
                <Button3D onClick={() => navigate('/signup')}>Sign Up</Button3D>
            </div>
        </div>
    );
};

export default WelcomePage;
