// =====================================================
// Email Component Renderers - Email-Safe HTML Generation
// =====================================================

import React from 'react';
import {
    EmailComponent,
    ModuleComponent,
    GridComponent,
    GridItemComponent,
    GroupComponent,
    TextElement,
    ImageElement,
    ButtonElement,
    DividerElement,
    SpacerElement,
    SpacingProps,
    BorderProps,
    BoxShadowProps,
    BackgroundImageProps
} from '../advanced-types';

// ==================== UTILITY FUNCTIONS ====================

const getSpacingValue = (spacing: SpacingProps | undefined): string => {
    if (!spacing) return '';

    const { top, right, bottom, left, horizontal, vertical, all } = spacing;

    if (all !== undefined) return `${all}px`;

    const t = top ?? vertical ?? 0;
    const r = right ?? horizontal ?? 0;
    const b = bottom ?? vertical ?? 0;
    const l = left ?? horizontal ?? 0;

    return `${t}px ${r}px ${b}px ${l}px`;
};

const getBorderValue = (border: BorderProps | undefined): string => {
    if (!border) return '';

    const { width = 1, color = '#000000', style = 'solid', side = 'all' } = border;
    const borderValue = `${width}px ${style} ${color}`;

    switch (side) {
        case 'top': return `border-top: ${borderValue};`;
        case 'right': return `border-right: ${borderValue};`;
        case 'bottom': return `border-bottom: ${borderValue};`;
        case 'left': return `border-left: ${borderValue};`;
        default: return `border: ${borderValue};`;
    }
};

const getBoxShadowValue = (shadow: BoxShadowProps | undefined): string => {
    if (!shadow) return '';

    const { x = 0, y = 0, blur = 0, spread = 0, color = '#000000', inset = false } = shadow;
    const shadowValue = `${x}px ${y}px ${blur}px ${spread}px ${color}${inset ? ' inset' : ''}`;

    return `box-shadow: ${shadowValue};`;
};

const getBackgroundStyle = (bg: BackgroundImageProps | undefined): string => {
    if (!bg) return '';

    const { url, position = 'center', repeat = 'no-repeat', size = 'cover', overlay } = bg;
    let styles = `
        background-image: url(${url});
        background-position: ${position};
        background-repeat: ${repeat};
        background-size: ${size};
    `;

    if (overlay) {
        styles += `
            background-color: ${overlay.color};
            background-blend-mode: overlay;
        `;
    }

    return styles;
};

// ==================== MODULE RENDERER ====================

