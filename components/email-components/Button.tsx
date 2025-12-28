import React from 'react';
import { ButtonProps } from './types';
import { SpacingProps, BorderProps } from './types';

export const Button: React.FC<ButtonProps> = ({
    text,
    href,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    target = '_self',
    backgroundColor,
    hoverBackgroundColor,
    textColor,
    hoverTextColor,
    borderColor,
    borderWidth = 0,
    borderStyle = 'solid',
    borderRadius,
    width = 'auto',
    height = 'auto',
    paddingX,
    paddingY,
    fontFamily,
    fontSize,
    fontWeight = 'normal',
    textAlign = 'center',
    textTransform = 'none',
    link,
    linkTarget = '_blank',
    disabled = false,
    backgroundImage,
    padding,
    margin,
    border,
    boxShadow,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    align = 'left',
    verticalAlign = 'top',
    className = '',
    style = {},
    id,
}) => {
    // Memoized style calculations to prevent unnecessary re-renders
    const getSpacingStyles = React.useCallback((spacing?: SpacingProps): React.CSSProperties => {
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
    }, []);

    const getMarginStyles = React.useCallback((margin?: SpacingProps): React.CSSProperties => {
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
    }, []);

    const getBorderStyles = React.useCallback((border?: BorderProps): React.CSSProperties => {
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
    }, []);

    const getVariantClasses = React.useCallback(() => {
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
    }, [variant]);

    const getSizeClasses = React.useCallback(() => {
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
    }, [size]);

    // Memoize the final styles to prevent unnecessary recalculations
    const buttonStyles = React.useMemo(() => {
        const spacingStyles = getSpacingStyles(padding);
        const marginStyles = getMarginStyles(margin);
        const borderStyles = getBorderStyles(border);

        return {
            ...spacingStyles,
            ...marginStyles,
            ...borderStyles,
            backgroundColor,
            backgroundImage,
            boxShadow,
            width: width !== 'auto' ? width : undefined,
            height: height !== 'auto' ? height : undefined,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            fontFamily,
            fontSize,
            fontWeight,
            textAlign,
            textTransform,
            borderRadius,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...style,
        };
    }, [padding, margin, border, backgroundColor, backgroundImage, boxShadow, width, height, minWidth, maxWidth, minHeight, maxHeight, fontFamily, fontSize, fontWeight, textAlign, textTransform, borderRadius, disabled, style, getSpacingStyles, getMarginStyles, getBorderStyles]);

    const widthClass = fullWidth ? 'w-full' : '';
    const variantClasses = getVariantClasses();
    const sizeClasses = getSizeClasses();

    const combinedClasses = `
        inline-block
        text-center
        font-semibold
        rounded-lg
        border-2
        cursor-pointer
        transition-all
        hover:opacity-90
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${variantClasses}
        ${sizeClasses}
        ${widthClass}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const buttonContent = text || 'Button';
    const buttonLink = link || href;
    const buttonTarget = linkTarget || target;

    // Render as link if href/link is provided
    if (buttonLink) {
        return (
            <a
                href={buttonLink}
                target={buttonTarget}
                rel="noopener noreferrer"
                className={combinedClasses}
                style={buttonStyles}
                id={id}
            >
                {buttonContent}
            </a>
        );
    }

    // Render as button element
    return (
        <button
            className={combinedClasses}
            style={buttonStyles}
            id={id}
            disabled={disabled}
        >
            {buttonContent}
        </button>
    );
};
