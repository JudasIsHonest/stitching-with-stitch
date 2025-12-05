import React, { useEffect, useState } from 'react';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 4000); // 4 seconds visible

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
        setExiting(true);
        setTimeout(onClose, 300);
    };

    return (
        <div
            className={`flex items-center justify-between w-full max-w-sm p-3 bg-card-dark rounded-xl shadow-lg transition-all duration-300 ease-in-out transform ${exiting ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
        >
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">campaign</span>
                <p className="text-text-dark-primary text-sm font-medium">{message}</p>
            </div>
            <button onClick={handleClose} className="text-text-dark-secondary">
                <span className="material-symbols-outlined !text-lg">close</span>
            </button>
        </div>
    );
};

export default Notification;
