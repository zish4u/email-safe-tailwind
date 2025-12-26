import React from 'react';
import { ImageProps } from './types';

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    width,
    height,
    objectFit = 'cover',
    borderRadius,
    link,
    linkTarget = '_blank',
    fallbackColor,
    backgroundColor,
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

    const getVerticalAlignClass = () => {
        switch (verticalAlign) {
            case 'top':
                return 'align-top';
            case 'middle':
                return 'align-middle';
            case 'bottom':
                return 'align-bottom';
            default:
                return 'align-top';
        }
    };

    const combinedClasses = `
        block
        ${getAlignClass()}
        ${getVerticalAlignClass()}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    const imageStyles: React.CSSProperties = {
        width: typeof width === 'number' ? `${width}px` : width || 'auto',
        height: typeof height === 'number' ? `${height}px` : height || 'auto',
        maxWidth: maxWidth ? `${maxWidth}px` : undefined,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        minHeight: minHeight ? `${minHeight}px` : undefined,
        objectFit,
        borderRadius: typeof borderRadius === 'string' ? borderRadius : borderRadius ? '4px' : undefined,
        backgroundColor: fallbackColor || backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        boxShadow,
        ...getSpacingStyles(padding),
        ...getMarginStyles(margin),
        ...getBorderStyles(border),
        ...style,
    };

    const containerStyles: React.CSSProperties = {
        textAlign: align,
        ...getMarginStyles(margin),
    };

    const imageElement = (
        <img
            src={src}
            alt={alt}
            className={combinedClasses}
            style={imageStyles}
            id={id}
        />
    );

    // Wrap in link if provided
    if (link) {
        return (
            <a
                href={link}
                target={linkTarget}
                rel="noopener noreferrer"
                style={containerStyles}
            >
                {imageElement}
            </a>
        );
    }

    return (
        <div style={containerStyles}>
            {imageElement}
        </div>
    );
};
