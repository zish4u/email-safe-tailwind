"use client";
import React, { memo, useCallback, useMemo } from 'react';
import {
    TemplateComponent,
    CANVAS_SIZES,
    PreviewMode,
    isContainerType,
    ComponentType,
} from '../types';
import { DragGuides } from '../hooks/useCanvasInteractions';
import { buildComponentTree } from '../utils/htmlGenerator';
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    DragEndEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DragStartEvent,
    closestCorners,
} from '@dnd-kit/core';
import {
    SortableContext,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BuilderCanvasProps {
    components: TemplateComponent[];
    selectedComponent: string | null;
    previewMode: PreviewMode;
    canvasZoom: number;
    showGrid: boolean;
    snapToGrid: boolean;
    isDragging: boolean;
    isResizing: boolean;
    dragGuides: DragGuides | null;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    inlineEditing: string | null;
    onSelectComponent: (id: string | null) => void;
    onDeleteComponent: (id: string) => void;
    onDuplicateComponent: (id: string) => void;
    onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
    onAddComponent: (type: string, parentId?: string, position?: { x: number; y: number }) => void;
    onResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
    onCanvasMouseMove: (e: React.MouseEvent) => void;
    onCanvasMouseUp: () => void;
    onSetInlineEditing: (id: string | null) => void;
    onOpenEditor: (component: TemplateComponent) => void;
}

/**
 * Main Builder Canvas
 * Renders the design canvas with grid, components, and interactions
 * Refactored for Tree-based / Flow Layout
 */
export const BuilderCanvas = memo(function BuilderCanvas({
    components,
    selectedComponent,
    previewMode,
    canvasZoom,
    showGrid,
    isDragging,
    isResizing,
    canvasRef,
    inlineEditing,
    onSelectComponent,
    onDeleteComponent,
    onDuplicateComponent,
    onUpdateComponent,
    onAddComponent,
    onResizeMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onSetInlineEditing,
    onOpenEditor,
}: BuilderCanvasProps) {
    const canvasSize = CANVAS_SIZES[previewMode];

    // Build the component tree from flat list
    const rootComponents = useMemo(() => buildComponentTree(components), [components]);

    // Recursive helper to find the deepest container under the mouse
    const findTargetParent = useCallback((
        clientX: number,
        clientY: number,
        componentType: string
    ): string | undefined => {
        // Elements to ignore for hit testing (dragged items, etc if needed)
        // Using document.elementsFromPoint to find potential parents
        const elements = document.elementsFromPoint(clientX, clientY);

        // Define valid parents for each type
        const validParentTypes: Record<string, string[]> = {
            'Section': ['Canvas'], // Section can only be on Canvas (root)
            'Row': ['Section'],    // Row must be in Section
            'Column': ['Row'],     // Column must be in Row
            'Group': ['Column', 'Section'], // Flex
            // Elements (Text, Button, etc) must be in Column
            'Text': ['Column'],
            'Button': ['Column'],
            'Image': ['Column'],
            'Divider': ['Column'],
            'Spacer': ['Column'],
        };

        const allowedParents = validParentTypes[componentType] || ['Column'];

        for (const el of elements) {
            const domEl = el as HTMLElement;
            const compId = domEl.dataset.componentId;
            const compType = domEl.dataset.componentType;

            // If we found a component
            if (compId && compType) {
                if (allowedParents.includes(compType)) {
                    return compId;
                }
            } else if (domEl.id === 'canvas-area') {
                // We hit the canvas background
                if (allowedParents.includes('Canvas')) {
                    return undefined; // Undefined parentId means root/canvas
                }
            }
        }

        return undefined;
    }, []);

    // Handle drop from component library
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const componentType = e.dataTransfer.getData('text/plain');
        if (!componentType.startsWith('library-')) return;

        const actualType = componentType.replace('library-', '');

        // Find the valid parent for this component type at the drop location
        const targetParentId = findTargetParent(e.clientX, e.clientY, actualType);

        // If strict nesting rules fail, we might want to auto-wrap? 
        // For now, let's try to just add it. The undefined parentId means root.
        // If a Button is dropped on Root, we should probably wrap it in Section->Row->Column automatically
        // But for this step, let's assume the user targets correctly or we enforce simple rules.

        // AUTO-WRAPPING LOGIC (Simple version)
        // If dropped on Root but needs to be in something else
        if (targetParentId === undefined && actualType !== 'Section') {
            // If we drop a specialized element on the canvas, we could simply not allow it,
            // or creates a new Section structure.
            // For now, let's allow adding to root if no parent found, 
            // but visually it might look broken if we enforce styles.
            // Let's rely on onAddComponent to handle or just let it float at top if supported.
        }

        // We don't really care about X/Y for flow layout, just order.
        // But we'll pass 0,0 for now.
        onAddComponent(actualType, targetParentId, { x: 0, y: 0 });

    }, [findTargetParent, onAddComponent]);

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden h-full flex flex-col">
            {/* Canvas Header */}
            <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50 shrink-0">
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
                    </div>
                    <div className="text-xs text-gray-400">
                        {canvasSize.width}px width
                    </div>
                </div>
            </div>

            {/* Canvas Area */}
            <div
                className="flex-1 bg-gray-900 overflow-auto flex justify-center p-8 transition-colors"
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
                    id="canvas-area"
                    className="relative bg-white shadow-2xl border border-gray-100 transition-all duration-300 min-h-[800px] flex flex-col mx-auto my-8 ring-1 ring-gray-900/5"
                    style={{
                        width: `${canvasSize.width}px`,
                        transform: `scale(${canvasZoom})`,
                        transformOrigin: 'top center',
                        backgroundImage: showGrid ? `
                            linear-gradient(90deg, #f3f4f6 1px, transparent 1px),
                            linear-gradient(#f3f4f6 1px, transparent 1px)
                        ` : 'none',
                        backgroundSize: '20px 20px',
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            onSelectComponent(null);
                        }
                    }}
                >
                    {/* Render Root Components (Sections) */}
                    {rootComponents.map((component) => (
                        <CanvasComponent
                            key={component.id}
                            component={component}
                            selectedId={selectedComponent}
                            isDragging={isDragging}
                            isResizing={isResizing}
                            inlineEditing={inlineEditing}
                            onSelect={onSelectComponent}
                            onDelete={onDeleteComponent}
                            onDuplicate={onDuplicateComponent}
                            onUpdate={onUpdateComponent}
                            onResizeMouseDown={onResizeMouseDown}
                            onDoubleClick={() => { }}
                            showGrid={showGrid}
                            onSetInlineEditing={onSetInlineEditing}
                            onOpenEditor={onOpenEditor}
                        />
                    ))}

                    {/* Empty State / Dropzone hint */}
                    {rootComponents.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 m-4 rounded-lg">
                            <p className="text-lg font-medium">Drop a Section here</p>
                            <p className="text-sm text-gray-400">Start with a layout section</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

// Recursive Canvas Component
interface CanvasComponentProps {
    component: TemplateComponent;
    selectedId: string | null;
    isDragging: boolean;
    isResizing: boolean;
    inlineEditing: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
    onResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
    onDoubleClick: (e: React.MouseEvent) => void;
    showGrid: boolean;
    onSetInlineEditing: (id: string | null) => void;
    onOpenEditor: (component: TemplateComponent) => void;
}



// Internal ResizeHandles Component
// Internal ResizeHandles Component
const ResizeHandles = ({
    componentId,
    width,
    height,
    onResizeStart
}: {
    componentId: string;
    width: number;
    height: number;
    onResizeStart: (e: React.MouseEvent, direction: string) => void;
}) => {
    const handles = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

    const getHandleStyle = (dir: string): React.CSSProperties => {
        const style: React.CSSProperties = {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#3b82f6',
            border: '1px solid white',
            borderRadius: '50%',
            zIndex: 50,
            transform: 'translate(-50%, -50%)', // Center the handle on the point
        };

        // Vertical position
        if (dir.includes('n')) style.top = '0%';
        else if (dir.includes('s')) style.top = '100%';
        else style.top = '50%';

        // Horizontal position
        if (dir.includes('w')) style.left = '0%';
        else if (dir.includes('e')) style.left = '100%';
        else style.left = '50%';

        // Cursor
        if (dir === 'n' || dir === 's') style.cursor = 'ns-resize';
        else if (dir === 'e' || dir === 'w') style.cursor = 'ew-resize';
        else if (dir === 'ne' || dir === 'sw') style.cursor = 'nesw-resize';
        else if (dir === 'nw' || dir === 'se') style.cursor = 'nwse-resize';

        return style;
    };

    return (
        <>
            {handles.map(dir => (
                <div
                    key={dir}
                    data-direction={dir}
                    onMouseDown={(e) => onResizeStart(e, dir)}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={getHandleStyle(dir)}
                />
            ))}
            {/* Dimensions label during resize */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {Math.round(width)} × {Math.round(height)}
            </div>
        </>
    );
};

// Recursive Component for Canvas
const CanvasComponent = memo(function CanvasComponent({
    component,
    selectedId,
    isDragging,
    isResizing,
    inlineEditing,
    onSelect,
    onDelete,
    onDuplicate,
    onUpdate,
    onResizeMouseDown,
    onDoubleClick,
    showGrid,
    onSetInlineEditing,
    onOpenEditor,
}: CanvasComponentProps) {
    const isSelected = selectedId === component.id;
    const isContainer = isContainerType(component.type);

    // Setup Sortable for DnD
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging
    } = useSortable({
        id: component.id,
        data: {
            type: component.type,
            isContainer
        }
    });

    const style = component.style || {};

    // Calculate final style
    const finalStyle: any = {
        ...style,
        position: 'relative', // Flow layout
        width: component.size?.width ? `${component.size.width}px` : style.width || '100%',
        height: component.size?.height ? `${component.size.height}px` : style.height || 'auto',
        minHeight: isContainer ? '50px' : 'auto', // Ensure containers are droppable
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.3 : (style.opacity || 1),
        border: isSelected
            ? '2px solid #3b82f6'
            : isContainer
                ? '1px dashed #e5e7eb'
                : '1px dashed transparent',
        outline: 'none',
        zIndex: isSelected ? 10 : 1,
    };


    const handleExtensionClick = (e: React.MouseEvent, action: 'delete' | 'duplicate' | 'edit') => {
        e.stopPropagation();
        if (action === 'delete') onDelete(component.id);
        if (action === 'duplicate') onDuplicate(component.id);
        if (action === 'edit') onOpenEditor(component);
    };

    // Render children if container
    const childrenIds = (component.children || []).map(c => c.id);

    return (
        <div
            ref={setNodeRef}
            style={finalStyle}
            id={component.id}
            data-component-type={component.type}
            className={`group relative ${isSelected ? 'z-40' : 'z-auto'} ${isContainer ? 'min-h-[50px]' : ''} `}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(component.id);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                if (component.type === 'Text') onSetInlineEditing(component.id);
                else onOpenEditor(component);
            }}
            {...attributes}
            {...listeners}
        >
            {/* Header / Label for Containers (on selection or hover) */}
            {(isSelected || isContainer) && (
                <div className={`
                    absolute top-0 left-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-br shadow-xs z-50 pointer-events-none transition-opacity
                    ${isSelected ? 'bg-blue-600 text-white opacity-100' : 'bg-gray-100/80 text-gray-500 opacity-0 group-hover:opacity-100'}
                `}>
                    {component.type}
                </div>
            )}

            {/* Action Buttons for Selected Component */}
            {isSelected && !isDragging && (
                <div
                    className="absolute -top-3 -right-3 flex gap-1 z-50"
                    onPointerDown={(e) => e.stopPropagation()} // Prevent DnD start
                >
                    <button onClick={(e) => handleExtensionClick(e, 'duplicate')} className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 text-gray-600" title="Duplicate">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    </button>
                    <button onClick={(e) => handleExtensionClick(e, 'edit')} className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 text-blue-600" title="Edit">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={(e) => handleExtensionClick(e, 'delete')} className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-red-50 text-red-600" title="Delete">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {/* Content */}
            <ComponentContent component={component} />

            {/* Component Content (Recursive) */}
            {isContainer && !component.isLocked && (
                <div
                    className={`relative w-full transition-all duration-200 overflow-hidden`}
                    style={{
                        minHeight: component.children?.length === 0 ? '40px' : undefined,
                        display: component.style?.display || (['Row', 'Group'].includes(component.type) ? 'flex' : 'block'),
                        flexDirection: (component.style?.flexDirection as any) || 'row',
                        justifyContent: component.style?.justifyContent || 'flex-start',
                        alignItems: component.style?.alignItems || 'stretch',
                        gap: component.style?.gap || '0px',
                        flexWrap: 'wrap',
                        maxWidth: '100%',
                    }}
                >
                    <SortableContext items={childrenIds} strategy={rectSortingStrategy}>
                        {component.children?.map(child => (
                            <CanvasComponent
                                key={child.id}
                                component={child}
                                selectedId={selectedId}
                                isDragging={isDragging}
                                isResizing={isResizing}
                                inlineEditing={inlineEditing}
                                showGrid={showGrid}
                                onSelect={onSelect}
                                onDelete={onDelete}
                                onDuplicate={onDuplicate}
                                onUpdate={onUpdate}
                                onResizeMouseDown={onResizeMouseDown}
                                onDoubleClick={onDoubleClick}
                                onSetInlineEditing={onSetInlineEditing}
                                onOpenEditor={onOpenEditor}
                            />
                        ))}
                    </SortableContext>
                    {component.children?.length === 0 && (
                        <div className={`w-full h-full min-h-[40px] flex items-center justify-center text-xs text-gray-400 bg-gray-50/50 border border-dashed rounded ${showGrid ? 'border-gray-200' : 'border-transparent'}`}>
                            Drop {component.type === 'Section' ? 'Rows' : component.type === 'Row' ? 'Columns' : 'Elements'} here
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            {isContainer && !isResizing && !isDragging && (
                <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="flex gap-1 bg-white shadow-lg rounded p-1 border border-gray-200">
                        <button title="Edit properties" onClick={(e) => handleExtensionClick(e, 'edit')} className="p-1 hover:bg-gray-100 rounded text-gray-600">✏️</button>
                        <button title="Duplicate" onClick={(e) => handleExtensionClick(e, 'duplicate')} className="p-1 hover:bg-gray-100 rounded text-blue-600">📄</button>
                        <button title="Delete" onClick={(e) => handleExtensionClick(e, 'delete')} className="p-1 hover:bg-red-50 rounded text-red-600">🗑️</button>
                    </div>
                </div>
            )}
            {!isContainer && isSelected && !isResizing && !isDragging && (
                <div className="absolute -top-9 right-0 p-1 z-50">
                    <div className="flex gap-1 bg-white shadow-lg rounded p-1 border border-gray-200">
                        <button title="Edit properties" onClick={(e) => handleExtensionClick(e, 'edit')} className="p-1 hover:bg-gray-100 rounded text-gray-600">✏️</button>
                        <button title="Duplicate" onClick={(e) => handleExtensionClick(e, 'duplicate')} className="p-1 hover:bg-gray-100 rounded text-blue-600">📄</button>
                        <button title="Delete" onClick={(e) => handleExtensionClick(e, 'delete')} className="p-1 hover:bg-red-50 rounded text-red-600">🗑️</button>
                    </div>
                </div>
            )}

            {/* Resize Handles */}
            {isSelected && component.constraints?.resizable !== false && (
                <ResizeHandles
                    componentId={component.id}
                    width={component.size?.width || 0}
                    height={component.size?.height || 0}
                    onResizeStart={(e, dir) => onResizeMouseDown(e, component.id, dir)}
                />
            )}
        </div>
    );
});

// Helper for leaf content rendering
const ComponentContent = ({ component }: { component: TemplateComponent }) => {
    const { type, props, style = {} } = component;

    // Default stylings for leaf nodes
    const contentStyle: React.CSSProperties = {
        color: style.textColor || 'inherit',
        fontSize: style.fontSize || 'inherit',
        fontFamily: style.fontFamily || 'inherit',
        textAlign: (style.textAlign as any) || 'left',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
    };

    switch (type) {
        case 'Button':
            return (
                <div style={{ textAlign: (style.textAlign as any) || 'center', width: '100%' }}>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        style={{
                            backgroundColor: style.backgroundColor,
                            color: style.textColor,
                            borderRadius: style.borderRadius,
                            ...contentStyle,
                            width: 'auto', // Button is inline-block usually
                        }}
                    >
                        {String(props.children || 'Click Me')}
                    </button>
                </div>
            );
        case 'Text':
            return (
                <div style={contentStyle}>
                    {String(props.children || 'Lorem ipsum text block')}
                </div>
            );
        case 'Image':
            return (
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <img
                        src={String(props.src || 'https://via.placeholder.com/150')}
                        alt={String(props.alt || '')}
                        className="max-w-full h-auto block object-contain"
                        style={{ borderRadius: style.borderRadius, maxWidth: '100%' }}
                    />
                </div>
            );
        case 'Divider':
            return <div className="py-2 w-full"><hr className="border-gray-300 w-full" style={{ borderColor: style.backgroundColor, borderTopWidth: props.thickness ? String(props.thickness) : '1px' }} /></div>;
        case 'Spacer':
            return (
                <div
                    className="w-full relative group"
                    style={{ height: props.height ? String(props.height) + 'px' : '20px' }}
                >
                    {/* Visual hint for spacer in builder */}
                    <div className="absolute inset-0 border border-dashed border-gray-300 bg-gray-50/30 opacity-50 group-hover:opacity-100 pointer-events-none flex items-center justify-center">
                        <span className="text-[10px] text-gray-400 hidden group-hover:block">Spacer</span>
                    </div>
                </div>
            );
        default:
            return <div className="text-gray-400 text-xs">{type} Block</div>;
    }
};

export default BuilderCanvas;
