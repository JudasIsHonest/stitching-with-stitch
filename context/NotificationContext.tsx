import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Notification from '../components/Notification';

interface NotificationMessage {
    id: number;
    message: string;
}

interface NotificationContextType {
    addNotification: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    addNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

    const addNotification = useCallback((message: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message }]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
                <div className="flex flex-col items-center gap-2">
                    {notifications.map(n => (
                        <Notification
                            key={n.id}
                            message={n.message}
                            onClose={() => removeNotification(n.id)}
                        />
                    ))}
                </div>
            </div>
        </NotificationContext.Provider>
    );
};
