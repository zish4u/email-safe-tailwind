import React from 'react';
import { CardProps } from './types';

export const Card: React.FC<CardProps> = ({
    children,
    padding = 'md',
    backgroundColor = '#ffffff',
    borderRadius = true,
    className = '',
    style = {},
    id,
}) => {
    const getPaddingClasses = () => {
        switch (padding) {
            case 'sm':
                return 'p-4';
            case 'md':
                return 'p-6';
            case 'lg':
                return 'p-8';
            default:
                return 'p-6';
        }
    };

    const borderClass = borderRadius ? 'rounded-lg' : '';

    const combinedClasses = `
    ${getPaddingClasses()}
    ${borderClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        backgroundColor,
        ...style,
    };

    return (
        <div
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        >
            {children}
        </div>
    );
};
