import React from 'react';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'p',
    color = '#000000',
    align = 'left',
    fontWeight = 'normal',
    className = '',
    style = {},
    id,
}) => {
    const getTagAndClasses = () => {
        const baseClasses = `
      ${className}
    `.trim().replace(/\s+/g, ' ');

        switch (variant) {
            case 'h1':
                return {
                    tag: 'h1',
                    classes: `text-3xl font-bold ${baseClasses}`,
                };
            case 'h2':
                return {
                    tag: 'h2',
                    classes: `text-2xl font-bold ${baseClasses}`,
                };
            case 'h3':
                return {
                    tag: 'h3',
                    classes: `text-xl font-bold ${baseClasses}`,
                };
            case 'h4':
                return {
                    tag: 'h4',
                    classes: `text-lg font-bold ${baseClasses}`,
                };
            case 'p':
                return {
                    tag: 'p',
                    classes: `text-base ${baseClasses}`,
                };
            case 'small':
                return {
                    tag: 'small',
                    classes: `text-sm ${baseClasses}`,
                };
            default:
                return {
                    tag: 'p',
                    classes: `text-base ${baseClasses}`,
                };
        }
    };

    const getWeightClass = () => {
        switch (fontWeight) {
            case 'normal':
                return 'font-normal';
            case 'medium':
                return 'font-medium';
            case 'semibold':
                return 'font-semibold';
            case 'bold':
                return 'font-bold';
            default:
                return 'font-normal';
        }
    };

    const getAlignClass = () => {
        switch (align) {
            case 'left':
                return 'text-left';
            case 'center':
                return 'text-center';
            case 'right':
                return 'text-right';
            default:
                return 'text-left';
        }
    };

    const { tag: TagName, classes } = getTagAndClasses();
    const weightClass = getWeightClass();
    const alignClass = getAlignClass();

    const combinedClasses = `
        ${classes}
        ${weightClass}
        ${alignClass}
    `.trim().replace(/\s+/g, ' ');

    const combinedStyle = {
        color,
        ...style,
    };

    return React.createElement(
        TagName,
        {
            className: combinedClasses,
            style: combinedStyle,
            id: id,
        },
        children
    );
};
