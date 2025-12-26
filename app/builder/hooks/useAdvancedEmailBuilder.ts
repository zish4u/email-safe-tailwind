// =====================================================
// Advanced Email Builder Hooks - Drag & Drop with Unlimited Nesting
// =====================================================

import { useState, useCallback } from 'react';
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
    HIERARCHY_RULES,
    canPlaceInParent,
    ComponentType,
    DEFAULT_MODULE_PROPS,
    DEFAULT_GRID_PROPS,
    DEFAULT_GRID_ITEM_PROPS,
    DEFAULT_GROUP_PROPS,
    DEFAULT_TEXT_PROPS,
    DEFAULT_IMAGE_PROPS,
    DEFAULT_BUTTON_PROPS,
    DEFAULT_DIVIDER_PROPS,
    DEFAULT_SPACER_PROPS
} from '../advanced-types';

// ==================== STATE MANAGEMENT ====================

export interface BuilderState {
    components: EmailComponent[];
    selectedComponent: string | null;
    clipboard: EmailComponent | null;
    history: {
        past: EmailComponent[][];
        present: EmailComponent[];
        future: EmailComponent[][];
    };
}

export interface BuilderActions {
    // Component operations
    addComponent: (type: ComponentType, parentId?: string, index?: number) => string;
    updateComponent: (id: string, updates: Partial<EmailComponent>) => void;
    deleteComponent: (id: string) => void;
    duplicateComponent: (id: string) => string;
    moveComponent: (id: string, newParentId?: string, newIndex?: number) => void;

    // Selection
    selectComponent: (id: string | null) => void;

    // History
    undo: () => void;
    redo: () => void;

    // Clipboard
    copyComponent: (id: string) => void;
    pasteComponent: (parentId?: string) => string | null;

    // Group operations
    groupComponents: (ids: string[]) => string;
    ungroupComponent: (id: string) => void;

    // Grid operations
    convertToGrid: (ids: string[], columns?: number) => string;
    addGridColumn: (gridId: string) => void;
    removeGridColumn: (gridId: string, columnIndex: number) => void;
}

// ==================== MAIN BUILDER HOOK ====================

