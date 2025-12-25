"use client";
import React, { memo, useCallback } from 'react';
import {
    TemplateComponent,
    CANVAS_SIZES,
    GRID_SIZE,
    SAFE_AREA_PADDING,
    PreviewMode,
    isContainerType,
    getDefaultComponentSize,
} from '../types';
import { DragGuides } from '../hooks/useCanvasInteractions';

interface BuilderCanvasProps {
    components: TemplateComponent[];
    selectedComponent: string | null;
    previewMode: PreviewMode;
    canvasScale: number;
    showGrid: boolean;
    snapToGrid: boolean;
    isDragging: boolean;
    isResizing: boolean;
    dragGuides: DragGuides | null;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    inlineEditing: string | null;
    onSelectComponent: (id: string | null) => void;
    onDeleteComponent: (id: string) => void;
    onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
    onAddComponent: (type: string, parentId?: string, position?: { x: number; y: number }) => void;
    onComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
    onResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
    onCanvasMouseMove: (e: React.MouseEvent) => void;
    onCanvasMouseUp: () => void;
    onSetInlineEditing: (id: string | null) => void;
    onOpenEditor: (component: TemplateComponent) => void;
}

/**
 * Main Builder Canvas
 * Renders the design canvas with grid, components, and interactions
 */
