import React, { useRef, useEffect } from 'react';

// A simple SVG for a skull
const FoodIcon: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <svg style={style} className="w-6 h-6 text-slate-500 dark:text-slate-400 absolute transition-opacity duration-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2a10 10 0 00-10 10v6a2 2 0 002 2h4.5a.5.5 0 01.5.5V22h6v-1.5a.5.5 0 01.5-.5H20a2 2 0 002-2v-6A10 10 0 0012 2zm-4 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
  </svg>
);

// The Reptiloid SVG with a crocodile-like appearance
const Reptiloid: React.FC = () => (
    <svg viewBox="0 0 90 35" className="w-28 h-10 reptiloid-container">
        <style>{`
            .reptiloid-container {
                animation: stomp 0.8s ease-in-out infinite;
                transform-origin: center bottom;
            }
            .reptiloid-leg-front {
                animation: walk1-reptiloid 0.8s ease-in-out infinite;
                transform-origin: 55px 23px;
            }
            .reptiloid-leg-back {
                animation: walk2-reptiloid 0.8s ease-in-out infinite;
                transform-origin: 25px 24px;
            }
            @keyframes stomp {
                0%, 100% { transform: translateY(0) rotate(-0.5deg); }
                50% { transform: translateY(-2px) rotate(0.5deg); }
            }
            @keyframes walk1-reptiloid {
                0%, 100% { transform: rotate(-15deg); }
                50% { transform: rotate(15deg); }
            }
            @keyframes walk2-reptiloid {
                0%, 100% { transform: rotate(15deg); }
                50% { transform: rotate(-15deg); }
            }
        `}</style>
        <g className="fill-green-600 dark:fill-green-700 stroke-green-800 dark:stroke-green-500" strokeWidth="1.5">
            {/* Legs */}
            <path className="reptiloid-leg-back" d="M25 24 C 20 32, 30 35, 32 30" strokeLinecap="round" fill="none" />
            <path className="reptiloid-leg-front" d="M55 23 C 50 31, 60 34, 62 29" strokeLinecap="round" fill="none" />
            
            {/* Body and Tail */}
            <path d="M5 22 C 20 15, 60 15, 70 20 L 85 18 C 60 28, 25 30, 10 25 z" />
            
            {/* Head */}
            <path d="M70 20 C 80 18, 90 22, 88 16 C 85 24, 75 26, 68 23" />
            <path d="M82 19 L 88 18" strokeLinecap="round" /> {/* Mouth line */}

            {/* Eye */}
            <circle cx="82" cy="18" r="1.5" className="fill-yellow-400" stroke="none" />
        </g>
    </svg>
);


interface LizardAnimationProps {
    timeInSeconds: number;
}

const CYCLE_DURATION_SECONDS = 60; // One lap per minute
const FOOD_POSITIONS = [10, 25, 45, 65, 85]; // % positions

const LizardAnimation: React.FC<LizardAnimationProps> = ({ timeInSeconds }) => {
    // Calculate progress within the 60-second cycle
    const secondsInCycle = timeInSeconds % CYCLE_DURATION_SECONDS;
    // We use (CYCLE_DURATION_SECONDS - 1) so progress hits 100% at 59s
    const progress = (secondsInCycle / (CYCLE_DURATION_SECONDS - 1)) * 100;
    const lizardPosition = `calc(${Math.min(progress, 100)}% - 56px)`; // Adjusted for w-28 (112px / 2 = 56px)

    const prevProgressRef = useRef<number>(0);
    useEffect(() => {
        prevProgressRef.current = progress;
    });

    // Check if a reset just happened to prevent animation from right to left
    const prevProgress = prevProgressRef.current ?? 0;
    const justReset = progress < 5 && prevProgress > 95;
    const transitionClass = justReset ? '' : 'transition-all duration-1000 linear';

    // Get the current lap number to reset food items
    const currentCycle = Math.floor(timeInSeconds / CYCLE_DURATION_SECONDS);

    return (
        <div className="mt-8 mb-2 px-4">
            <div className="relative h-16 w-full">
                {/* Track */}
                <div className="absolute bottom-4 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                
                {/* Food Items */}
                {FOOD_POSITIONS.map(pos => (
                    <FoodIcon 
                        key={`${currentCycle}-${pos}`} // Use cycle in key to force re-render
                        style={{
                            left: `${pos}%`,
                            bottom: '20px',
                            opacity: progress >= pos ? 0 : 1
                        }}
                    />
                ))}

                {/* Lizard */}
                <div 
                    className={`absolute bottom-0 ${transitionClass}`}
                    style={{ left: lizardPosition }}
                >
                    <Reptiloid />
                </div>
            </div>
        </div>
    );
};

export default LizardAnimation;