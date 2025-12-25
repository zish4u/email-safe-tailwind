"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { TemplateComponent, GRID_SIZE, SAFE_AREA_PADDING, CANVAS_SIZES, PreviewMode } from '../types';

export interface DragGuides {
    x: number;
    y: number;
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
    canvasScale: number;
}

export interface UseCanvasInteractionsReturn {
    // State
    isDragging: boolean;
    isResizing: boolean;
    dragGuides: DragGuides | null;
    canvasRef: React.RefObject<HTMLDivElement | null>;

    // Handlers
    handleComponentMouseDown: (e: React.MouseEvent, componentId: string) => void;
    handleResizeMouseDown: (e: React.MouseEvent, componentId: string, direction: string) => void;
    handleCanvasMouseMove: (e: React.MouseEvent) => void;
    handleCanvasMouseUp: () => void;
    handleCanvasClick: (e: React.MouseEvent) => void;
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
    canvasScale,
}: UseCanvasInteractionsProps): UseCanvasInteractionsReturn {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragGuides, setDragGuides] = useState<DragGuides | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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

    // Handle component mouse down for dragging
    const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
        e.stopPropagation();

        const component = components.find(c => c.id === componentId);
        if (!component) return;

        setSelectedComponent(componentId);
        setIsDragging(true);

        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const mouseX = (e.clientX - rect.left) / canvasScale;
            const mouseY = (e.clientY - rect.top) / canvasScale;
            setDragOffset({
                x: mouseX - (component.position?.x || 0),
                y: mouseY - (component.position?.y || 0),
            });
        }
    }, [components, setSelectedComponent, canvasScale]);

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
        const component = components.find(c => c.id === selectedComponent);
        if (!component) return;

        const boundaries = getCanvasBoundaries();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        if (isDragging) {
            const mouseX = (e.clientX - rect.left) / canvasScale;
            const mouseY = (e.clientY - rect.top) / canvasScale;

            let newX = mouseX - dragOffset.x;
            let newY = mouseY - dragOffset.y;

            // Apply grid snapping
            if (snapToGrid) {
                newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
                newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
            }

            // Apply safe area constraints
            const compWidth = component.size?.width || 150;
            const compHeight = component.size?.height || 100;
            newX = Math.max(SAFE_AREA_PADDING, Math.min(newX, boundaries.width - compWidth - SAFE_AREA_PADDING));
            newY = Math.max(SAFE_AREA_PADDING, Math.min(newY, boundaries.height - compHeight - SAFE_AREA_PADDING));

            updateComponentPosition(component.id, newX, newY);
            setDragGuides({ x: newX, y: newY });
        }

        if (isResizing) {
            const deltaX = (e.clientX - resizeStart.x) / canvasScale;
            const deltaY = (e.clientY - resizeStart.y) / canvasScale;

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
            newX = Math.max(SAFE_AREA_PADDING, newX);
            newY = Math.max(SAFE_AREA_PADDING, newY);
            newWidth = Math.min(newWidth, boundaries.width - newX - SAFE_AREA_PADDING);
            newHeight = Math.min(newHeight, boundaries.height - newY - SAFE_AREA_PADDING);

            updateComponentPosition(component.id, newX, newY, newWidth, newHeight);
            setDragGuides({ x: newX, y: newY });
        }
    }, [
        components,
        selectedComponent,
        isDragging,
        isResizing,
        dragOffset,
        resizeStart,
        resizeDirection,
        snapToGrid,
        canvasScale,
        getCanvasBoundaries,
        updateComponentPosition,
    ]);

    // Handle canvas mouse up
    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setDragGuides(null);
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
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return {
        isDragging,
        isResizing,
        dragGuides,
        canvasRef,
        handleComponentMouseDown,
        handleResizeMouseDown,
        handleCanvasMouseMove,
        handleCanvasMouseUp,
        handleCanvasClick,
    };
}

export default useCanvasInteractions;