export const BuilderCanvas = memo(function BuilderCanvas({
    components,
    selectedComponent,
    previewMode,
    canvasScale,
    showGrid,
    snapToGrid,
    isDragging,
    isResizing,
    dragGuides,
    canvasRef,
    inlineEditing,
    onSelectComponent,
    onDeleteComponent,
    onUpdateComponent,
    onAddComponent,
    onComponentMouseDown,
    onResizeMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onSetInlineEditing,
    onOpenEditor,
}: BuilderCanvasProps) {
    const canvasSize = CANVAS_SIZES[previewMode];

    // Handle drop from component library
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const componentType = e.dataTransfer.getData('text/plain');
        if (!componentType.startsWith('library-')) return;

        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const dropX = (e.clientX - canvasRect.left) / canvasScale;
        const dropY = (e.clientY - canvasRect.top) / canvasScale;

        const actualType = componentType.replace('library-', '');
        const compSize = getDefaultComponentSize(actualType);

        // Apply safe area constraints with grid snapping
        let finalX = Math.max(SAFE_AREA_PADDING, Math.min(dropX, canvasRect.width / canvasScale - compSize.width - SAFE_AREA_PADDING));
        let finalY = Math.max(SAFE_AREA_PADDING, Math.min(dropY, canvasRect.height / canvasScale - compSize.height - SAFE_AREA_PADDING));

        if (snapToGrid) {
            finalX = Math.round(finalX / GRID_SIZE) * GRID_SIZE;
            finalY = Math.round(finalY / GRID_SIZE) * GRID_SIZE;
        }

        onAddComponent(actualType, undefined, { x: finalX, y: finalY });
    }, [canvasRef, canvasScale, snapToGrid, onAddComponent]);

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden">
            {/* Canvas Header */}
            <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-sm font-medium text-white">Canvas</span>
                        <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded">
                            {components.length} components
                        </span>
                        {(isDragging || isResizing) && (
                            <span className="text-xs text-blue-400 animate-pulse">
                                {isDragging ? '• Moving' : '• Resizing'}
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400">
                        {canvasSize.width} × {canvasSize.height}px
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-auto"
                onMouseMove={onCanvasMouseMove}
                onMouseUp={onCanvasMouseUp}
                onMouseLeave={onCanvasMouseUp}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                }}
                onDrop={handleDrop}
            >
                <div
                    ref={canvasRef}
                    id="canvas"
                    className="relative mx-auto bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-gray-200/20"
                    style={{
                        width: `${canvasSize.width}px`,
                        height: `${canvasSize.height}px`,
                        transform: `scale(${canvasScale})`,
                        transformOrigin: 'top center',
                        transition: 'width 0.3s, height 0.3s',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onSelectComponent(null);
                        }
                    }}
                >
                    {/* Drag Guides */}
                    {dragGuides && (isDragging || isResizing) && (
                        <>
                            <div
                                className="absolute top-0 bottom-0 w-px bg-blue-500/60 pointer-events-none z-50"
                                style={{ left: dragGuides.x }}
                            />
                            <div
                                className="absolute left-0 right-0 h-px bg-blue-500/60 pointer-events-none z-50"
                                style={{ top: dragGuides.y }}
                            />
                        </>
                    )}

                    {/* Grid Background */}
                    {showGrid && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                                    linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
                                    linear-gradient(#e5e7eb 1px, transparent 1px)
                                `,
                                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                                opacity: 0.4,
                            }}
                        />
                    )}

                    {/* Safe Area Indicator */}
                    <div
                        className="absolute pointer-events-none border border-dashed border-emerald-400/40 rounded"
                        style={{
                            top: SAFE_AREA_PADDING,
                            left: SAFE_AREA_PADDING,
                            right: SAFE_AREA_PADDING,
                            bottom: SAFE_AREA_PADDING,
                        }}
                    >
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[10px] text-emerald-500 bg-white px-1.5 py-0.5 rounded-full">
                            Safe Area
                        </div>
                    </div>

                    {/* Components */}
                    {components.map((component) => (
                        <CanvasComponent
                            key={component.id}
                            component={component}
                            isSelected={selectedComponent === component.id}
                            isDragging={isDragging && selectedComponent === component.id}
                            isResizing={isResizing}
                            inlineEditing={inlineEditing === component.id}
                            onSelect={() => onSelectComponent(component.id)}
                            onDelete={() => onDeleteComponent(component.id)}
                            onUpdate={(updates) => onUpdateComponent(component.id, updates)}
                            onMouseDown={(e) => onComponentMouseDown(e, component.id)}
                            onResizeMouseDown={(e, dir) => onResizeMouseDown(e, component.id, dir)}
                            onDoubleClick={() => {
                                if (['Text', 'Button'].includes(component.type)) {
                                    onSetInlineEditing(component.id);
                                }
                            }}
                            onSetInlineEditing={onSetInlineEditing}
                            onOpenEditor={() => onOpenEditor(component)}
                        />
                    ))}

                    {/* Empty State */}
                    {components.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                            <div className="text-6xl mb-4 opacity-30">📧</div>
                            <h3 className="text-lg font-medium text-gray-500 mb-2">
                                Start Building
                            </h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Drag components from the library
                            </p>
                            <div className="text-xs text-gray-500 space-y-1 text-center">
                                <p>📦 Drag to add components</p>
                                <p>🖱️ Click to select</p>
                                <p>↔️ Drag corners to resize</p>
                                <p>✏️ Double-click text to edit</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

// Individual Canvas Component - renders a simplified WYSIWYG preview
interface CanvasComponentProps {
    component: TemplateComponent;
    isSelected: boolean;
    isDragging: boolean;
    isResizing: boolean;
    inlineEditing: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onUpdate: (updates: Partial<TemplateComponent>) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onResizeMouseDown: (e: React.MouseEvent, direction: string) => void;
    onDoubleClick: () => void;
    onSetInlineEditing: (id: string | null) => void;
    onOpenEditor: () => void;
}

const CanvasComponent = memo(function CanvasComponent({
    component,
    isSelected,
    isDragging,
    isResizing,
    inlineEditing,
    onSelect,
    onDelete,
    onUpdate,
    onMouseDown,
    onResizeMouseDown,
    onDoubleClick,
    onSetInlineEditing,
    onOpenEditor,
}: CanvasComponentProps) {
    const isContainer = isContainerType(component.type);
    const style = component.style || {};
    const props = component.props || {};

    // Base wrapper style - just for positioning
    const wrapperStyle: React.CSSProperties = {
        position: 'absolute',
        left: component.position?.x || 0,
        top: component.position?.y || 0,
        width: component.size?.width || 150,
        height: component.size?.height || 100,
        zIndex: isSelected ? 100 : (style.zIndex || 0),
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s',
    };

    // Component content style - the actual visual appearance
    const contentStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: style.backgroundColor || '#ffffff',
        color: style.textColor || '#000000',
        fontSize: style.fontSize || '14px',
        fontFamily: style.fontFamily || 'Arial, sans-serif',
        fontWeight: style.fontWeight || 'normal',
        padding: style.padding || '0',
        borderRadius: style.borderRadius || '0',
        border: style.border || 'none',
        textAlign: (style.textAlign as React.CSSProperties['textAlign']) || 'center',
        display: 'flex',
        alignItems: style.alignItems || 'center',
        justifyContent: style.justifyContent || 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
    };

    // Render component content based on type
    const renderContent = () => {
        switch (component.type) {
            case 'Button':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || '#3b82f6',
                            color: style.textColor || '#ffffff',
                            fontWeight: style.fontWeight || '600',
                        }}
                    >
                        {String(props.children || 'Click Me')}
                    </div>
                );

            case 'Text':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || 'transparent',
                            justifyContent: style.textAlign === 'left' ? 'flex-start' : style.textAlign === 'right' ? 'flex-end' : 'center',
                            padding: style.padding || '8px',
                        }}
                    >
                        {String(props.children || 'Your text here')}
                    </div>
                );

            case 'Header':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || '#1e293b',
                            color: style.textColor || '#ffffff',
                            flexDirection: 'column',
                            gap: '4px',
                        }}
                    >
                        {typeof props.logo === 'string' && props.logo ? (
                            <img
                                src={props.logo}
                                alt="Logo"
                                style={{ maxHeight: '30px', marginBottom: '4px' }}
                            />
                        ) : null}
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                            {String(props.title || 'Email Header')}
                        </div>
                        {typeof props.subtitle === 'string' && props.subtitle ? (
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
                                {props.subtitle}
                            </div>
                        ) : null}
                    </div>
                );

            case 'Footer':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || '#1e293b',
                            color: style.textColor || '#94a3b8',
                            flexDirection: 'column',
                            gap: '4px',
                            fontSize: '11px',
                        }}
                    >
                        <div style={{ fontWeight: '600', fontSize: '12px' }}>
                            {String(props.company || 'Your Company')}
                        </div>
                        <div style={{ opacity: 0.8 }}>
                            {String(props.address || '123 Main St')}
                        </div>
                        {props.unsubscribeLink ? (
                            <div style={{ fontSize: '10px', textDecoration: 'underline' }}>
                                Unsubscribe
                            </div>
                        ) : null}
                    </div>
                );

            case 'Image':
                return (
                    <div style={{ ...contentStyle, padding: 0 }}>
                        <img
                            src={(props.src as string) || 'https://via.placeholder.com/200x150'}
                            alt={(props.alt as string) || 'Image'}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: style.borderRadius || '0',
                            }}
                        />
                    </div>
                );

            case 'Divider':
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 8px',
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: String(props.thickness || '2px'),
                                backgroundColor: style.backgroundColor || '#e5e7eb',
                            }}
                        />
                    </div>
                );

            case 'SocialLinks':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || '#f0fdf4',
                            gap: '8px',
                        }}
                    >
                        {Array.isArray(props.links) ? (
                            (props.links as Array<{ platform: string }>).map((link, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: '#374151',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '10px',
                                    }}
                                >
                                    {link.platform?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            ))
                        ) : (
                            <span style={{ fontSize: '12px', color: '#666' }}>Social Links</span>
                        )}
                    </div>
                );

            case 'Section':
            case 'Card':
                return (
                    <div
                        style={{
                            ...contentStyle,
                            backgroundColor: style.backgroundColor || (component.type === 'Card' ? '#ffffff' : '#f0f9ff'),
                            border: style.border || (component.type === 'Card' ? '1px solid #e5e7eb' : '2px solid #bae6fd'),
                        }}
                    >
                        {String(props.children || component.type)}
                    </div>
                );

            case 'Spacer':
                return (
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                            border: '1px dashed #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: '#999',
                        }}
                    >
                        Spacer
                    </div>
                );

            case 'Logo':
                return (
                    <div style={{ ...contentStyle, padding: 0 }}>
                        <img
                            src={(props.src as string) || 'https://via.placeholder.com/80x30'}
                            alt={(props.alt as string) || 'Logo'}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    </div>
                );

            default:
                return (
                    <div style={contentStyle}>
                        {component.type}
                    </div>
                );
        }
    };

    return (
        <div
            style={wrapperStyle}
            className={`group ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-2 hover:ring-gray-400'}`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleClick}
        >
            {/* Inline Editing for Text/Button */}
            {inlineEditing ? (
                <input
                    type="text"
                    defaultValue={(props.children as string) || ''}
                    autoFocus
                    className="absolute inset-0 w-full h-full bg-white border-2 border-blue-500 outline-none px-3 py-2 text-sm z-10"
                    style={{
                        color: style.textColor || '#000',
                        textAlign: (style.textAlign as React.CSSProperties['textAlign']) || 'center',
                    }}
                    onBlur={(e) => {
                        onUpdate({ props: { ...props, children: e.target.value } });
                        onSetInlineEditing(null);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onUpdate({ props: { ...props, children: (e.target as HTMLInputElement).value } });
                            onSetInlineEditing(null);
                        }
                        if (e.key === 'Escape') {
                            onSetInlineEditing(null);
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                renderContent()
            )}

            {/* Action Buttons */}
            <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditor();
                    }}
                    className="w-5 h-5 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg"
                    title="Edit"
                >
                    ⚙
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                    title="Delete"
                >
                    ×
                </button>
            </div>

            {/* Resize Handles */}
            {isSelected && !isDragging && (
                <ResizeHandles onResizeMouseDown={onResizeMouseDown} />
            )}

            {/* Container Indicator */}
            {isContainer && (
                <div className="absolute inset-0 border-2 border-dashed border-blue-300/0 group-hover:border-blue-300/50 pointer-events-none transition-colors rounded" />
            )}
        </div>
    );
});

