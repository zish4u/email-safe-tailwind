import React from 'react';
import { ImageProps } from './types';

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    width,
    height,
    fluid = false,
    borderRadius = false,
    className = '',
    style = {},
    id,
}) => {
    const getFluidClasses = () => {
        if (fluid) {
            return 'w-full h-auto';
        }
        return '';
    };

    const borderClass = borderRadius ? 'rounded-lg' : '';

    const combinedClasses = `
    block
    ${getFluidClasses()}
    ${borderClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        width: fluid ? '100%' : width,
        height: fluid ? 'auto' : height,
        maxWidth: fluid ? '100%' : width,
        ...style,
    };

    return (
        <img
            src={src}
            alt={alt}
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        />
    );
};
