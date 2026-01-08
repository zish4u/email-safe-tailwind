// "use client";
// import React, { memo, useCallback, useMemo } from 'react';
// import {
//     TemplateComponent,
//     CANVAS_SIZES,
//     SAFE_AREA_BOUNDARIES,
//     EMAIL_CLIENT_DIMENSIONS,
//     EMAIL_WARNINGS,
//     SAFE_AREA_RULES,
//     PreviewMode,
//     isContainerType,
//     ComponentType,
// } from '../types';
// import { DragGuides, DragState } from '../hooks/useCanvasInteractions';
// import { ensureSafeAreaCompliance, getMaximumSafeDimensions } from '../utils/emailValidation';
// import { buildComponentTree } from '../utils/htmlGenerator';
// import {
//     DndContext,
//     useSensor,
//     useSensors,
//     PointerSensor,
//     KeyboardSensor,
//     DragEndEvent,
//     DragStartEvent,
//     closestCenter,
//     pointerWithin,
//     CollisionDetection,
//     ClientRect,
//     getClientRect,
//     useDroppable
// } from '@dnd-kit/core';
// import {
//     SortableContext,
//     rectSortingStrategy,
//     useSortable
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// interface BuilderCanvasProps {
//     components: TemplateComponent[];
//     selectedComponent: string | null;
//     previewMode: PreviewMode;
//     canvasZoom: number;
//     showGrid: boolean;
//     showSafeArea: boolean;
//     snapToGrid: boolean;
//     isDragging: boolean;
//     isResizing: boolean;
//     dragGuides: DragGuides | null;
//     dragState: DragState;
//     canvasRef: React.RefObject<HTMLDivElement | null>;
//     inlineEditing: string | null;
//     onSelectComponent: (id: string | null) => void;
//     onDeleteComponent: (id: string) => void;
//     onDuplicateComponent: (id: string) => void;
//     onUpdateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
//     onAddComponent: (type: string, parentId?: string, position?: { x: number; y: number }, initialStyles?: Record<string, any>) => void;
//     onResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
//     onCanvasMouseMove: (e: React.MouseEvent) => void;
//     onCanvasMouseUp: () => void;
//     onComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
//     onSetInlineEditing: (id: string | null) => void;
//     onOpenEditor: (component: TemplateComponent) => void;
// }

// /**
//  * Main Builder Canvas with Safe Area Enforcement
//  * FIXED: Components now position relative to safe area container, not transformed canvas
//  */
// export const BuilderCanvas = memo(function BuilderCanvas({
//     components,
//     selectedComponent,
//     previewMode,
//     canvasZoom,
//     showGrid,
//     showSafeArea,
//     snapToGrid,
//     isDragging,
//     isResizing,
//     dragGuides,
//     dragState,
//     canvasRef,
//     inlineEditing,
//     onSelectComponent,
//     onDeleteComponent,
//     onDuplicateComponent,
//     onUpdateComponent,
//     onAddComponent,
//     onResizeMouseDown,
//     onCanvasMouseMove,
//     onCanvasMouseUp,
//     onComponentMouseDown,
//     onSetInlineEditing,
//     onOpenEditor,
// }: BuilderCanvasProps) {
//     const canvasSize = CANVAS_SIZES[previewMode];
//     const safeArea = SAFE_AREA_BOUNDARIES[previewMode];
//     const emailDimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];

//     // Build the component tree from flat list
//     const rootComponents = useMemo(() => buildComponentTree(components), [components]);

//     // Enhanced container detection with visual feedback
//     const getDropTargetInfo = useCallback((mouseX: number, mouseY: number) => {
//         const containers = components.filter(c => isContainerType(c.type));
//         let bestTarget: TemplateComponent | null = null;
//         let bestScore = Infinity;

//         containers.forEach(container => {
//             const containerLeft = container.position?.x || 0;
//             const containerTop = container.position?.y || 0;
//             const containerWidth = container.size?.width || 200;
//             const containerHeight = container.size?.height || 100;

