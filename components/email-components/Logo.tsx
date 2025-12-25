import React from 'react';
import { LogoProps } from './types';

export const Logo: React.FC<LogoProps> = ({
    src,
    alt,
    width,
    height,
    link,
    className = '',
    style = {},
    id,
}) => {
    const combinedClasses = `
    block
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        width,
        height,
        ...style,
    };

    const logoElement = (
        <img
            src={src}
            alt={alt}
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        />
    );

    if (link) {
        return (
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
            >
                {logoElement}
            </a>
        );
    }

    return logoElement;
};
