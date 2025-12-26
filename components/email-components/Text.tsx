import React from 'react';
import { TextProps } from './types';

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'p',
    color = '#000000',
    align = 'left',
    fontWeight = 'normal',
    fontFamily = 'Arial, sans-serif',
    fontSize = 14,
    lineHeight = 1.5,
    letterSpacing,
    textAlign = 'left',
    textTransform = 'none',
    textDecoration = 'none',
    fontStyle = 'normal',
    textShadow,
    backgroundColor,
    backgroundImage,
    padding,
    margin,
    border,
    borderRadius,
    boxShadow,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    verticalAlign = 'top',
    className = '',
    style = {},
    id,
}) => {
    const getSpacingStyles = (spacing?: any): React.CSSProperties => {
        if (!spacing) return {};

        const styles: React.CSSProperties = {};

        if (spacing.all !== undefined) {
            styles.padding = `${spacing.all}px`;
        } else {
            if (spacing.top) styles.paddingTop = `${spacing.top}px`;
            if (spacing.right) styles.paddingRight = `${spacing.right}px`;
            if (spacing.bottom) styles.paddingBottom = `${spacing.bottom}px`;
            if (spacing.left) styles.paddingLeft = `${spacing.left}px`;
            if (spacing.horizontal) {
                styles.paddingLeft = `${spacing.horizontal}px`;
                styles.paddingRight = `${spacing.horizontal}px`;
            }
            if (spacing.vertical) {
                styles.paddingTop = `${spacing.vertical}px`;
                styles.paddingBottom = `${spacing.vertical}px`;
            }
        }

        return styles;
    };

    const getMarginStyles = (margin?: any): React.CSSProperties => {
        if (!margin) return {};

        const styles: React.CSSProperties = {};

        if (margin.all !== undefined) {
            styles.margin = `${margin.all}px`;
        } else {
            if (margin.top) styles.marginTop = `${margin.top}px`;
            if (margin.right) styles.marginRight = `${margin.right}px`;
            if (margin.bottom) styles.marginBottom = `${margin.bottom}px`;
            if (margin.left) styles.marginLeft = `${margin.left}px`;
            if (margin.horizontal) {
                styles.marginLeft = `${margin.horizontal}px`;
                styles.marginRight = `${margin.horizontal}px`;
            }
            if (margin.vertical) {
                styles.marginTop = `${margin.vertical}px`;
                styles.marginBottom = `${margin.vertical}px`;
            }
        }

        return styles;
    };

    const getBorderStyles = (border?: any): React.CSSProperties => {
        if (!border) return {};

        const styles: React.CSSProperties = {};

        if (border.width) {
            styles.borderWidth = `${border.width}px`;
        }
        if (border.color) {
            styles.borderColor = border.color;
        }
        if (border.style) {
            styles.borderStyle = border.style;
        }

        return styles;
    };

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
        fontFamily,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        lineHeight: typeof lineHeight === 'number' ? lineHeight.toString() : lineHeight,
        letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
        textAlign,
        textTransform,
        textDecoration,
        fontStyle,
        textShadow,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        borderRadius,
        boxShadow,
        width: typeof width === 'number' ? `${width}px` : width,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        height: typeof height === 'number' ? `${height}px` : height,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        ...getSpacingStyles(padding),
        ...getMarginStyles(margin),
        ...getBorderStyles(border),
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