//             // Check if mouse is within container bounds
//             if (mouseX >= containerLeft && mouseX <= containerLeft + containerWidth &&
//                 mouseY >= containerTop && mouseY <= containerTop + containerHeight) {

//                 // Calculate score based on distance from center
//                 const centerX = containerLeft + containerWidth / 2;
//                 const centerY = containerTop + containerHeight / 2;
//                 const distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

//                 if (distance < bestScore) {
//                     bestScore = distance;
//                     bestTarget = container;
//                 }
//             }
//         });

//         return bestTarget;
//     }, [components]);

//     // Professional nesting validation with visual feedback
//     const canNestComponent = (parentType: string, childType: string): boolean => {
//         const nestingRules: Record<string, string[]> = {
//             'Section': ['Row'],
//             'Row': ['Column'],
//             'Column': ['Text', 'Button', 'Image', 'Row'],
//             'Text': [],
//             'Button': [],
//             'Image': []
//         };
//         return nestingRules[parentType]?.includes(childType) || false;
//     };

//     // Professional grid and alignment system
//     const GRID_SIZE = 8;
//     const getSnappedPosition = (value: number): number => {
//         return snapToGrid ? Math.round(value / GRID_SIZE) * GRID_SIZE : value;
//     };

//     // Enhanced drag guides with alignment and drop target visualization
//     const getEnhancedDragGuides = useCallback((component: TemplateComponent, position: { x: number; y: number }) => {
//         const guides: { left: number[], center: number[], right: number[], top: number[], middle: number[], bottom: number[] } = { left: [], center: [], right: [], top: [], middle: [], bottom: [] };
//         const tolerance = 8; // Increased tolerance for easier snapping

//         components.forEach(other => {
//             if (other.id === component.id) return;

//             const otherLeft = other.position?.x || 0;
//             const otherCenter = otherLeft + (other.size?.width || 0) / 2;
//             const otherRight = otherLeft + (other.size?.width || 0);
//             const otherTop = other.position?.y || 0;
//             const otherMiddle = otherTop + (other.size?.height || 0) / 2;
//             const otherBottom = otherTop + (other.size?.height || 0);

//             const compLeft = position.x;
//             const compCenter = compLeft + (component.size?.width || 0) / 2;
//             const compRight = compLeft + (component.size?.width || 0);
//             const compTop = position.y;
//             const compMiddle = compTop + (component.size?.height || 0) / 2;
//             const compBottom = compTop + (component.size?.height || 0);

//             // Check for alignment with increased tolerance
//             if (Math.abs(compLeft - otherLeft) < tolerance) guides.left.push(otherLeft);
//             if (Math.abs(compCenter - otherCenter) < tolerance) guides.center.push(otherCenter);
//             if (Math.abs(compRight - otherRight) < tolerance) guides.right.push(otherRight);
//             if (Math.abs(compTop - otherTop) < tolerance) guides.top.push(otherTop);
//             if (Math.abs(compMiddle - otherMiddle) < tolerance) guides.middle.push(otherMiddle);
//             if (Math.abs(compBottom - otherBottom) < tolerance) guides.bottom.push(otherBottom);
//         });

//         return guides;
//     }, [components]);

//     // Professional context menu for components
//     const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number; componentId: string } | null>(null);

//     const handleContextMenu = (e: React.MouseEvent, componentId: string) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setContextMenu({ x: e.clientX, y: e.clientY, componentId });
//     };

//     const closeContextMenu = () => setContextMenu(null);

//     // Professional keyboard shortcuts
//     React.useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (selectedComponent) {
//                 if (e.key === 'Delete' || e.key === 'Backspace') {
//                     e.preventDefault();
//                     onDeleteComponent(selectedComponent);
//                 }
//                 if (e.ctrlKey && e.key === 'd') {
//                     e.preventDefault();
//                     onDuplicateComponent(selectedComponent);
//                 }
//                 if (e.ctrlKey && e.key === 'c') {
//                     e.preventDefault();
//                     // Copy functionality would go here
//                 }
//             }
//             if (e.key === 'Escape') {
//                 closeContextMenu();
//                 onSelectComponent(null);
//             }
//         };

