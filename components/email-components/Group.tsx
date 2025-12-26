import React from 'react';
import { GroupProps, SpacingProps, BorderProps } from './types';

export const Group: React.FC<GroupProps> = ({
    children,
    displayName,
    locked = false,
    direction = 'vertical',
    spacing = 10,
    align = 'start',
    justify = 'start',
    backgroundColor = 'transparent',
    backgroundImage,
    padding,
    margin,
    border,
    borderRadius,
    boxShadow,
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
            case 'start':
                return direction === 'horizontal' ? 'text-left' : 'align-start';
            case 'center':
                return direction === 'horizontal' ? 'text-center' : 'align-center';
            case 'end':
                return direction === 'horizontal' ? 'text-right' : 'align-end';
            case 'stretch':
                return 'align-stretch';
            default:
                return 'align-start';
        }
    };

    const getJustifyClass = () => {
        switch (justify) {
            case 'start':
                return 'justify-start';
            case 'center':
                return 'justify-center';
            case 'end':
                return 'justify-end';
            case 'between':
                return 'justify-between';
            case 'around':
                return 'justify-around';
            case 'evenly':
                return 'justify-evenly';
            default:
                return 'justify-start';
        }
    };

    const groupStyles: React.CSSProperties = {
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: backgroundImage ? 'cover' : undefined,
        backgroundPosition: backgroundImage ? 'center' : undefined,
        backgroundRepeat: backgroundImage ? 'no-repeat' : undefined,
        borderRadius,
        boxShadow,
        ...getSpacingStyles(padding),
        ...getMarginStyles(margin),
        ...getBorderStyles(border),
        ...style,
    };

    const combinedClasses = `
        block
        ${getAlignClass()}
        ${getJustifyClass()}
        ${locked ? 'group-locked' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // Render children with spacing
    const renderChildren = () => {
        if (!children) return null;

        const childArray = React.Children.toArray(children);

        return childArray.map((child, index) => {
            const childStyle: React.CSSProperties = {};

            if (direction === 'vertical' && index > 0) {
                childStyle.marginTop = `${spacing}px`;
            } else if (direction === 'horizontal' && index > 0) {
                childStyle.marginLeft = `${spacing}px`;
            }

            return (
                <div key={index} style={childStyle}>
                    {child}
                </div>
            );
        });
    };

    return (
        <div
            style={groupStyles}
            className={combinedClasses}
            id={id}
            data-group-name={displayName}
            data-group-locked={locked}
        >
            {renderChildren()}
        </div>
    );
};