export const ModuleRenderer: React.FC<{
    component: ModuleComponent;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    children?: React.ReactNode;
}> = ({ component, isSelected, onSelect, children }) => {
    const { props } = component;
    const styles = `
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.backgroundImage ? getBackgroundStyle(props.backgroundImage) : ''}
        ${props.maxWidth ? `max-width: ${props.maxWidth}px;` : ''}
        ${props.align ? `text-align: ${props.align};` : ''}
    `;

    return (
        <div
            className={`email-module ${isSelected ? 'selected' : ''}`}
            style={{
                width: props.fullWidth ? '100%' : 'auto',
                ...parseInlineStyles(styles)
            }}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Module"
        >
            <table
                width={props.fullWidth ? "100%" : props.maxWidth || 600}
                border={0}
                cellSpacing={0}
                cellPadding={0}
                align={props.align || "center"}
                style={{
                    width: props.fullWidth ? "100%" : props.maxWidth || 600,
                    maxWidth: props.maxWidth || 600,
                    ...parseInlineStyles(styles)
                }}
            >
                <tbody>
                    <tr>
                        <td style={{ ...parseInlineStyles(styles) }}>
                            {children}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// ==================== GRID RENDERER ====================

export const GridRenderer: React.FC<{
    component: GridComponent;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    children?: React.ReactNode;
}> = ({ component, isSelected, onSelect, children }) => {
    const { props } = component;
    const columnWidth = Math.floor(100 / props.columns);

    const styles = `
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.backgroundImage ? getBackgroundStyle(props.backgroundImage) : ''}
    `;

    return (
        <div
            className={`email-grid ${isSelected ? 'selected' : ''}`}
            style={parseInlineStyles(styles)}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Grid"
        >
            <table
                width="100%"
                border={0}
                cellSpacing={props.columnSpacing || 0}
                cellPadding={0}
                style={{
                    width: "100%",
                    ...parseInlineStyles(styles)
                }}
            >
                <tbody>
                    <tr>
                        {React.Children.map(children, (child, index) => (
                            <td
                                key={index}
                                width={`${columnWidth}%`}
                                valign="top"
                                style={{
                                    width: `${columnWidth}%`,
                                    verticalAlign: "top",
                                    padding: `${props.columnSpacing || 0}px`
                                }}
                            >
                                {child}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// ==================== GRID ITEM RENDERER ====================

export const GridItemRenderer: React.FC<{
    component: GridItemComponent;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    children?: React.ReactNode;
}> = ({ component, isSelected, onSelect, children }) => {
    const { props } = component;

    const styles = `
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.backgroundImage ? getBackgroundStyle(props.backgroundImage) : ''}
        ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
        ${props.textAlign ? `text-align: ${props.textAlign};` : ''}
        ${props.width ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.minWidth ? `min-width: ${props.minWidth}px;` : ''}
        ${props.maxWidth ? `max-width: ${props.maxWidth}px;` : ''}
    `;

    return (
        <div
            className={`email-grid-item ${isSelected ? 'selected' : ''}`}
            style={parseInlineStyles(styles)}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="GridItem"
        >
            <table
                width="100%"
                border={0}
                cellSpacing={0}
                cellPadding={0}
                style={{
                    width: "100%",
                    ...parseInlineStyles(styles)
                }}
            >
                <tbody>
                    <tr>
                        <td
                            valign={props.verticalAlign || "top"}
                            align={props.textAlign || "left"}
                            style={{
                                verticalAlign: props.verticalAlign || "top",
                                textAlign: props.textAlign || "left",
                                ...parseInlineStyles(styles)
                            }}
                        >
                            {children}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// ==================== GROUP RENDERER ====================

export const GroupRenderer: React.FC<{
    component: GroupComponent;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    children?: React.ReactNode;
}> = ({ component, isSelected, onSelect, children }) => {
    const { props } = component;

    const styles = `
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.backgroundImage ? getBackgroundStyle(props.backgroundImage) : ''}
    `;

    const isHorizontal = props.direction === 'horizontal';
    const spacing = props.spacing || 10;

    return (
        <div
            className={`email-group ${isSelected ? 'selected' : ''}`}
            style={{
                display: isHorizontal ? 'flex' : 'block',
                flexDirection: isHorizontal ? 'row' : 'column',
                gap: `${spacing}px`,
                alignItems: props.align || 'stretch',
                justifyContent: props.justify || 'flex-start',
                ...parseInlineStyles(styles)
            }}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Group"
        >
            {children}
        </div>
    );
};

// ==================== TEXT ELEMENT RENDERER ====================

export const TextRenderer: React.FC<{
    component: TextElement;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    isEditing?: boolean;
    onEdit?: (id: string, content: string) => void;
}> = ({ component, isSelected, onSelect, isEditing, onEdit }) => {
    const { props } = component;

    const styles = `
        ${props.color ? `color: ${props.color};` : ''}
        ${props.fontSize ? `font-size: ${typeof props.fontSize === 'number' ? props.fontSize + 'px' : props.fontSize};` : ''}
        ${props.fontFamily ? `font-family: ${props.fontFamily};` : ''}
        ${props.fontWeight ? `font-weight: ${props.fontWeight};` : ''}
        ${props.lineHeight ? `line-height: ${typeof props.lineHeight === 'number' ? props.lineHeight : props.lineHeight};` : ''}
        ${props.letterSpacing ? `letter-spacing: ${typeof props.letterSpacing === 'number' ? props.letterSpacing + 'px' : props.letterSpacing};` : ''}
        ${props.textAlign ? `text-align: ${props.textAlign};` : ''}
        ${props.textTransform ? `text-transform: ${props.textTransform};` : ''}
        ${props.textDecoration ? `text-decoration: ${props.textDecoration};` : ''}
        ${props.fontStyle ? `font-style: ${props.fontStyle};` : ''}
        ${props.textShadow ? `text-shadow: ${props.textShadow};` : ''}
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.width ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.minWidth ? `min-width: ${props.minWidth}px;` : ''}
        ${props.maxWidth ? `max-width: ${props.maxWidth}px;` : ''}
        ${props.height ? `height: ${typeof props.height === 'number' ? props.height + 'px' : props.height};` : ''}
        ${props.minHeight ? `min-height: ${props.minHeight}px;` : ''}
        ${props.maxHeight ? `max-height: ${props.maxHeight}px;` : ''}
        ${props.align ? `text-align: ${props.align};` : ''}
        ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
    `;

    if (isEditing) {
        return (
            <textarea
                className={`email-text-element editing ${isSelected ? 'selected' : ''}`}
                value={props.content}
                onChange={(e) => onEdit?.(component.id, e.target.value)}
                onBlur={() => onEdit?.(component.id, props.content)}
                style={{
                    width: '100%',
                    minHeight: '40px',
                    resize: 'vertical',
                    border: '1px solid #007bff',
                    borderRadius: '4px',
                    padding: '8px',
                    ...parseInlineStyles(styles)
                }}
                autoFocus
            />
        );
    }

    return (
        <div
            className={`email-text-element ${isSelected ? 'selected' : ''}`}
            style={parseInlineStyles(styles)}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Text"
        >
            {props.content || props.placeholder || 'Your text here'}
        </div>
    );
};

// ==================== IMAGE ELEMENT RENDERER ====================

export const ImageRenderer: React.FC<{
    component: ImageElement;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}> = ({ component, isSelected, onSelect }) => {
    const { props } = component;

    const containerStyles = `
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.width ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.minWidth ? `min-width: ${props.minWidth}px;` : ''}
        ${props.maxWidth ? `max-width: ${props.maxWidth}px;` : ''}
        ${props.height ? `height: ${typeof props.height === 'number' ? props.height + 'px' : props.height};` : ''}
        ${props.minHeight ? `min-height: ${props.minHeight}px;` : ''}
        ${props.maxHeight ? `max-height: ${props.maxHeight}px;` : ''}
        ${props.align ? `text-align: ${props.align};` : ''}
        ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
    `;

    const imageStyles = `
        ${props.width ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.height ? `height: ${typeof props.height === 'number' ? props.height + 'px' : props.height};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${props.objectFit ? `object-fit: ${props.objectFit};` : ''}
        border: 0;
    `;

    const imageElement = (
        <img
            src={props.src}
            alt={props.alt}
            title={props.title}
            style={parseInlineStyles(imageStyles)}
        />
    );

    return (
        <div
            className={`email-image-element ${isSelected ? 'selected' : ''}`}
            style={parseInlineStyles(containerStyles)}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Image"
        >
            {props.link ? (
                <a
                    href={props.link}
                    target={props.linkTarget || '_blank'}
                    style={{ textDecoration: 'none' }}
                >
                    {imageElement}
                </a>
            ) : (
                imageElement
            )}
        </div>
    );
};

// ==================== BUTTON ELEMENT RENDERER ====================

export const ButtonRenderer: React.FC<{
    component: ButtonElement;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}> = ({ component, isSelected, onSelect }) => {
    const { props } = component;

    const styles = `
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
        ${props.textColor ? `color: ${props.textColor};` : ''}
        ${getSpacingValue({
        all: 0,
        top: props.paddingY,
        bottom: props.paddingY,
        left: props.paddingX,
        right: props.paddingX
    }) ? `padding: ${getSpacingValue({
        all: 0,
        top: props.paddingY,
        bottom: props.paddingY,
        left: props.paddingX,
        right: props.paddingX
    })};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.borderRadius ? `border-radius: ${props.borderRadius};` : ''}
        ${props.borderColor ? `border-color: ${props.borderColor};` : ''}
        ${props.borderWidth ? `border-width: ${props.borderWidth}px;` : ''}
        ${props.borderStyle ? `border-style: ${props.borderStyle};` : ''}
        ${getBorderValue(props.border)}
        ${getBoxShadowValue(props.boxShadow)}
        ${props.fontFamily ? `font-family: ${props.fontFamily};` : ''}
        ${props.fontSize ? `font-size: ${typeof props.fontSize === 'number' ? props.fontSize + 'px' : props.fontSize};` : ''}
        ${props.fontWeight ? `font-weight: ${props.fontWeight};` : ''}
        ${props.textTransform ? `text-transform: ${props.textTransform};` : ''}
        ${props.width && props.width !== 'auto' ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.height && props.height !== 'auto' ? `height: ${typeof props.height === 'number' ? props.height + 'px' : props.height};` : ''}
        ${props.fullWidth ? `width: 100%;` : ''}
        ${props.align ? `text-align: ${props.align};` : ''}
        ${props.verticalAlign ? `vertical-align: ${props.verticalAlign};` : ''}
        ${props.disabled ? `opacity: 0.6; cursor: not-allowed;` : 'cursor: pointer;'}
        display: inline-block;
        text-decoration: none;
        transition: all 0.2s ease;
    `;

    const buttonElement = (
        <span
            style={parseInlineStyles(styles)}
        >
            {props.text}
        </span>
    );

    return (
        <div
            className={`email-button-element ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Button"
            style={{ textAlign: props.align || 'center' }}
        >
            {props.link && !props.disabled ? (
                <a
                    href={props.link}
                    target={props.linkTarget || '_blank'}
                    style={{ textDecoration: 'none' }}
                >
                    {buttonElement}
                </a>
            ) : (
                buttonElement
            )}
        </div>
    );
};

// ==================== DIVIDER ELEMENT RENDERER ====================

export const DividerRenderer: React.FC<{
    component: DividerElement;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}> = ({ component, isSelected, onSelect }) => {
    const { props } = component;

    const containerStyles = `
        ${getSpacingValue({ all: 0, ...props.padding }) ? `padding: ${getSpacingValue(props.padding)};` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.align ? `text-align: ${props.align};` : ''}
        ${props.width && props.width !== 'auto' ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.align === 'center' && !props.width ? 'width: 100%;' : ''}
    `;

    const dividerStyles = `
        ${props.color ? `background-color: ${props.color};` : ''}
        ${props.height ? `height: ${props.height}px;` : ''}
        ${props.style ? `border-style: ${props.style};` : ''}
        ${props.style && props.style !== 'solid' ? `border-bottom: ${props.height || 1}px ${props.style} ${props.color || '#e0e0e0'};` : ''}
    `;

    return (
        <div
            className={`email-divider-element ${isSelected ? 'selected' : ''}`}
            style={parseInlineStyles(containerStyles)}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Divider"
        >
            {props.text ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, ...parseInlineStyles(dividerStyles) }} />
                    <span
                        style={{
                            color: props.textColor || '#666',
                            backgroundColor: props.textBackgroundColor || 'transparent',
                            padding: `${props.textPadding || 0}px`,
                            fontSize: '14px'
                        }}
                    >
                        {props.text}
                    </span>
                    <div style={{ flex: 1, ...parseInlineStyles(dividerStyles) }} />
                </div>
            ) : (
                <div style={parseInlineStyles(dividerStyles)} />
            )}
        </div>
    );
};

// ==================== SPACER ELEMENT RENDERER ====================

export const SpacerRenderer: React.FC<{
    component: SpacerElement;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}> = ({ component, isSelected, onSelect }) => {
    const { props } = component;

    const styles = `
        ${props.width ? `width: ${typeof props.width === 'number' ? props.width + 'px' : props.width};` : ''}
        ${props.height ? `height: ${props.height}px;` : ''}
        ${getSpacingValue({ all: 0, ...props.margin }) ? `margin: ${getSpacingValue(props.margin)};` : ''}
        ${props.backgroundColor ? `background-color: ${props.backgroundColor};` : ''}
    `;

    return (
        <div
            className={`email-spacer-element ${isSelected ? 'selected' : ''}`}
            style={{
                ...parseInlineStyles(styles),
                ...(props.showInEditor && {
                    background: `repeating-linear-gradient(
                        45deg,
                        ${props.editorColor || '#f0f0f0'},
                        ${props.editorColor || '#f0f0f0'} 10px,
                        transparent 10px,
                        transparent 20px
                    )`
                })
            }}
            onClick={() => onSelect?.(component.id)}
            data-component-id={component.id}
            data-component-type="Spacer"
        >
            &nbsp;
        </div>
    );
};

// ==================== HELPER FUNCTIONS ====================

const parseInlineStyles = (styles: string): React.CSSProperties => {
    const styleObject: React.CSSProperties = {};

    if (!styles) return styleObject;

    const declarations = styles.split(';').filter(s => s.trim());

    declarations.forEach(declaration => {
        const [property, value] = declaration.split(':').map(s => s.trim());
        if (property && value) {
            // Convert CSS property to React style property
            const reactProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

            // Handle numeric values for certain properties
            if (['width', 'height', 'margin', 'padding', 'fontSize', 'lineHeight'].includes(reactProperty)) {
                if (value.endsWith('px')) {
                    (styleObject as any)[reactProperty] = parseInt(value);
                } else {
                    (styleObject as any)[reactProperty] = value;
                }
            } else {
                (styleObject as any)[reactProperty] = value;
            }
        }
    });

    return styleObject;
};

// ==================== MAIN COMPONENT RENDERER ====================

export const renderEmailComponent = (component: EmailComponent, props: {
    isSelected?: boolean;
    onSelect?: (id: string) => void;
    isEditing?: boolean;
    onEdit?: (id: string, content: string) => void;
}): React.ReactNode => {
    const { isSelected, onSelect, isEditing, onEdit } = props;

    switch (component.type) {
        case 'Module':
            return (
                <ModuleRenderer
                    component={component as ModuleComponent}
                    isSelected={isSelected}
                    onSelect={onSelect}
                >
                    {component.children?.map((child, index) =>
                        renderEmailComponent(child, props)
                    )}
                </ModuleRenderer>
            );

        case 'Grid':
            return (
                <GridRenderer
                    component={component as GridComponent}
                    isSelected={isSelected}
                    onSelect={onSelect}
                >
                    {component.children?.map((child, index) =>
                        renderEmailComponent(child, props)
                    )}
                </GridRenderer>
            );

        case 'GridItem':
            return (
                <GridItemRenderer
                    component={component as GridItemComponent}
                    isSelected={isSelected}
                    onSelect={onSelect}
                >
                    {component.children?.map((child, index) =>
                        renderEmailComponent(child, props)
                    )}
                </GridItemRenderer>
            );

        case 'Group':
            return (
                <GroupRenderer
                    component={component as GroupComponent}
                    isSelected={isSelected}
                    onSelect={onSelect}
                >
                    {component.children?.map((child, index) =>
                        renderEmailComponent(child, props)
                    )}
                </GroupRenderer>
            );

        case 'Text':
            return (
                <TextRenderer
                    component={component as TextElement}
                    isSelected={isSelected}
                    onSelect={onSelect}
                    isEditing={isEditing}
                    onEdit={onEdit}
                />
            );

        case 'Image':
            return (
                <ImageRenderer
                    component={component as ImageElement}
                    isSelected={isSelected}
                    onSelect={onSelect}
                />
            );

        case 'Button':
            return (
                <ButtonRenderer
                    component={component as ButtonElement}
                    isSelected={isSelected}
                    onSelect={onSelect}
                />
            );

        case 'Divider':
            return (
                <DividerRenderer
                    component={component as DividerElement}
                    isSelected={isSelected}
                    onSelect={onSelect}
                />
            );

        case 'Spacer':
            return (
                <SpacerRenderer
                    component={component as SpacerElement}
                    isSelected={isSelected}
                    onSelect={onSelect}
                />
            );

        default:
            console.warn(`Unknown component type: ${(component as any).type}`);
            return (
                <div style={{ padding: '10px', border: '1px dashed red' }}>
                    Unknown component: {(component as any).type}
                </div>
            );
    }
};
