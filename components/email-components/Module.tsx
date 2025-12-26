import React from 'react';
import { ModuleProps, SpacingProps, BorderProps } from './types';

export const Module: React.FC<ModuleProps> = ({
    children,
    fullWidth = true,
    maxWidth = 600,
    backgroundColor = '#ffffff',
    backgroundImage,
    padding,
    margin,
    border,
    borderRadius,
    boxShadow,
    containerWidth,
    align = 'left',
    verticalAlign = 'top',
    className = '',
    style = {},
    id,
}) => {
    const getSpacingStyles = (spacing?: SpacingProps): React.CSSProperties => {
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

    const getMarginStyles = (margin?: SpacingProps): React.CSSProperties => {
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

    const getBorderStyles = (border?: BorderProps): React.CSSProperties => {
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

        // Handle specific side borders
        if (border.side && border.side !== 'all') {
            // Reset all borders first
            styles.borderWidth = '0';
            styles.borderStyle = 'solid';

            const borderWidth = border.width ? `${border.width}px` : '1px';
            const borderStyle = border.style || 'solid';
            const borderColor = border.color || '#000000';

            switch (border.side) {
                case 'top':
                    styles.borderTop = `${borderWidth} ${borderStyle} ${borderColor}`;
                    break;
                case 'right':
                    styles.borderRight = `${borderWidth} ${borderStyle} ${borderColor}`;
                    break;
                case 'bottom':
                    styles.borderBottom = `${borderWidth} ${borderStyle} ${borderColor}`;
                    break;
                case 'left':
                    styles.borderLeft = `${borderWidth} ${borderStyle} ${borderColor}`;
                    break;
            }
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

    const moduleStyles: React.CSSProperties = {
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        borderRadius,
        boxShadow,
        width: fullWidth ? '100%' : `${maxWidth}px`,
        maxWidth: fullWidth ? `${maxWidth}px` : undefined,
        ...getSpacingStyles(padding),
        ...getMarginStyles(margin),
        ...getBorderStyles(border),
        ...style,
    };

    const containerStyles: React.CSSProperties = {
        width: containerWidth ? `${containerWidth}px` : '100%',
        maxWidth: containerWidth ? `${containerWidth}px` : undefined,
    };

    const combinedClasses = `
        block
        ${getAlignClass()}
        ${getVerticalAlignClass()}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <table
            width="100%"
            border={0}
            cellSpacing={0}
            cellPadding={0}
            style={containerStyles}
            className={combinedClasses}
            id={id}
        >
            <tr>
                <td
                    align={align}
                    valign={verticalAlign}
                    style={moduleStyles}
                >
                    {children}
                </td>
            </tr>
        </table>
    );
};