//         document.addEventListener('keydown', handleKeyDown);
//         return () => document.removeEventListener('keydown', handleKeyDown);
//     }, [selectedComponent, onDeleteComponent, onDuplicateComponent, onSelectComponent]);

//     // Close context menu on click outside
//     React.useEffect(() => {
//         const handleClick = () => closeContextMenu();
//         document.addEventListener('click', handleClick);
//         return () => document.removeEventListener('click', handleClick);
//     }, []);

//     const handleDrop = useCallback((e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();

//         const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
//         const canvasArea = document.getElementById('canvas-area');

//         if (!canvasArea || !elementUnderCursor) return;

//         if (elementUnderCursor !== canvasArea && !canvasArea.contains(elementUnderCursor)) {
//             return;
//         }

//         const componentType = e.dataTransfer.getData('text/plain');
//         if (!componentType.startsWith('library-')) return;

//         const actualType = componentType.replace('library-', '');

//         // Find target component for nesting
//         const targetElement = elementUnderCursor.closest('[data-component-id]');
//         let targetParentId: string | undefined;
//         let position = { x: 0, y: 0 };

//         if (targetElement) {
//             const targetId = targetElement.getAttribute('data-component-id');
//             const targetComponent = components.find(c => c.id === targetId);

//             if (targetComponent && canNestComponent(targetComponent.type, actualType)) {
//                 targetParentId = targetId || undefined;
//             }
//         }

//         // Calculate position
//         const safeAreaContainer = document.getElementById('safe-area-container');
//         if (!safeAreaContainer) return;

//         const containerRect = safeAreaContainer.getBoundingClientRect();
//         const relativeX = e.clientX - containerRect.left;
//         const relativeY = e.clientY - containerRect.top;

//         // Apply zoom correction and professional bounds
//         const safeX = Math.max(10, Math.min(relativeX, containerRect.width - 110)) / canvasZoom;
//         const safeY = Math.max(10, Math.min(relativeY, containerRect.height - 60)) / canvasZoom;

//         // Apply grid snapping if enabled
//         const snappedX = getSnappedPosition(safeX);
//         const snappedY = getSnappedPosition(safeY);

//         // Professional positioning based on component type
//         if (actualType === 'Section') {
//             position = { x: 0, y: 0 }; // Sections always at top-level
//         } else if (targetParentId) {
//             position = { x: 10, y: 10 }; // Nested components get offset
//         } else {
//             position = { x: snappedX, y: snappedY };
//         }

//         onAddComponent(actualType, targetParentId, position, {});

//     }, [components, onAddComponent, canvasZoom, snapToGrid]);

