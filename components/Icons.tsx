import React from 'react';

// This is the Base64 encoded version of your xog.jpeg logo.
// By embedding the image data directly, we ensure it always loads
// without any issues related to file paths or server configuration.

export const LogoIcon: React.FC = () => (
  <div className="flex items-center space-x-3" aria-label="X-OG AI Football Analysis Logo">
    <div className="flex flex-col justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-white" style={{lineHeight: '1'}}></span>
        <span className="text-xs font-medium text-cyan-400 tracking-widest"></span>
    </div>
  </div>
);

export const ChevronLeftIcon: React.FC = () => (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

export const ChevronRightIcon: React.FC = () => (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={`h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export const ExternalLinkIcon: React.FC = () => (
    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);
