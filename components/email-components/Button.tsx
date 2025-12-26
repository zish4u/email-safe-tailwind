import React from 'react';
import { ButtonProps } from './types';

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
    backgroundColor: bgColor,
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${widthClass}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const buttonStyles: React.CSSProperties = {
        backgroundColor: backgroundColor || (variant === 'primary' ? '#007bff' : variant === 'secondary' ? '#6c757d' : 'transparent'),
        color: textColor || (variant === 'outline' ? '#007bff' : '#ffffff'),
        borderColor: borderColor || (variant === 'primary' ? '#007bff' : variant === 'secondary' ? '#6c757d' : '#007bff'),
        borderWidth: `${borderWidth}px`,
        borderStyle,
        borderRadius: typeof borderRadius === 'string' ? borderRadius : borderRadius ? '4px' : undefined,
        width: fullWidth ? '100%' : typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        fontFamily,
        fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
        fontWeight,
        textAlign,
        textTransform,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        boxShadow,
        paddingTop: paddingY ? `${paddingY}px` : undefined,
        paddingBottom: paddingY ? `${paddingY}px` : undefined,
        paddingLeft: paddingX ? `${paddingX}px` : undefined,
        paddingRight: paddingX ? `${paddingX}px` : undefined,
        ...getSpacingStyles(padding),
        ...getMarginStyles(margin),
        ...getBorderStyles(border),
        ...style,
    };

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