//     return (
//         <div className="bg-gray-900 rounded-xl border border-gray-700/50 overflow-hidden h-full flex flex-col">
//             {/* Canvas Header */}
//             <div className="bg-gray-800/50 px-4 py-2 border-b border-gray-700/50 shrink-0">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <div className="flex items-center gap-1">
//                             <div className="w-3 h-3 rounded-full bg-red-500/80" />
//                             <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
//                             <div className="w-3 h-3 rounded-full bg-green-500/80" />
//                         </div>
//                         <span className="text-sm font-medium text-white">Email Canvas</span>
//                         <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded">
//                                 {components.length} components
//                             </span>
//                             <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">
//                                 {emailDimensions.safeWidth}px safe width
//                             </span>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <div className="text-xs text-gray-400">
//                             {canvasSize.width}px × {canvasSize.height}px
//                         </div>
//                         <div className="text-xs text-green-400">
//                             Max: {emailDimensions.maxWidth}px
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Canvas Area */}
//             <div
//                 className="flex-1 bg-gray-900 overflow-auto flex justify-center p-8 transition-colors"
//                 onMouseMove={onCanvasMouseMove}
//                 onMouseUp={onCanvasMouseUp}
//                 onMouseLeave={onCanvasMouseUp}
//                 onDragOver={(e) => {
//                     e.preventDefault();
//                     e.dataTransfer.dropEffect = 'copy';
//                 }}
//                 onDrop={handleDrop}
//                 onClick={closeContextMenu}
//             >
//                 <div
//                     ref={canvasRef}
//                     id="canvas-area"
//                     className="relative bg-white shadow-2xl border border-gray-100 transition-all duration-300 min-h-[800px] flex flex-col mx-auto my-8 ring-1 ring-gray-900/5"
//                     style={{
//                         width: `${canvasSize.width}px`,
//                         transform: `scale(${canvasZoom})`,
//                         transformOrigin: 'top center',
//                         backgroundImage: showGrid ? `
//                             linear-gradient(90deg, #f3f4f6 1px, transparent 1px),
//                             linear-gradient(#f3f4f6 1px, transparent 1px)
//                         ` : 'none',
//                         backgroundSize: '20px 20px',
//                     }}
//                     onClick={(e) => {
//                         if (e.target === e.currentTarget) {
//                             onSelectComponent(null);
//                         }
//                     }}
//                 >
//                     {/* KEY FIX: Safe Area Container - Components positioned here, not in transformed canvas */}
//                     <div
//                         id="safe-area-container"
//                         className="relative flex-1"
//                         style={{
//                             position: 'absolute',
//                             left: `${safeArea.left}px`,
//                             top: `${safeArea.top}px`,
//                             width: `${safeArea.width}px`,
//                             height: `${safeArea.height}px`,
//                         }}
//                     >
//                         {/* Safe Area Overlay */}
//                         {showSafeArea && (
//                             <div
//                                 className="absolute inset-0 border-2 border-blue-500/30 bg-blue-500/5 pointer-events-none z-10"
//                             >
//                                 <div className="absolute -top-6 left-0 text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded shadow-sm border border-blue-200">
//                                     Safe Area ({safeArea.width}px × {safeArea.height}px)
//                                 </div>
//                                 <div className="absolute top-2 left-2 text-xs text-blue-600 opacity-70">
//                                     Gmail, Outlook, Apple Mail Compatible
//                                 </div>
//                             </div>
//                         )}

//                         {/* Render Root Components */}
//                         {rootComponents.map((component) => (
//                             <CanvasComponent
//                                 key={component.id}
//                                 component={component}
//                                 selectedId={selectedComponent}
//                                 isDragging={isDragging}
//                                 isResizing={isResizing}
//                                 dragState={dragState}
//                                 inlineEditing={inlineEditing}
//                                 onSelect={onSelectComponent}
//                                 onDelete={onDeleteComponent}
//                                 onDuplicate={onDuplicateComponent}
//                                 onUpdate={onUpdateComponent}
//                                 onResizeMouseDown={onResizeMouseDown}
//                                 onComponentMouseDown={onComponentMouseDown}
//                                 onDoubleClick={() => { }}
//                                 showGrid={showGrid}
//                                 onSetInlineEditing={onSetInlineEditing}
//                                 onOpenEditor={onOpenEditor}
//                                 onContextMenu={handleContextMenu}
//                                 closeContextMenu={closeContextMenu}
//                                 snapToGrid={snapToGrid}
//                                 getAlignmentGuides={getEnhancedDragGuides}
//                             />
//                         ))}

//                         {/* Drag Guides Overlay */}
//                         {isDragging && dragGuides && (
//                             <div className="absolute inset-0 pointer-events-none z-50">
//                                 {/* Alignment Lines */}
//                                 {dragGuides.alignmentLines?.map((line, index) => (
//                                     <div
//                                         key={index}
//                                         className="absolute bg-blue-500 opacity-60"
//                                         style={{
//                                             ...(line.type === 'horizontal' ? {
//                                                 left: 0,
//                                                 right: 0,
//                                                 top: `${line.position}px`,
//                                                 height: '1px'
//                                             } : {
//                                                 top: 0,
//                                                 bottom: 0,
//                                                 left: `${line.position}px`,
//                                                 width: '1px'
//                                             })
//                                         }}
//                                     />
//                                 ))}

