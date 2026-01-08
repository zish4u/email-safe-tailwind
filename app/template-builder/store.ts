/**
 * Email Template Builder - Zustand Store
 * 
 * Central state management for the email template builder.
 * Handles component tree, selection, history, and canvas settings.
 */

import { create } from 'zustand';
import type { BuilderState, ComponentNode, StyleProperties, ComponentProps, CanvasSettings, PreviewMode, ZoomLevel, HistoryState } from './types';

const MAX_HISTORY = 10;

/**
 * Initial canvas settings
 */
const initialCanvasSettings: CanvasSettings = {
    zoom: 100,
    previewMode: 'desktop',
    showGrid: true,
    snapToGrid: true,
    gridSize: 10,
};

/**
 * Create a history snapshot
 */
const createHistorySnapshot = (components: ComponentNode[]): HistoryState => ({
    components: JSON.parse(JSON.stringify(components)), // Deep clone
    timestamp: Date.now(),
});

/**
 * Find component by ID recursively
 */
const findComponentById = (components: ComponentNode[], id: string): ComponentNode | null => {
    for (const component of components) {
        if (component.id === id) return component;
        if (component.children) {
            const found = findComponentById(component.children, id);
            if (found) return found;
        }
    }
    return null;
};

/**
 * Remove component by ID recursively
 */
const removeComponentById = (components: ComponentNode[], id: string): ComponentNode[] => {
    return components.filter(component => {
        if (component.id === id) return false;
        if (component.children) {
            component.children = removeComponentById(component.children, id);
        }
        return true;
    });
};

/**
 * Add component to tree
 */
const addComponentToTree = (
    components: ComponentNode[],
    newComponent: ComponentNode,
    parentId?: string,
    index?: number
): ComponentNode[] => {
    if (!parentId) {
        // Add to root level
        const newComponents = [...components];
        if (index !== undefined) {
            newComponents.splice(index, 0, newComponent);
        } else {
            newComponents.push(newComponent);
        }
        return newComponents;
    }

    // Add to parent
    return components.map(component => {
        if (component.id === parentId) {
            const children = component.children || [];
            const newChildren = [...children];
            if (index !== undefined) {
                newChildren.splice(index, 0, newComponent);
            } else {
                newChildren.push(newComponent);
            }
            return { ...component, children: newChildren };
        }
        if (component.children) {
            return {
                ...component,
                children: addComponentToTree(component.children, newComponent, parentId, index),
            };
        }
        return component;
    });
};

/**
 * Update component in tree
 */
const updateComponentInTree = (
    components: ComponentNode[],
    id: string,
    updates: Partial<ComponentNode>
): ComponentNode[] => {
    return components.map(component => {
        if (component.id === id) {
            return { ...component, ...updates };
        }
        if (component.children) {
            return {
                ...component,
                children: updateComponentInTree(component.children, id, updates),
            };
        }
        return component;
    });
};

/**
 * Main builder store
 */
