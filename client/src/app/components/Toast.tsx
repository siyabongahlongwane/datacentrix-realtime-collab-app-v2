'use client'
import React, { useCallback, useEffect } from 'react';
import { useToastStore } from '../store/useToastStore';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const { toggleToast } = useToastStore();

  const closeToast = useCallback(() => {
    toggleToast({ message: '', type: 'success', open: false });
  }, [toggleToast])

  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast()
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [closeToast]);

  return (
    <div onClick={closeToast} className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white z-[20] cursor-pointer ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      {message}
    </div>
  );
};

export default Toast;