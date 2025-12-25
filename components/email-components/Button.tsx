import React from 'react';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
    children,
    href,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    target = '_self',
    className = '',
    style = {},
    id,
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 text-white border-blue-600';
            case 'secondary':
                return 'bg-gray-600 text-white border-gray-600';
            case 'outline':
                return 'bg-transparent text-blue-600 border-blue-600';
            default:
                return 'bg-blue-600 text-white border-blue-600';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'px-3 py-2 text-sm';
            case 'md':
                return 'px-6 py-3 text-base';
            case 'lg':
                return 'px-8 py-4 text-lg';
            default:
                return 'px-6 py-3 text-base';
        }
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = `
    inline-block
    text-center
    font-semibold
    rounded-lg
    border-2
    cursor-pointer
    transition-all
    hover:opacity-90
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        textDecoration: 'none',
        ...style,
    };

    if (href) {
        return (
            <a
                href={href}
                target={target}
                className={combinedClasses}
                style={combinedStyle}
                id={id}
            >
                {children}
            </a>
        );
    }

    return (
        <button
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        >
            {children}
        </button>
    );
};
