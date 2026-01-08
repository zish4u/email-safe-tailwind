/**
 * Canvas Component Renderer
 * 
 * Recursively renders email components with email-safe HTML and inline styles.
 */

'use client';

import React from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import { useBuilderStore } from '../store';
import type { ComponentNode, StyleProperties } from '../types';

interface CanvasComponentProps {
    component: ComponentNode;
    parentId?: string;
}

/**
 * Convert style object to inline CSS string
 */
const stylesToInlineCSS = (styles: StyleProperties): React.CSSProperties => {
    const cssStyles: React.CSSProperties = {};

    Object.entries(styles).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // Convert kebab-case to camelCase for React
            const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            (cssStyles as any)[camelKey] = value;
        }
    });

    return cssStyles;
};

/**
 * Individual component renderer
 */
export default function CanvasComponent({ component, parentId }: CanvasComponentProps) {
    const selectedId = useBuilderStore((state) => state.selectedId);
    const selectComponent = useBuilderStore((state) => state.selectComponent);
    const deleteComponent = useBuilderStore((state) => state.deleteComponent);

    const isSelected = selectedId === component.id;
    const canHaveChildren = ['section', 'column'].includes(component.type);

    // Draggable
    const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
        id: component.id,
        data: {
            type: 'canvas',
            componentId: component.id,
            component,
        },
    });

    // Droppable (if can have children)
    const { setNodeRef: setDropRef } = useDroppable({
        id: `drop-${component.id}`,
        data: {
            type: 'canvas',
            parentId: component.id,
            accepts: canHaveChildren,
        },
        disabled: !canHaveChildren,
    });

    const inlineStyles = stylesToInlineCSS(component.styles);

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectComponent(component.id);
    };

    // Handle delete
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteComponent(component.id);
    };

    // Render component based on type
    const renderComponent = () => {
        switch (component.type) {
            case 'text': {
                const Tag = component.props.tag || 'p';
                return (
                    <Tag
                        dangerouslySetInnerHTML={{ __html: component.props.content || 'Text...' }}
                        style={inlineStyles}
                    />
                );
            }

            case 'image':
                return (
                    <img
                        src={component.props.src || 'https://via.placeholder.com/600x400'}
                        alt={component.props.alt || 'Image'}
                        style={{
                            ...inlineStyles,
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                );

            case 'button': {
                const align = inlineStyles.textAlign || 'center';
                return (
                    <table border={0} cellPadding={0} cellSpacing={0} role="presentation" width="100%">
                        <tr>
                            <td align={align as 'left' | 'center' | 'right'}>
                                <table border={0} cellPadding={0} cellSpacing={0} role="presentation">
                                    <tr>
                                        <td style={inlineStyles}>
                                            <a
                                                href={component.props.href || '#'}
                                                target={component.props.target || '_blank'}
                                                style={{
                                                    color: inlineStyles.color,
                                                    textDecoration: 'none',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {component.props.text || 'Button'}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                );
            }

            case 'spacer':
                return (
                    <div
                        style={{
                            height: component.props.height || '20px',
                            lineHeight: component.props.height || '20px',
                            fontSize: '1px',
                        }}
                    >
                        &nbsp;
                    </div>
                );

            case 'divider':
                return (
                    <hr
                        style={{
                            ...inlineStyles,
                            border: 'none',
                            borderTop: `${component.props.thickness || '1px'} ${component.props.style || 'solid'} ${inlineStyles.borderColor || '#ddd'}`,
                        }}
                    />
                );

            case 'section': {
                // Check if children are columns to wrap them in a row
                const hasColumns = component.children?.some(child => child.type === 'column');

                return (
                    <table
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        role="presentation"
                        width="100%"
                        style={inlineStyles}
                    >
                        {hasColumns ? (
                            // If has columns, wrap them in a single row for horizontal layout
                            <tr ref={canHaveChildren ? setDropRef : undefined}>
                                {component.children?.map((child) => (
                                    <CanvasComponent key={child.id} component={child} parentId={component.id} />
                                ))}
                            </tr>
                        ) : (
                            // Otherwise, render children normally (vertically stacked)
                            <tr>
                                <td ref={canHaveChildren ? setDropRef : undefined}>
                                    {component.children && component.children.length > 0 ? (
                                        component.children.map((child) => (
                                            <CanvasComponent key={child.id} component={child} parentId={component.id} />
                                        ))
                                    ) : (
                                        <div className="min-h-[80px] flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 text-sm">
                                            Drop components here
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </table>
                );
            }

            case 'column':
                return (
                    <td
                        ref={canHaveChildren ? setDropRef : undefined}
                        style={inlineStyles}
                        width={component.props.width || '50%'}
                    >
                        {component.children && component.children.length > 0 ? (
                            component.children.map((child) => (
                                <CanvasComponent key={child.id} component={child} parentId={component.id} />
                            ))
                        ) : (
                            <div className="min-h-[60px] flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400 text-xs">
                                Drop here
                            </div>
                        )}
                    </td>
                );

            default:
                return (
                    <div style={inlineStyles}>
                        <p className="text-gray-500 text-sm">Component: {component.type}</p>
                    </div>
                );
        }
    };

    return (
        <div
            ref={setDragRef}
            className={`relative group ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={handleClick}
        >
            {/* Selection Overlay */}
            {isSelected && (
                <div className="absolute inset-0 border-2 border-purple-500 pointer-events-none z-10">
                    <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-t flex items-center gap-2">
                        <span className="font-medium">{component.name}</span>
                        <button
                            onClick={handleDelete}
                            className="pointer-events-auto hover:bg-purple-600 p-0.5 rounded"
                        >
                            <Icons.X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}

            {/* Hover Overlay */}
            {!isSelected && (
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-5">
                    <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t opacity-0 group-hover:opacity-100">
                        {component.name}
                    </div>
                </div>
            )}

            {/* Drag Handle */}
            <div
                {...listeners}
                {...attributes}
                className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-move z-20"
            >
                <Icons.GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            {/* Component Content */}
            <div className={component.hidden ? 'opacity-30' : ''}>
                {renderComponent()}
            </div>
        </div>
    );
}