//                                 {/* Drop Target Indicator */}
//                                 {dragGuides.dropTarget && (
//                                     <div
//                                         className="absolute border-2 border-green-500 bg-green-500/10 rounded"
//                                         style={{
//                                             left: `${dragGuides.x}px`,
//                                             top: `${dragGuides.y}px`,
//                                             width: '100px',
//                                             height: '60px',
//                                             transform: 'translate(-50%, -50%)'
//                                         }}
//                                     >
//                                         <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded">
//                                             Drop here
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         {/* Empty State */}
//                         {rootComponents.length === 0 && (
//                             <div className="flex-1 flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-200 m-4 rounded-lg">
//                                 <div className="text-center mb-4">
//                                     <p className="text-lg font-medium">Drop a Section here</p>
//                                     <p className="text-sm text-gray-400">Start with a layout section</p>
//                                 </div>
//                                 {showSafeArea && (
//                                     <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-200">
//                                         <div className="font-medium mb-1">Email Safe Area Active</div>
//                                         <div>Content within {safeArea.width}px × {safeArea.height}px</div>
//                                         <div>Compatible with Gmail, Outlook, Apple Mail</div>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Warning Zones */}
//                     {showSafeArea && (
//                         <>
//                             <div
//                                 className="absolute top-0 bottom-0 bg-red-500/10 border-r border-red-500/20 pointer-events-none"
//                                 style={{ left: 0, width: `${safeArea.left}px` }}
//                             >
//                                 <div className="absolute top-2 left-2 text-xs text-red-600 opacity-70 transform -rotate-90 origin-left">
//                                     Unsafe Area
//                                 </div>
//                             </div>
//                             <div
//                                 className="absolute top-0 bottom-0 bg-red-500/10 border-l border-red-500/20 pointer-events-none"
//                                 style={{ right: 0, width: `${safeArea.right}px` }}
//                             >
//                                 <div className="absolute top-2 right-2 text-xs text-red-600 opacity-70 transform rotate-90 origin-right">
//                                     Unsafe Area
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// });

// // Canvas Component
// interface CanvasComponentProps {
//     component: TemplateComponent;
//     selectedId: string | null;
//     isDragging: boolean;
//     isResizing: boolean;
//     dragState: DragState;
//     inlineEditing: string | null;
//     onSelect: (id: string) => void;
//     onDelete: (id: string) => void;
//     onDuplicate: (id: string) => void;
//     onUpdate: (id: string, updates: Partial<TemplateComponent>) => void;
//     onResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
//     onComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
//     onDoubleClick: (e: React.MouseEvent) => void;
//     showGrid: boolean;
//     onSetInlineEditing: (id: string | null) => void;
//     onOpenEditor: (component: TemplateComponent) => void;
//     onContextMenu: (e: React.MouseEvent, componentId: string) => void;
//     closeContextMenu: () => void;
//     snapToGrid: boolean;
//     getAlignmentGuides: (component: TemplateComponent, position: { x: number; y: number }) => any;
// }

// const CanvasComponent = memo(function CanvasComponent({
//     component,
//     selectedId,
//     isDragging,
//     isResizing,
//     dragState,
//     inlineEditing,
//     onSelect,
//     onDelete,
//     onDuplicate,
//     onUpdate,
//     onResizeMouseDown,
//     onComponentMouseDown,
//     onDoubleClick,
//     showGrid,
//     onSetInlineEditing,
//     onOpenEditor,
//     onContextMenu,
//     closeContextMenu,
//     snapToGrid,
//     getAlignmentGuides,
// }: CanvasComponentProps) {
//     const isSelected = selectedId === component.id;
//     const isContainer = isContainerType(component.type);

//     // Make container components droppable
//     const { setNodeRef: setDroppableRef } = useDroppable({
//         id: component.id,
//         data: { type: component.type, isContainer }
//     });

//     const {
//         attributes,
//         listeners,
//         setNodeRef: setSortableRef,
//         transform,
//         transition,
//         isDragging: isSortableDragging
//     } = useSortable({
//         id: component.id,
//         data: { type: component.type, isContainer }
//     });

