import React from 'react';
import { SectionProps } from './types';

export const Section: React.FC<SectionProps> = ({
    children,
    backgroundColor = '#ffffff',
    padding = 'md',
    maxWidth = '6xl',
    className = '',
    style = {},
    id,
}) => {
    const getPaddingClasses = () => {
        switch (padding) {
            case 'sm':
                return 'py-8';
            case 'md':
                return 'py-12';
            case 'lg':
                return 'py-16';
            default:
                return 'py-12';
        }
    };

    const maxWidthClass = `max-w-${maxWidth}`;

    const combinedClasses = `
    w-full
    ${getPaddingClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        backgroundColor,
        ...style,
    };

    return (
        <section
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        >
            <div className={`${maxWidthClass} mx-auto px-6`}>
                {children}
            </div>
        </section>
    );
};
