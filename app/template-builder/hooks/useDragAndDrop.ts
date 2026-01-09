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
    const getComponentById = useBuilderStore((state) => state.getComponentById);

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

            // Smart parent detection
            let parentId = overData?.parentId || null;

            // Special handling for columns
            if (componentType === 'column') {
                // If dropping over a droppable zone with a parent (e.g., dropping ONTO a component that accepts children)
                if (overData?.parentId) {
                    const targetParent = getComponentById(overData.parentId);

                    // If parent is a section, use it as parent (columns belong in sections)
                    if (targetParent?.type === 'section') {
                        parentId = overData.parentId;
                    }
                    // CRITICAL FIX: If dropping onto a column, put it in the column's parent (the section)
                    else if (targetParent?.type === 'column') {
                        // Find the parent of the column (which should be a section)
                        const findParent = (components: any[], targetId: string, currentParentId: string | null = null): string | null => {
                            for (const comp of components) {
                                if (comp.id === targetId) return currentParentId;
                                if (comp.children) {
                                    const found = findParent(comp.children, targetId, comp.id);
                                    if (found !== null) return found;
                                }
                            }
                            return null;
                        };

                        const state = useBuilderStore.getState();
                        parentId = findParent(state.components, targetParent.id);
                    }
                }
                // If dropping over a canvas component directly (that might not be a drop zone itself)
                else if (overData?.componentId) {
                    const overComponent = getComponentById(overData.componentId);

                    // If dropping over another column, find its parent (the section)
                    if (overComponent?.type === 'column') {
                        // Get the parent from the component tree
                        const findParent = (components: any[], targetId: string, parentId: string | null = null): string | null => {
                            for (const comp of components) {
                                if (comp.id === targetId) return parentId;
                                if (comp.children) {
                                    const found = findParent(comp.children, targetId, comp.id);
                                    if (found !== null) return found;
                                }
                            }
                            return null;
                        };

                        const state = useBuilderStore.getState();
                        parentId = findParent(state.components, overComponent.id);
                    }
                    // If dropping over a section, use it as parent
                    else if (overComponent?.type === 'section') {
                        parentId = overComponent.id;
                    }
                }
            }
            // For non-column components
            else {
                // If dropping over a column, the column becomes the parent
                if (overData?.componentId) {
                    const overComponent = getComponentById(overData.componentId);
                    if (overComponent?.type === 'column') {
                        parentId = overComponent.id;
                    }
                }
                // Otherwise, use the parentId from the drop zone
                else if (overData?.parentId) {
                    parentId = overData.parentId;
                }
            }

            console.log('Adding component:', { type: componentType, parentId });
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