//     // Combine refs for both sortable and droppable
//     const setNodeRef = (node: HTMLElement | null) => {
//         setSortableRef(node);
//         if (isContainer) {
//             setDroppableRef(node);
//         }
//     };

//     const style = component.style || {};

//     // CRITICAL FIX: Position relative to safe area container with smooth transitions
//     const finalStyle: any = {
//         ...style,
//         position: 'absolute', // Use absolute positioning within safe area container
//         left: component.position?.x || 0,
//         top: component.position?.y || 0,
//         width: component.size?.width ? `${component.size.width}px` : style.width || '100%',
//         height: component.size?.height ? `${component.size.height}px` : style.height || 'auto',
//         minHeight: isContainer ? '50px' : 'auto',
//         transform: CSS.Transform.toString(transform),
//         transition: dragState.isDragging && dragState.draggedComponent?.id === component.id
//             ? 'none' // Disable transition during drag for smooth movement
//             : 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth transition for other movements
//         opacity: isSortableDragging ? 0.3 : (style.opacity || 1),
//         border: isSelected
//             ? '2px solid #3b82f6'
//             : isContainer
//                 ? '1px dashed #e5e7eb'
//                 : '1px dashed transparent',
//         outline: 'none',
//         zIndex: isSelected ? 10 : 1,
//         // STRICT: Prevent overflow beyond safe area
//         maxWidth: '100%',
//         boxSizing: 'border-box',
//         overflow: 'hidden',
//         // Enable dragging within safe area with smooth cursor transitions
//         cursor: isSelected && !isResizing ? 'move' : (isSortableDragging ? 'grabbing' : 'grab'),
//         // Add subtle shadow for depth when selected
//         boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
//         // Smooth scale effect on hover
//         transform: `${CSS.Transform.toString(transform)} ${isSelected ? 'scale(1.01)' : 'scale(1)'}`,
//     };

//     const handleExtensionClick = (e: React.MouseEvent, action: 'delete' | 'duplicate' | 'edit') => {
//         e.stopPropagation();
//         if (action === 'delete') onDelete(component.id);
//         if (action === 'duplicate') onDuplicate(component.id);
//         if (action === 'edit') onOpenEditor(component);
//     };

//     // Resize Handles Component - Professional Implementation
//     const ResizeHandles = () => {
//         if (!isSelected) return null;

//         // Professional resize limits based on component type
//         const getResizeLimits = () => {
//             switch (component.type) {
//                 case 'Section':
//                     return { minWidth: 300, maxWidth: 600, minHeight: 50, maxHeight: 800 };
//                 case 'Row':
//                     return { minWidth: 100, maxWidth: 600, minHeight: 30, maxHeight: 200 };
//                 case 'Column':
//                     return { minWidth: 50, maxWidth: 300, minHeight: 30, maxHeight: 500 };
//                 case 'Text':
//                     return { minWidth: 50, maxWidth: 600, minHeight: 20, maxHeight: 400 };
//                 case 'Button':
//                     return { minWidth: 80, maxWidth: 300, minHeight: 30, maxHeight: 60 };
//                 case 'Image':
//                     return { minWidth: 50, maxWidth: 600, minHeight: 30, maxHeight: 300 };
//                 default:
//                     return { minWidth: 50, maxWidth: 600, minHeight: 30, maxHeight: 200 };
//             }
//         };

//         // Show resize handles for all components (including containers)
//         // Container components can be resized too

//         const limits = getResizeLimits();
//         const cursors: Record<string, string> = {
//             'nw': 'nw-resize',
//             'n': 'n-resize',
//             'ne': 'ne-resize',
//             'e': 'e-resize',
//             'se': 'se-resize',
//             's': 's-resize',
//             'sw': 'sw-resize',
//             'w': 'w-resize'
//         };