export const useBuilderStore = create<BuilderState>((set, get) => ({
    // Initial state
    components: [],
    selectedId: null,
    hoveredId: null,
    history: [],
    historyIndex: -1,
    canvasSettings: initialCanvasSettings,
    showComponentLibrary: true,
    showPropertiesPanel: true,
    showLayersPanel: true,

    // Component actions
    addComponent: (component, parentId, index) => {
        set(state => {
            // Validation: prevent columns from being added to non-section parents
            if (component.type === 'column' && parentId) {
                const parent = findComponentById(state.components, parentId);
                if (parent && parent.type !== 'section') {
                    console.warn('Columns can only be placed inside sections');
                    return state; // Don't add the component
                }
            }

            const newComponents = addComponentToTree(state.components, component, parentId, index);
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                createHistorySnapshot(newComponents),
            ].slice(-MAX_HISTORY);

            return {
                components: newComponents,
                history: newHistory,
                historyIndex: newHistory.length - 1,
                selectedId: component.id,
            };
        });
    },

    updateComponent: (id, updates) => {
        set(state => {
            const newComponents = updateComponentInTree(state.components, id, updates);
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                createHistorySnapshot(newComponents),
            ].slice(-MAX_HISTORY);

            return {
                components: newComponents,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    deleteComponent: (id) => {
        set(state => {
            const newComponents = removeComponentById(state.components, id);
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                createHistorySnapshot(newComponents),
            ].slice(-MAX_HISTORY);

            return {
                components: newComponents,
                history: newHistory,
                historyIndex: newHistory.length - 1,
                selectedId: state.selectedId === id ? null : state.selectedId,
            };
        });
    },

    moveComponent: (id: any, newParentId: any, index: any) => {
        set(state => {
            // First remove the component
            let movedComponent: ComponentNode | null = null;
            const componentsWithoutMoved = removeComponentById(
                JSON.parse(JSON.stringify(state.components)),
                id
            );

            // Find the component before removing
            movedComponent = findComponentById(state.components, id);
            if (!movedComponent) return state;

            // Add it to new location
            const newComponents = addComponentToTree(componentsWithoutMoved, movedComponent, newParentId, index);
            const newHistory = [
                ...state.history.slice(0, state.historyIndex + 1),
                createHistorySnapshot(newComponents),
            ].slice(-MAX_HISTORY);

            return {
                components: newComponents,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });
    },

    duplicateComponent: (id) => {
        const state = get();
        const component = findComponentById(state.components, id);
        if (!component) return;

        // Client-safe ID generation
        const generateId = () => `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Deep clone and assign new IDs
        const cloneWithNewIds = (node: ComponentNode): ComponentNode => {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.id = generateId();
            newNode.name = `${node.name} (Copy)`;
            if (newNode.children) {
                newNode.children = newNode.children.map(cloneWithNewIds);
            }
            return newNode;
        };

        const duplicate = cloneWithNewIds(component);

        // Add after the original
        get().addComponent(duplicate);
    },

    // Selection actions
    selectComponent: (id) => set({ selectedId: id }),
    setHoveredComponent: (id) => set({ hoveredId: id }),

    // Style and props updates
    updateStyles: (id, styles) => {
        const state = get();
        const component = findComponentById(state.components, id);
        if (component) {
            get().updateComponent(id, {
                styles: { ...component.styles, ...styles },
            });
        }
    },

    updateProps: (id, props) => {
        const state = get();
        const component = findComponentById(state.components, id);
        if (component) {
            get().updateComponent(id, {
                props: { ...component.props, ...props },
            });
        }
    },

    // History actions
    undo: () => {
        set(state => {
            if (state.historyIndex > 0) {
                const newIndex = state.historyIndex - 1;
                return {
                    components: state.history[newIndex].components,
                    historyIndex: newIndex,
                };
            }
            return state;
        });
    },

    redo: () => {
        set(state => {
            if (state.historyIndex < state.history.length - 1) {
                const newIndex = state.historyIndex + 1;
                return {
                    components: state.history[newIndex].components,
                    historyIndex: newIndex,
                };
            }
            return state;
        });
    },

    canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
    },

    canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
    },

    // Canvas actions
    updateCanvasSettings: (settings) => {
        set(state => ({
            canvasSettings: { ...state.canvasSettings, ...settings },
        }));
    },

    setZoom: (zoom) => {
        get().updateCanvasSettings({ zoom });
    },

    setPreviewMode: (mode) => {
        get().updateCanvasSettings({ previewMode: mode });
    },

    toggleGrid: () => {
        set(state => ({
            canvasSettings: {
                ...state.canvasSettings,
                showGrid: !state.canvasSettings.showGrid,
            },
        }));
    },

    // UI actions
    togglePanel: (panel) => {
        set(state => {
            switch (panel) {
                case 'library':
                    return { showComponentLibrary: !state.showComponentLibrary };
                case 'properties':
                    return { showPropertiesPanel: !state.showPropertiesPanel };
                case 'layers':
                    return { showLayersPanel: !state.showLayersPanel };
                default:
                    return state;
            }
        });
    },

    // Utility methods
    getComponentById: (id) => {
        const state = get();
        return findComponentById(state.components, id);
    },

    exportToJSON: () => {
        const state = get();
        return JSON.stringify(state.components, null, 2);
    },

    exportToHTML: () => {
        const state = get();
        const { exportToHTML: htmlExporter } = require('./utils/exporters');
        return htmlExporter(state.components);
    },

    importFromJSON: (json) => {
        try {
            const components = JSON.parse(json);
            set(state => {
                const newHistory = [
                    ...state.history,
                    createHistorySnapshot(components),
                ].slice(-MAX_HISTORY);

                return {
                    components,
                    history: newHistory,
                    historyIndex: newHistory.length - 1,
                    selectedId: null,
                };
            });
        } catch (error) {
            console.error('Failed to import JSON:', error);
        }
    },

    reset: () => {
        set({
            components: [],
            selectedId: null,
            hoveredId: null,
            history: [],
            historyIndex: -1,
            canvasSettings: initialCanvasSettings,
        });
    },
}));
