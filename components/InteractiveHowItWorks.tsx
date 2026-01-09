import React from 'react';
import RotatingGlobe from './RotatingGlobe';

export const InteractiveHowItWorks: React.FC = () => {
    return (
        <div className="relative w-full h-96 bg-slate-800 rounded-lg overflow-hidden my-6">
            <RotatingGlobe />
        </div>
    );
};