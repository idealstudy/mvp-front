'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      <ToastContainer
        containerId="bottom-center"
        position="bottom-center"
        style={
          {
            bottom: '3.125rem',
            '--toastify-toast-width': 'auto',
          } as React.CSSProperties
        }
      />
    </>
  );
};