//         const styles: Record<string, React.CSSProperties> = {
//             'nw': { top: '-4px', left: '-4px' },
//             'n': { top: '-4px', left: '50%', transform: 'translateX(-50%)' },
//             'ne': { top: '-4px', right: '-4px' },
//             'e': { top: '50%', right: '-4px', transform: 'translateY(-50%)' },
//             'se': { bottom: '-4px', right: '-4px' },
//             's': { bottom: '-4px', left: '50%', transform: 'translateX(-50%)' },
//             'sw': { bottom: '-4px', left: '-4px' },
//             'w': { top: '50%', left: '-4px', transform: 'translateY(-50%)' }
//         };

//         return (
//             <>
//                 {Object.entries(cursors).map(([direction, cursor]) => (
//                     <div
//                         key={direction}
//                         className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-blue-600 hover:scale-110 pointer-events-auto"
//                         style={{
//                             cursor,
//                             ...styles[direction],
//                             zIndex: 60,
//                         }}
//                         onMouseDown={(e) => {
//                             e.stopPropagation();
//                             e.preventDefault();
//                             onResizeMouseDown(e, component.id, direction);
//                         }}
//                     />
//                 ))}
//                 {/* Enhanced Dimensions label with smooth animation */}
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
//                     {Math.round(component.size?.width || 0)} × {Math.round(component.size?.height || 0)}
//                 </div>
//             </>
//         );
//     };
// }
//                         }}
// onContextMenu = {(e) => onContextMenu(e, component.id)}
// onClick = {(e) => {
//     e.stopPropagation();
//     onSelect(component.id);
//     closeContextMenu();
// }}
// onDoubleClick = {(e) => {
//     e.stopPropagation();
//     if (component.type === 'Text') onSetInlineEditing(component.id);
//     else onOpenEditor(component);
// }}
// {...(isResizing && selectedId === component.id ? {} : attributes) }
// {...(isResizing && selectedId === component.id ? {} : listeners) }
//                     >
//     {/* Enhanced Component Actions with smooth animations */ }
// {
//     isSelected && (
//         <div className="absolute -top-8 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-50">
//             <button
//                 onClick={(e) => handleExtensionClick(e, 'edit')}
//                 className="w-6 h-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm"
//                 title="Edit component"
//             >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//             </button>
//             <button
//                 onClick={(e) => handleExtensionClick(e, 'duplicate')}
//                 className="w-6 h-6 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm"
//                 title="Duplicate component"
//             >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                 </svg>
//             </button>
//             <button
//                 onClick={(e) => handleExtensionClick(e, 'delete')}
//                 className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-200 hover:scale-110 flex items-center justify-center shadow-sm"
//                 title="Delete component"
//             >
//                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//             </button>
//         </div>
//     )
// }

// {/* Component Label */ }
// {
//     (isSelected || isContainer) && (
//         <div className={`
//                     absolute top-0 left-0 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-br shadow-xs z-50 pointer-events-none transition-opacity
//                     ${isSelected ? 'bg-blue-600 text-white opacity-100' : 'bg-gray-100/80 text-gray-500 opacity-0 group-hover:opacity-100'}
//                 `}>
//             {component.type}
//         </div>
//     )
// }

// {/* Component Content with Nested Children */ }
// <div style={{ width: '100%', height: '100%' }} className={isResizing && selectedId === component.id ? 'pointer-events-none' : ''}>
//     {/* Render children if this is a container */}
//     {isContainer && component.children && component.children.length > 0 && (
//         <div style={{
//             width: '100%',
//             height: '100%',
//             position: 'relative'
//         }}>
//             {component.children.map((child) => (
//                 <CanvasComponent
//                     key={child.id}
//                     component={child}
//                     selectedId={selectedId}
//                     isDragging={isDragging}
//                     isResizing={isResizing}
//                     dragState={dragState}
//                     inlineEditing={inlineEditing}
//                     onSelect={onSelect}
//                     onDelete={onDelete}
//                     onDuplicate={onDuplicate}
//                     onUpdate={onUpdate}
//                     onResizeMouseDown={onResizeMouseDown}
//                     onComponentMouseDown={onComponentMouseDown}
//                     onDoubleClick={onDoubleClick}
//                     showGrid={showGrid}
//                     onSetInlineEditing={onSetInlineEditing}
//                     onOpenEditor={onOpenEditor}
//                     onContextMenu={onContextMenu}
//                     closeContextMenu={closeContextMenu}
//                     snapToGrid={snapToGrid}
//                     getAlignmentGuides={getAlignmentGuides}
//                 />
//             ))}
//         </div>
//     )}

