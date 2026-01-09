import React from 'react';
import { ArrowLeftIcon } from './icons';

interface BackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2 px-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200/80 ${className || ''}`}
      aria-label="Go back"
    >
      <ArrowLeftIcon className="w-5 h-5 mr-2" />
      {children || 'Back'}
    </button>
  );
};
