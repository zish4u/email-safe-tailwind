"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { TemplateComponent, GRID_SIZE, SAFE_AREA_PADDING, CANVAS_SIZES, PreviewMode } from '../types';

export interface DragGuides {
    x: number;
    y: number;
    showAlignmentLines?: boolean;
    alignmentLines?: { type: 'horizontal' | 'vertical'; position: number }[];
    dropTarget?: string;
    canDrop?: boolean;
}

export interface DragState {
    isDragging: boolean;
    draggedComponent: TemplateComponent | null;
    dragOffset: { x: number; y: number };
    initialPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
    dropTarget: string | null;
    canDrop: boolean;
}

export interface ResizeStart {
    x: number;
    y: number;
    width: number;
    height: number;
    componentX: number;
    componentY: number;
}

export interface UseCanvasInteractionsProps {
    components: TemplateComponent[];
    selectedComponent: string | null;
    setSelectedComponent: (id: string | null) => void;
    updateComponentPosition: (id: string, x: number, y: number, width?: number, height?: number) => void;
    previewMode: PreviewMode;
    snapToGrid: boolean;
    canvasZoom: number;
}

export interface UseCanvasInteractionsReturn {
    // State
    isDragging: boolean;
    isResizing: boolean;
    dragGuides: DragGuides | null;
    dragState: DragState;
    canvasRef: React.RefObject<HTMLDivElement | null>;

    // Handlers
    handleResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
    handleCanvasMouseMove: (e: React.MouseEvent) => void;
    handleCanvasMouseUp: () => void;
    handleCanvasClick: (e: React.MouseEvent) => void;
    handleComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
}

/**
 * Hook for managing canvas drag and resize interactions
 */
