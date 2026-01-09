
import React from 'react';

// NOTE: Using `export default` for lazy loading compatibility if needed elsewhere.
const RotatingGlobe: React.FC = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div 
                className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full relative overflow-hidden shadow-2xl"
                style={{
                    background: 'radial-gradient(circle at 25% 25%, #60a5fa, #2563eb)', // blue-400 to blue-600
                }}
            >
                {/* Landmasses */}
                <div 
                    className="absolute inset-0 bg-repeat-x opacity-30"
                    style={{
                        backgroundImage: `url('//unpkg.com/three-globe/example/img/earth-topology.png')`,
                        backgroundSize: 'auto 100%',
                        animation: `rotate-globe-bg 20s linear infinite`,
                    }}
                />
                {/* Specular Highlight */}
                <div
                    className="absolute top-2 left-1/2 w-3/4 h-3/4 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.4), transparent 60%)',
                        transform: 'translateX(-50%) translateY(-25%)',
                    }}
                />
                {/* Atmosphere Glow */}
                 <div
                    className="absolute inset-[-10px] rounded-full border-4 border-blue-300/50"
                 ></div>
            </div>
        </div>
    );
};

export default RotatingGlobe;
