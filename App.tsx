import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, AuthContext } from './auth/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import BottomNav from './components/BottomNav';
import MarketPage from './pages/MarketPage';
import CropDetailsPage from './pages/CropDetailsPage';
import SubmitOfferPage from './pages/SubmitOfferPage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import ListCropPage from './pages/ListCropPage';

// Layout for main app pages after login
const MainLayout: React.FC = () => {
    const location = useLocation();
    return (
        <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
            <div className="noise-bg"></div>
            <main key={location.pathname} className="flex-1 pb-24 animate-slideInFromRight">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
};

// Layout for authentication pages
const AuthLayout: React.FC = () => (
     <div className="relative mx-auto flex h-auto min-h-screen w-full max-w-md flex-col overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="noise-bg"></div>
        <main className="flex-1">
            <Outlet />
        </main>
    </div>
);

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Routes>
            {isAuthenticated ? (
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/market" replace />} />
                    <Route path="/market" element={<MarketPage />} />
                    <Route path="/details/:id" element={<CropDetailsPage />} />
                    <Route path="/offer/:id" element={<SubmitOfferPage />} />
                    <Route path="/list-crop" element={<ListCropPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/market" replace />} />
                </Route>
            ) : (
                <Route element={<AuthLayout />}>
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="*" element={<Navigate to="/welcome" replace />} />
                </Route>
            )}
        </Routes>
    );
};


const App: React.FC = () => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <HashRouter>
                    <AppRoutes />
                </HashRouter>
            </NotificationProvider>
        </AuthProvider>
    );
};

export default App;