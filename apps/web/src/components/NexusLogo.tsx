import React from 'react';

interface NexusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  showSubtitle?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Custom Slashed Zero (Ø) Emblem
 * Precision geometric slashed zero representing Zero Blindspots, Zero Collisions.
 */
export const NexusLogoIcon: React.FC<{
  size?: number;
  className?: string;
  showSquircle?: boolean;
}> = ({ size = 38, className = '', showSquircle = true }) => {
  const idPrefix = React.useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Background Squircle Gradient */}
        <linearGradient id={`${idPrefix}-n0-bg`} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B132B" />
          <stop offset="100%" stopColor="#020817" />
        </linearGradient>

        {/* Crisp Border Gradient */}
        <linearGradient id={`${idPrefix}-n0-border`} x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.6" />
        </linearGradient>

        {/* Slashed Zero Mark Gradient */}
        <linearGradient id={`${idPrefix}-zero-mark`} x1="9" y1="35" x2="35" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>

        {/* Ambient Subtle Glow */}
        <filter id={`${idPrefix}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {showSquircle && (
        <>
          {/* Rounded Squircle Container */}
          <rect
            x="1.5"
            y="1.5"
            width="41"
            height="41"
            rx="10"
            fill={`url(#${idPrefix}-n0-bg)`}
            stroke={`url(#${idPrefix}-n0-border)`}
            strokeWidth="1.5"
          />

          {/* Subtle Inner Ambient Radiance */}
          <circle cx="22" cy="22" r="14" fill="#0284C7" fillOpacity="0.14" />
        </>
      )}

      {/* Slashed Zero (Ø): Primary Outer Ring */}
      <circle
        cx="22"
        cy="22"
        r="11.5"
        stroke={`url(#${idPrefix}-zero-mark)`}
        strokeWidth="4.2"
        filter={`url(#${idPrefix}-glow)`}
      />

      {/* Slashed Zero (Ø): 45-Degree Through-Slash Bar */}
      <line
        x1="9"
        y1="35"
        x2="35"
        y2="9"
        stroke={`url(#${idPrefix}-zero-mark)`}
        strokeWidth="3.8"
        strokeLinecap="round"
        filter={`url(#${idPrefix}-glow)`}
      />
    </svg>
  );
};

export const NexusLogo: React.FC<NexusLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  subtitle = 'Consolidated Institution Oversight & Grievance Coordination',
  onClick,
  className = ''
}) => {
  const isDark = variant === 'dark';

  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 48
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
    >
      {/* Visual Slashed Zero (Ø) Emblem */}
      <div className="relative group flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md group-hover:bg-cyan-400/35 transition-all duration-300" />
        <NexusLogoIcon size={iconSizes[size]} className="relative transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Brand Typography: Nexus 0 */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-black tracking-tight leading-none ${titleSizes[size]} ${
            isDark ? 'text-white' : 'text-nexus-navy'
          }`}
        >
          Nexus{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 font-extrabold">
            0
          </span>
        </span>

        {showSubtitle && (
          <span
            className={`text-[10px] font-medium leading-none mt-1 ${
              isDark ? 'text-slate-400 hidden sm:block' : 'text-nexus-navy-muted hidden sm:block'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
