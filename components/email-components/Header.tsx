import React from 'react';
import { HeaderProps } from './types';
import { Logo } from './Logo';

export const Header: React.FC<HeaderProps> = ({
    logo,
    title,
    subtitle,
    backgroundColor = '#ffffff',
    textColor = '#000000',
    className = '',
    style = {},
    id,
}) => {
    const combinedClasses = `
    w-full
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        backgroundColor,
        color: textColor,
        ...style,
    };

    return (
        <header
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        >
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col items-center text-center">
                    {logo && (
                        <div className="mb-4">
                            <Logo
                                src={logo}
                                alt="Company Logo"
                                width={120}
                                height={40}
                            />
                        </div>
                    )}
                    {title && (
                        <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                            {title}
                        </h1>
                    )}
                    {subtitle && (
                        <p className="text-lg opacity-80" style={{ color: textColor }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </header>
    );
};
