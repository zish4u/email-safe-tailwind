import React from 'react';
import { DividerProps } from './types';

export const Divider: React.FC<DividerProps> = ({
    color = '#e5e7eb',
    thickness = 'medium',
    spacing = 'md',
    className = '',
    style = {},
    id,
}) => {
    const getThicknessStyle = () => {
        switch (thickness) {
            case 'thin':
                return '1px';
            case 'medium':
                return '2px';
            case 'thick':
                return '4px';
            default:
                return '2px';
        }
    };

    const getSpacingClasses = () => {
        switch (spacing) {
            case 'sm':
                return 'my-4';
            case 'md':
                return 'my-6';
            case 'lg':
                return 'my-8';
            default:
                return 'my-6';
        }
    };

    const combinedClasses = `
    w-full
    border-0
    ${getSpacingClasses()}
    ${className}
  `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        backgroundColor: color,
        height: getThicknessStyle(),
        ...style,
    };

    return (
        <hr
            className={combinedClasses}
            style={combinedStyle}
            id={id}
        />
    );
};