export function useAdvancedEmailBuilder(): BuilderState & BuilderActions {
    const [state, setState] = useState<BuilderState>(() => ({
        components: [],
        selectedComponent: null,
        clipboard: null,
        history: {
            past: [],
            present: [],
            future: [],
        },
    }));

    // ==================== HELPER FUNCTIONS ====================

    const generateId = useCallback(() => {
        return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    const findComponent = useCallback((id: string, components: EmailComponent[] = state.components): EmailComponent | null => {
        for (const component of components) {
            if (component.id === id) return component;
            if ('children' in component && component.children) {
                const found = findComponent(id, component.children);
                if (found) return found;
            }
        }
        return null;
    }, [state.components]);

    const findParent = useCallback((id: string, components: EmailComponent[] = state.components, parent: EmailComponent | null = null): EmailComponent | null => {
        for (const component of components) {
            if (component.id === id) return parent;
            if ('children' in component && component.children) {
                const found = findParent(id, component.children, component);
                if (found) return found;
            }
        }
        return null;
    }, [state.components]);

    const updateComponentRecursive = useCallback((components: EmailComponent[], id: string, updates: Partial<EmailComponent>): EmailComponent[] => {
        return components.map(component => {
            if (component.id === id) {
                return { ...component, ...updates } as EmailComponent;
            }
            if ('children' in component && component.children) {
                return {
                    ...component,
                    children: updateComponentRecursive(component.children, id, updates)
                } as EmailComponent;
            }
            return component;
        });
    }, []);

    const deleteComponentRecursive = useCallback((components: EmailComponent[], id: string): EmailComponent[] => {
        return components
            .filter(component => component.id !== id)
            .map(component => {
                if ('children' in component && component.children) {
                    return {
                        ...component,
                        children: deleteComponentRecursive(component.children, id)
                    };
                }
                return component;
            });
    }, []);

    const addToParent = useCallback((components: EmailComponent[], parentId: string, newComponent: EmailComponent, index?: number): EmailComponent[] => {
        return components.map(component => {
            if (component.id === parentId && 'children' in component) {
                const children = [...(component.children || [])];
                if (index !== undefined) {
                    children.splice(index, 0, newComponent);
                } else {
                    children.push(newComponent);
                }
                return { ...component, children };
            }
            if ('children' in component && component.children) {
                return {
                    ...component,
                    children: addToParent(component.children, parentId, newComponent, index)
                };
            }
            return component;
        });
    }, []);

    // ==================== COMPONENT CREATION ====================

    const createComponent = useCallback((type: ComponentType): EmailComponent => {
        const id = generateId();
        const baseComponent = { id, type };

        switch (type) {
            case 'Module': {
                const module: ModuleComponent = {
                    id,
                    type: 'Module' as const,
                    props: { ...DEFAULT_MODULE_PROPS },
                    children: []
                };
                return module;
            }

            case 'Grid': {
                const grid: GridComponent = {
                    id,
                    type: 'Grid' as const,
                    props: { ...DEFAULT_GRID_PROPS },
                    children: []
                };
                return grid;
            }

            case 'GridItem': {
                const gridItem: GridItemComponent = {
                    id,
                    type: 'GridItem' as const,
                    props: { ...DEFAULT_GRID_ITEM_PROPS },
                    children: [],
                    columnIndex: 0
                };
                return gridItem;
            }

            case 'Group': {
                const group: GroupComponent = {
                    id,
                    type: 'Group' as const,
                    props: { ...DEFAULT_GROUP_PROPS },
                    children: []
                };
                return group;
            }

            case 'Text': {
                const text: TextElement = {
                    id,
                    type: 'Text' as const,
                    props: { ...DEFAULT_TEXT_PROPS }
                };
                return text;
            }

            case 'Image': {
                const image: ImageElement = {
                    id,
                    type: 'Image' as const,
                    props: { ...DEFAULT_IMAGE_PROPS }
                };
                return image;
            }

            case 'Button': {
                const button: ButtonElement = {
                    id,
                    type: 'Button' as const,
                    props: { ...DEFAULT_BUTTON_PROPS }
                };
                return button;
            }

            case 'Divider': {
                const divider: DividerElement = {
                    id,
                    type: 'Divider' as const,
                    props: { ...DEFAULT_DIVIDER_PROPS }
                };
                return divider;
            }

            case 'Spacer': {
                const spacer: SpacerElement = {
                    id,
                    type: 'Spacer' as const,
                    props: { ...DEFAULT_SPACER_PROPS }
                };
                return spacer;
            }

            default:
                throw new Error(`Unknown component type: ${type}`);
        }
    }, [generateId]);

    // ==================== BUILDER ACTIONS ====================

    const addComponent = useCallback((type: ComponentType, parentId?: string, index?: number): string => {
        const newComponent = createComponent(type);

        setState(prevState => {
            let newComponents: EmailComponent[];

            if (parentId) {
                const parent = findComponent(parentId, prevState.components);
                if (!parent || !('children' in parent)) {
                    console.warn(`Parent component ${parentId} not found or cannot have children`);
                    return prevState;
                }

                if (!canPlaceInParent(type, parent.type)) {
                    console.warn(`Cannot place ${type} in ${parent.type}`);
                    return prevState;
                }

                newComponents = addToParent(prevState.components, parentId, newComponent, index);
            } else {
                newComponents = [...prevState.components, newComponent];
            }

            return {
                ...prevState,
                components: newComponents,
                selectedComponent: newComponent.id,
                history: {
                    ...prevState.history,
                    past: [...prevState.history.past, prevState.components],
                    present: newComponents,
                    future: []
                }
            };
        });

        return newComponent.id;
    }, [createComponent, findComponent, addToParent]);

    const updateComponent = useCallback((id: string, updates: Partial<EmailComponent>) => {
        setState(prevState => ({
            ...prevState,
            components: updateComponentRecursive(prevState.components, id, updates),
            history: {
                ...prevState.history,
                past: [...prevState.history.past, prevState.components],
                present: updateComponentRecursive(prevState.components, id, updates),
                future: []
            }
        }));
    }, [updateComponentRecursive]);

    const deleteComponent = useCallback((id: string) => {
        setState(prevState => {
            const newComponents = deleteComponentRecursive(prevState.components, id);

            return {
                ...prevState,
                selectedComponent: prevState.selectedComponent === id ? null : prevState.selectedComponent,
                components: newComponents,
                history: {
                    ...prevState.history,
                    past: [...prevState.history.past, prevState.components],
                    present: newComponents,
                    future: [],
                }
            };
        });
    }, [deleteComponentRecursive]);

    const duplicateComponent = useCallback((id: string): string => {
        const component = findComponent(id);
        if (!component) return '';

        const duplicate = JSON.parse(JSON.stringify(component));
        duplicate.id = generateId();

        // Recursively update all nested IDs
        const updateNestedIds = (comp: EmailComponent): void => {
            comp.id = generateId();
            if ('children' in comp && comp.children) {
                comp.children.forEach(updateNestedIds);
            }
        };
        updateNestedIds(duplicate);

        const parent = findParent(id);
        if (parent) {
            setState(prevState => ({
                ...prevState,
                components: addToParent(prevState.components, parent.id, duplicate),
                selectedComponent: duplicate.id,
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                components: [...prevState.components, duplicate],
                selectedComponent: duplicate.id,
            }));
        }

        return duplicate.id;
    }, [findComponent, findParent, generateId, addToParent]);

    const moveComponent = useCallback((id: string, newParentId?: string, newIndex?: number) => {
        setState(prevState => {
            const component = findComponent(id);
            if (!component) return prevState;

            let newComponents = deleteComponentRecursive(prevState.components, id);

            if (newParentId) {
                const newParent = findComponent(newParentId, newComponents);
                if (!newParent || !('children' in newParent)) {
                    console.warn(`Cannot move to parent ${newParentId}: not found or not a container`);
                    return prevState;
                }

                if (!canPlaceInParent(component.type, newParent.type)) {
                    console.warn(`Cannot place ${component.type} inside ${newParent.type}`);
                    return prevState;
                }

                newComponents = addToParent(newComponents, newParentId, component, newIndex);
            } else {
                // Move to root
                if (newIndex !== undefined) {
                    const root = [...newComponents];
                    root.splice(newIndex, 0, component);
                    newComponents = root;
                } else {
                    newComponents = [...newComponents, component];
                }
            }

            return {
                ...prevState,
                components: newComponents,
                history: {
                    ...prevState.history,
                    past: [...prevState.history.past, prevState.components],
                    present: newComponents,
                    future: [],
                }
            };
        });
    }, [findComponent, findParent, deleteComponentRecursive, addToParent]);

    const selectComponent = useCallback((id: string | null) => {
        setState(prevState => ({
            ...prevState,
            selectedComponent: id,
        }));
    }, []);

    const undo = useCallback(() => {
        setState(prevState => {
            const { past, present, future } = prevState.history;
            if (past.length === 0) return prevState;

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                ...prevState,
                components: previous,
                history: {
                    past: newPast,
                    present: previous,
                    future: [present, ...future],
                }
            };
        });
    }, []);

    const redo = useCallback(() => {
        setState(prevState => {
            const { past, present, future } = prevState.history;
            if (future.length === 0) return prevState;

            const next = future[0];
            const newFuture = future.slice(1);

            return {
                ...prevState,
                components: next,
                history: {
                    past: [...past, present],
                    present: next,
                    future: newFuture,
                }
            };
        });
    }, []);

    const copyComponent = useCallback((id: string) => {
        const component = findComponent(id);
        if (component) {
            setState(prevState => ({
                ...prevState,
                clipboard: component,
            }));
        }
    }, [findComponent]);

    const pasteComponent = useCallback((parentId?: string): string | null => {
        if (!state.clipboard) return null;

        const duplicate = JSON.parse(JSON.stringify(state.clipboard));
        const updateNestedIds = (comp: EmailComponent): void => {
            comp.id = generateId();
            if ('children' in comp && comp.children) {
                (comp.children as EmailComponent[]).forEach(updateNestedIds);
            }
        };
        updateNestedIds(duplicate);

        const newId = addComponent(duplicate.type, parentId);
        return newId;
    }, [state.clipboard, generateId, addComponent]);

    const groupComponents = useCallback((ids: string[]): string => {
        const components = ids.map(id => findComponent(id)).filter(Boolean) as EmailComponent[];
        if (components.length < 2) return '';

        const groupId = addComponent('Group');

        // Move all selected components into the group
        components.forEach((component, index) => {
            moveComponent(component.id, groupId);
        });

        return groupId;
    }, [findComponent, addComponent, moveComponent]);

    const ungroupComponent = useCallback((id: string) => {
        const group = findComponent(id) as GroupComponent;
        if (!group || group.type !== 'Group') return;

        const parent = findParent(id);
        const children = group.children || [];

        // Move all children to the parent
        children.forEach((child, index) => {
            moveComponent(child.id, parent?.id);
        });

        // Delete the group
        deleteComponent(id);
    }, [findComponent, findParent, deleteComponent, moveComponent]);

    const convertToGrid = useCallback((ids: string[], columns: number = 2): string => {
        const components = ids.map(id => findComponent(id)).filter(Boolean) as EmailComponent[];
        if (components.length < 2) return '';

        const gridId = addComponent('Grid');
        updateComponent(gridId, {
            props: { ...DEFAULT_GRID_PROPS, columns }
        });

        // Create grid items and move components
        components.forEach((component, index) => {
            const column = index % columns;
            const gridItemId = addComponent('GridItem', gridId);
            updateComponent(gridItemId, {
                props: { ...DEFAULT_GRID_ITEM_PROPS },
                columnIndex: column
            });
            moveComponent(component.id, gridItemId);
        });

        return gridId;
    }, [findComponent, addComponent, updateComponent, moveComponent]);

    const addGridColumn = useCallback((gridId: string) => {
        const grid = findComponent(gridId) as GridComponent;
        if (!grid || grid.type !== 'Grid') return;

        const newColumns = (grid.props.columns || 2) + 1;
        updateComponent(gridId, {
            props: { ...grid.props, columns: newColumns }
        });

        // Add new grid item
        const gridItemId = addComponent('GridItem', gridId);
        updateComponent(gridItemId, {
            props: { ...DEFAULT_GRID_ITEM_PROPS },
            columnIndex: newColumns - 1
        });
    }, [findComponent, updateComponent, addComponent]);

    const removeGridColumn = useCallback((gridId: string, columnIndex: number) => {
        const grid = findComponent(gridId) as GridComponent;
        if (!grid || grid.type !== 'Grid') return;

        // Remove grid item at specified column
        const gridItem = grid.children?.find(child =>
            child.type === 'GridItem' && (child as GridItemComponent).columnIndex === columnIndex
        );

        if (gridItem) {
            deleteComponent(gridItem.id);
        }

        // Update column count
        const newColumns = Math.max(1, (grid.props.columns || 2) - 1);
        updateComponent(gridId, {
            props: { ...grid.props, columns: newColumns }
        });
    }, [findComponent, deleteComponent, updateComponent]);

    // Return the hook interface
    return {
        // State
        components: state.components,
        selectedComponent: state.selectedComponent,
        clipboard: state.clipboard,
        history: state.history,

        // Actions
        addComponent,
        updateComponent,
        deleteComponent,
        duplicateComponent,
        moveComponent,
        selectComponent,
        undo,
        redo,
        copyComponent,
        pasteComponent,
        groupComponents,
        ungroupComponent,
        convertToGrid,
        addGridColumn,
        removeGridColumn,
    };
}

// ==================== DRAG AND DROP HOOK ====================

export function useAdvancedDragAndDrop(builder: ReturnType<typeof useAdvancedEmailBuilder>) {
    const [draggedComponent, setDraggedComponent] = useState<EmailComponent | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const handleDragStart = useCallback((component: EmailComponent) => {
        setDraggedComponent(component);
    }, []);

    const handleDragOver = useCallback((targetId: string, index?: number) => {
        setDropTarget(targetId);
        setDragOverIndex(index ?? null);
    }, []);

    const handleDragEnd = useCallback(() => {
        if (draggedComponent && dropTarget) {
            builder.moveComponent(draggedComponent.id, dropTarget, dragOverIndex ?? undefined);
        }
        setDraggedComponent(null);
        setDropTarget(null);
        setDragOverIndex(null);
    }, [draggedComponent, dropTarget, dragOverIndex, builder]);

    const handleDragLeave = useCallback(() => {
        setDropTarget(null);
        setDragOverIndex(null);
    }, []);

    return {
        draggedComponent,
        dropTarget,
        dragOverIndex,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
    };
}
