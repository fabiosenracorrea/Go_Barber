import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import Toast from '../components/Toast';

export interface ToastMessageStruct {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessageStruct, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessageStruct[]>([]);

  const addToast = useCallback((message: Omit<ToastMessageStruct, 'id'>) => {
    const id = uuid();

    const toast = {
      ...message,
      id,
    };

    setMessages(oldMessages => [...oldMessages, toast]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setMessages(state => state.filter(msg => msg.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Toast messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

export { ToastProvider, useToast };
