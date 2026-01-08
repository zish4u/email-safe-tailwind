/**
 * Drag and Drop Hook
 * 
 * Custom hook to handle drag and drop interactions using @dnd-kit.
 */

import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useBuilderStore } from '../store';
import { createComponentByType } from '../utils/componentFactory';
import type { ComponentType } from '../types';

export function useDragAndDrop() {
    const addComponent = useBuilderStore((state) => state.addComponent);
    const moveComponent = useBuilderStore((state) => state.moveComponent);

    const handleDragStart = (event: DragStartEvent) => {
        // Optional: Could add visual feedback here
        console.log('Drag started:', event);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Dragging from component library to canvas
        if (activeData?.type === 'library') {
            const componentType = activeData.componentType as ComponentType;
            const newComponent = createComponentByType(componentType);

            // Determine parent
            const parentId = overData?.parentId || null;

            addComponent(newComponent, parentId);
        }

        // Dragging within canvas (reordering)
        if (activeData?.type === 'canvas' && overData?.type === 'canvas') {
            const sourceId = activeData.componentId;
            const targetParentId = overData.parentId;

            if (sourceId !== targetParentId) {
                moveComponent(sourceId, targetParentId, 0);
            }
        }
    };

    return {
        handleDragStart,
        handleDragEnd,
    };
}