export function useCanvasInteractions({
    components,
    selectedComponent,
    setSelectedComponent,
    updateComponentPosition,
    previewMode,
    snapToGrid,
    canvasZoom,
}: UseCanvasInteractionsProps): UseCanvasInteractionsReturn {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragGuides, setDragGuides] = useState<DragGuides | null>(null);
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        draggedComponent: null,
        dragOffset: { x: 0, y: 0 },
        initialPosition: { x: 0, y: 0 },
        currentPosition: { x: 0, y: 0 },
        dropTarget: null,
        canDrop: false,
    });
    const [resizeStart, setResizeStart] = useState<ResizeStart>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        componentX: 0,
        componentY: 0,
    });
    const [resizeDirection, setResizeDirection] = useState('');

    // Get canvas boundaries
    const getCanvasBoundaries = useCallback(() => {
        return {
            width: CANVAS_SIZES[previewMode].width,
            height: CANVAS_SIZES[previewMode].height,
            left: canvasRef.current?.getBoundingClientRect().left || 0,
            top: canvasRef.current?.getBoundingClientRect().top || 0,
        };
    }, [previewMode]);



    // Handle component mouse down for smooth dragging
    const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const component = components.find(c => c.id === componentId);
        if (!component) return;

        setSelectedComponent(componentId);

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const componentX = component.position?.x || 0;
        const componentY = component.position?.y || 0;

        // Calculate drag offset relative to component position
        const mouseX = (e.clientX - rect.left) / canvasZoom;
        const mouseY = (e.clientY - rect.top) / canvasZoom;

        setDragState({
            isDragging: true,
            draggedComponent: component,
            dragOffset: {
                x: mouseX - componentX,
                y: mouseY - componentY
            },
            initialPosition: { x: componentX, y: componentY },
            currentPosition: { x: componentX, y: componentY },
            dropTarget: null,
            canDrop: true,
        });

        setIsDragging(true);
    }, [components, setSelectedComponent, canvasZoom]);

    // Handle resize mouse down
    const handleResizeMouseDown = useCallback((e: React.MouseEvent, componentId: string, direction: string) => {
        e.stopPropagation();
        e.preventDefault();

        const component = components.find(c => c.id === componentId);
        if (!component) return;

        setSelectedComponent(componentId);
        setIsResizing(true);
        setResizeDirection(direction);
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            width: component.size?.width || 150,
            height: component.size?.height || 100,
            componentX: component.position?.x || 0,
            componentY: component.position?.y || 0,
        });
    }, [components, setSelectedComponent]);

    // Handle canvas mouse move for drag/resize
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        if (dragState.isDragging && dragState.draggedComponent) {
            // Smooth dragging implementation
            const mouseX = (e.clientX - rect.left) / canvasZoom;
            const mouseY = (e.clientY - rect.top) / canvasZoom;

            let newX = mouseX - dragState.dragOffset.x;
            let newY = mouseY - dragState.dragOffset.y;

            // Apply grid snapping
            if (snapToGrid) {
                newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }

            // Apply safe area constraints
            newX = Math.max(SAFE_AREA_PADDING, Math.min(newX, CANVAS_SIZES[previewMode].width - (dragState.draggedComponent.size?.width || 150) - SAFE_AREA_PADDING));
            newY = Math.max(SAFE_AREA_PADDING, Math.min(newY, CANVAS_SIZES[previewMode].height - (dragState.draggedComponent.size?.height || 100) - SAFE_AREA_PADDING));

            // Update drag state for smooth visual feedback
            setDragState(prev => ({
                ...prev,
                currentPosition: { x: newX, y: newY }
            }));

            // Update guides with alignment detection
            const alignmentLines = getAlignmentLines(dragState.draggedComponent, { x: newX, y: newY });
            setDragGuides({
                x: newX,
                y: newY,
                showAlignmentLines: alignmentLines.length > 0,
                alignmentLines,
                dropTarget: undefined,
                canDrop: true,
            });

            // Update component position
            updateComponentPosition(dragState.draggedComponent.id, newX, newY);
        }

        if (isResizing) {
            const deltaX = (e.clientX - resizeStart.x) / canvasZoom;
            const deltaY = (e.clientY - resizeStart.y) / canvasZoom;

            let newWidth = resizeStart.width;
            let newHeight = resizeStart.height;
            let newX = resizeStart.componentX;
            let newY = resizeStart.componentY;

            // Handle resize based on direction
            if (resizeDirection.includes('e')) {
                newWidth = Math.max(40, resizeStart.width + deltaX);
            }
            if (resizeDirection.includes('w')) {
                const widthChange = Math.min(deltaX, resizeStart.width - 40);
                newWidth = resizeStart.width - widthChange;
                newX = resizeStart.componentX + widthChange;
            }
            if (resizeDirection.includes('s')) {
                newHeight = Math.max(20, resizeStart.height + deltaY);
            }
            if (resizeDirection.includes('n')) {
                const heightChange = Math.min(deltaY, resizeStart.height - 20);
                newHeight = resizeStart.height - heightChange;
                newY = resizeStart.componentY + heightChange;
            }

            // Apply grid snapping
            if (snapToGrid) {
                newWidth = Math.round(newWidth / GRID_SIZE) * GRID_SIZE;
                newHeight = Math.round(newHeight / GRID_SIZE) * GRID_SIZE;
                newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }

            // Apply safe area constraints
            const boundaries = getCanvasBoundaries();
            newX = Math.max(SAFE_AREA_PADDING, newX);
            newY = Math.max(SAFE_AREA_PADDING, newY);
            newWidth = Math.min(newWidth, boundaries.width - newX - SAFE_AREA_PADDING);
            newHeight = Math.min(newHeight, boundaries.height - newY - SAFE_AREA_PADDING);

            const resizingComponent = components.find(c => c.id === selectedComponent);
            if (resizingComponent) {
                updateComponentPosition(resizingComponent.id, newX, newY, newWidth, newHeight);
                setDragGuides({ x: newX, y: newY });
            }
        }
    }, [
        components,
        selectedComponent,
        dragState,
        isResizing,
        resizeStart,
        resizeDirection,
        snapToGrid,
        canvasZoom,
        getCanvasBoundaries,
        updateComponentPosition,
    ]);

    // Helper function to get alignment lines
    const getAlignmentLines = (component: TemplateComponent, position: { x: number; y: number }) => {
        const lines: { type: 'horizontal' | 'vertical'; position: number }[] = [];
        const tolerance = 5;

        components.forEach(other => {
            if (other.id === component.id) return;

            const otherLeft = other.position?.x || 0;
            const otherCenter = otherLeft + (other.size?.width || 0) / 2;
            const otherRight = otherLeft + (other.size?.width || 0);
            const otherTop = other.position?.y || 0;
            const otherMiddle = otherTop + (other.size?.height || 0) / 2;
            const otherBottom = otherTop + (other.size?.height || 0);

            const compLeft = position.x;
            const compCenter = compLeft + (component.size?.width || 0) / 2;
            const compRight = compLeft + (component.size?.width || 0);
            const compTop = position.y;
            const compMiddle = compTop + (component.size?.height || 0) / 2;
            const compBottom = compTop + (component.size?.height || 0);

            // Check for alignment
            if (Math.abs(compLeft - otherLeft) < tolerance) lines.push({ type: 'vertical', position: otherLeft });
            if (Math.abs(compCenter - otherCenter) < tolerance) lines.push({ type: 'vertical', position: otherCenter });
            if (Math.abs(compRight - otherRight) < tolerance) lines.push({ type: 'vertical', position: otherRight });
            if (Math.abs(compTop - otherTop) < tolerance) lines.push({ type: 'horizontal', position: otherTop });
            if (Math.abs(compMiddle - otherMiddle) < tolerance) lines.push({ type: 'horizontal', position: otherMiddle });
            if (Math.abs(compBottom - otherBottom) < tolerance) lines.push({ type: 'horizontal', position: otherBottom });
        });

        return lines;
    };

    // Handle canvas mouse up
    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setDragGuides(null);
        setDragState({
            isDragging: false,
            draggedComponent: null,
            dragOffset: { x: 0, y: 0 },
            initialPosition: { x: 0, y: 0 },
            currentPosition: { x: 0, y: 0 },
            dropTarget: null,
            canDrop: false,
        });
    }, []);

    // Handle canvas click to deselect
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setSelectedComponent(null);
        }
    }, [setSelectedComponent]);

    // Global mouse up listener
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setDragGuides(null);
            setDragState({
                isDragging: false,
                draggedComponent: null,
                dragOffset: { x: 0, y: 0 },
                initialPosition: { x: 0, y: 0 },
                currentPosition: { x: 0, y: 0 },
                dropTarget: null,
                canDrop: false,
            });
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return {
        isDragging,
        isResizing,
        dragGuides,
        dragState,
        canvasRef,
        handleResizeMouseDown,
        handleCanvasMouseMove,
        handleCanvasMouseUp,
        handleCanvasClick,
        handleComponentMouseDown,
    };
}

export default useCanvasInteractions;