//     {/* Fallback content for empty containers or non-containers */}
//     {(!isContainer || !component.children || component.children.length === 0) && (
//         <>
//             {String(component.type) === 'Section' && (
//                 <div style={{
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: '#f9fafb',
//                     border: '1px dashed #e5e7eb',
//                     borderRadius: '4px',
//                     padding: '8px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#9ca3af',
//                     fontSize: '12px'
//                 }}>
//                     Drop components here
//                 </div>
//             )}
//             {String(component.type) === 'Row' && (
//                 <div style={{
//                     width: '100%',
//                     height: '100%',
//                     display: 'flex',
//                     gap: '4px',
//                     backgroundColor: '#f3f4f6',
//                     padding: '4px',
//                     border: '1px dashed #d1d5db',
//                     borderRadius: '4px',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#9ca3af',
//                     fontSize: '12px'
//                 }}>
//                     Drop columns here
//                 </div>
//             )}
//             {String(component.type) === 'Column' && (
//                 <div style={{
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: '#fef3c7',
//                     padding: '4px',
//                     border: '1px dashed #fbbf24',
//                     borderRadius: '4px',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#92400e',
//                     fontSize: '12px',
//                     display: 'flex'
//                 }}>
//                     Drop content here
//                 </div>
//             )}
//             {String(component.type) === 'Text' && (
//                 <div style={{ padding: '8px' }}>
//                     <div style={{
//                         backgroundColor: '#f3f4f6',
//                         padding: '8px',
//                         borderRadius: '4px',
//                         border: '1px solid #e5e7eb',
//                         color: '#374151'
//                     } as React.CSSProperties}>
//                         {String(component.props?.children) || 'Text Content'}
//                     </div>
//                 </div>
//             )}
//             {String(component.type) === 'Button' && (
//                 <div style={{ padding: '8px', textAlign: 'center' }}>
//                     <button style={{
//                         backgroundColor: component.style?.backgroundColor || '#3b82f6',
//                         color: component.style?.textColor || 'white',
//                         padding: '8px 16px',
//                         borderRadius: component.style?.borderRadius || '4px',
//                         border: 'none'
//                     }}>
//                         {String(component.props?.children) || 'Button'}
//                     </button>
//                 </div>
//             )}
//             {String(component.type) === 'Image' && (
//                 <div style={{ padding: '8px', textAlign: 'center' }}>
//                     <div style={{
//                         width: component.size?.width ? `${component.size.width * 0.6}px` : '100px',
//                         height: component.size?.height ? `${component.size.height * 0.6}px` : '60px',
//                         backgroundColor: '#e5e7eb',
//                         margin: '0 auto',
//                         borderRadius: component.style?.borderRadius || '4px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: '#6b7280',
//                         fontSize: '12px'
//                     }}>
//                         {(component.props?.alt as string) || 'Image'}
//                     </div>
//                 </div>
//             )}
//             {String(component.type) === 'Divider' && (
//                 <div style={{ padding: '8px' }}>
//                     <div style={{
//                         height: (component.props?.thickness || '1px') as React.CSSProperties['height'],
//                         backgroundColor: component.style?.backgroundColor || '#e5e7eb',
//                         width: '100%'
//                     } as React.CSSProperties} />
//                 </div>
//             )}
//             {String(component.type) === 'Spacer' && (
//                 <div style={{
//                     height: component.props?.height || component.size?.height || '20px',
//                     width: '100%',
//                     backgroundColor: 'transparent',
//                     border: '1px dashed #d1d5db',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: '#9ca3af',
//                     fontSize: '10px'
//                 }}>
//                     Spacer
//                 </div>
//             )}
//         </>
//     )}
// </div>

// {/* Resize Handles */ }
// <ResizeHandles />
//                     </div >
//                 );
// });

// export default BuilderCanvas;
