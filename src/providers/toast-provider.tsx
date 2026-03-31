'use client';

import { ToastContainer, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FadeTransition = cssTransition({
  enter: 'toast-fade-enter',
  exit: 'toast-fade-exit',
});

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
        autoClose={3000}
        transition={FadeTransition}
        style={
          {
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'max-content',
          } as React.CSSProperties
        }
      />
    </>
  );
};