// Resize handles component
interface ResizeHandlesProps {
    onResizeMouseDown: (e: React.MouseEvent, direction: string) => void;
}

const ResizeHandles = memo(function ResizeHandles({ onResizeMouseDown }: ResizeHandlesProps) {
    const handles = [
        { dir: 'nw', cursor: 'nw-resize', pos: { left: -4, top: -4 } },
        { dir: 'n', cursor: 'n-resize', pos: { left: '50%', top: -4, transform: 'translateX(-50%)' } },
        { dir: 'ne', cursor: 'ne-resize', pos: { right: -4, top: -4 } },
        { dir: 'e', cursor: 'e-resize', pos: { right: -4, top: '50%', transform: 'translateY(-50%)' } },
        { dir: 'se', cursor: 'se-resize', pos: { right: -4, bottom: -4 } },
        { dir: 's', cursor: 's-resize', pos: { left: '50%', bottom: -4, transform: 'translateX(-50%)' } },
        { dir: 'sw', cursor: 'sw-resize', pos: { left: -4, bottom: -4 } },
        { dir: 'w', cursor: 'w-resize', pos: { left: -4, top: '50%', transform: 'translateY(-50%)' } },
    ];

    return (
        <>
            {handles.map(({ dir, cursor, pos }) => (
                <div
                    key={dir}
                    className="absolute w-2.5 h-2.5 bg-blue-500 border border-white rounded-full hover:scale-125 transition-transform z-50"
                    style={{ ...pos, cursor } as React.CSSProperties}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onResizeMouseDown(e, dir);
                    }}
                />
            ))}
        </>
    );
});

export default BuilderCanvas;
