"use client";
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    TemplateComponent,
    ComponentType,
    TEMPLATE_STORAGE_KEY,
    DEFAULT_COMPONENT_SIZES,
    NEST_COLORS,
    getDefaultComponentSize,
} from '../types';
import useHistory from './useHistory';

/**
 * Default configurations for each component type
 */
const DEFAULT_CONFIGS: Partial<Record<ComponentType, Partial<TemplateComponent>>> = {
    Button: {
        props: {
            children: 'Click Me',
            variant: 'primary',
            size: 'md',
            href: '#'
        },
        size: DEFAULT_COMPONENT_SIZES.Button,
        style: {
            backgroundColor: '#3b82f6',
            textColor: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
        },
        constraints: { aspectRatio: 3, lockAspectRatio: false }
    },
    Text: {
        props: {
            children: 'Your text here',
            variant: 'p',
            align: 'left'
        },
        size: DEFAULT_COMPONENT_SIZES.Text,
        style: {
            textColor: '#1e293b',
            fontSize: '16px',
            lineHeight: '1.6',
            padding: '12px',
            backgroundColor: '#f8fafc',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '6px',
            border: '1px solid #e2e8f0'
        }
    },
    Section: {
        props: { padding: 'md' },
        size: DEFAULT_COMPONENT_SIZES.Section,
        style: {
            backgroundColor: '#f0f9ff',
            padding: '32px',
            borderRadius: '12px',
            border: '2px solid #bae6fd',
        }
    },
    Image: {
        props: {
            src: 'https://via.placeholder.com/200x150/3b82f6/ffffff?text=Image',
            alt: 'Placeholder image',
            caption: ''
        },
        size: DEFAULT_COMPONENT_SIZES.Image,
        constraints: { aspectRatio: 1.33, lockAspectRatio: true }
    },

    Divider: {
        props: { color: '#e5e7eb', thickness: '2px', spacing: '12px' },
        size: DEFAULT_COMPONENT_SIZES.Divider,
        style: {
            backgroundColor: '#e5e7eb',
            margin: '12px 0',
        }
    },
    SocialLinks: {
        props: {
            links: [
                { platform: 'facebook', url: 'https://facebook.com' },
                { platform: 'instagram', url: 'https://instagram.com' },
                { platform: 'linkedin', url: 'https://linkedin.com' },
            ],
            size: 'md',
            align: 'center',
        },
        size: DEFAULT_COMPONENT_SIZES.SocialLinks,
        style: {
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
        }
    },
    Row: {
        props: {},
        size: DEFAULT_COMPONENT_SIZES.Row,
        style: {
            backgroundColor: 'transparent',
            padding: '8px',
            gap: '16px',
        }
    },
    Column: {
        props: {},
        size: DEFAULT_COMPONENT_SIZES.Column,
        style: {
            backgroundColor: 'transparent',
            padding: '8px',
        },
        constraints: { resizable: true, movable: true }
    },
    Spacer: {
        props: { height: '20px' },
        size: DEFAULT_COMPONENT_SIZES.Spacer,
        style: {
            backgroundColor: 'transparent',
        }
    },
    Logo: {
        props: {
            src: 'https://via.placeholder.com/80x30/3b82f6/ffffff?text=LOGO',
            alt: 'Logo',
        },
        size: DEFAULT_COMPONENT_SIZES.Logo,
    },
};

export interface UseTemplateBuilderReturn {
    components: TemplateComponent[];
    selectedComponent: string | null;
    setSelectedComponent: (id: string | null) => void;
    addComponent: (type: string, parentId?: string, position?: { x: number; y: number }) => TemplateComponent;
    updateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
    deleteComponent: (id: string) => void;
    updateComponentPosition: (id: string, x: number, y: number, width?: number, height?: number) => void;
    setComponentParent: (componentId: string, newParentId: string) => void;
    duplicateComponent: (id: string) => void;
    moveComponentUp: (id: string) => void;
    moveComponentDown: (id: string) => void;
    reorderComponent: (activeId: string, overId: string) => void;
    saveTemplate: () => void;
    loadTemplate: () => void;
    deleteTemplate: () => void;
    startNewTemplate: () => void;
    createSampleTemplate: () => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

/**
 * Main hook for template builder state management
 */
export function useTemplateBuilder(): UseTemplateBuilderReturn {
    const {
        current: components,
        push: pushHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        reset: resetHistory,
        setCurrent: setComponents,
    } = useHistory<TemplateComponent[]>([]);

    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

    // Load template from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as TemplateComponent[];
                if (Array.isArray(parsed)) {
                    resetHistory(parsed);
                }
            }
        } catch {
            // Ignore parse errors
        }
    }, [resetHistory]);

    // Create a new component
    const createComponent = useCallback((
        componentType: string,
        parentId?: string,
        position?: { x: number; y: number }
    ): TemplateComponent => {
        const nestLevel = parentId
            ? (components.find(c => c.id === parentId)?.nestLevel || 0) + 1
            : 0;

        const config = (DEFAULT_CONFIGS[componentType as ComponentType] || {
            props: {},
            size: getDefaultComponentSize(componentType),
            style: {}
        }) as Partial<TemplateComponent>;

        return {
            id: uuidv4(),
            type: componentType as ComponentType,
            props: { ...config.props },
            children: [],
            position: position || { x: 16, y: 16 + components.length * 20 },
            size: { ...config.size } as { width: number; height: number },
            style: {
                backgroundColor: NEST_COLORS[nestLevel % NEST_COLORS.length],
                textColor: '#000000',
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                padding: '8px',
                margin: '0',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                opacity: 1,
                zIndex: nestLevel,
                ...config.style,
            },
            parentId,
            nestLevel,
            constraints: config.constraints,
        };
    }, [components]);

    // Add component to canvas
    const addComponent = useCallback((
        type: string,
        parentId?: string,
        position?: { x: number; y: number }
    ): TemplateComponent => {
        const newComponent = createComponent(type, parentId, position);
        const newComponents = [...components, newComponent];
        pushHistory(newComponents);
        setSelectedComponent(newComponent.id);
        return newComponent;
    }, [components, createComponent, pushHistory]);

    // Update component properties
    const updateComponent = useCallback((id: string, updates: Partial<TemplateComponent>) => {
        const newComponents = components.map(c =>
            c.id === id
                ? {
                    ...c,
                    ...updates,
                    props: updates.props ? { ...c.props, ...updates.props } : c.props,
                    style: updates.style ? { ...c.style, ...updates.style } : c.style,
                    size: updates.size ? { ...c.size, ...updates.size } : c.size,
                }
                : c
        );
        pushHistory(newComponents);
    }, [components, pushHistory]);

    // Collect all descendant IDs for a component
    const collectDescendants = useCallback((rootId: string): string[] => {
        const descendants: string[] = [];
        const queue = [rootId];
        while (queue.length > 0) {
            const current = queue.shift()!;
            components.forEach(c => {
                if (c.parentId === current) {
                    descendants.push(c.id);
                    queue.push(c.id);
                }
            });
        }
        return descendants;
    }, [components]);

    // Delete component and its descendants
    const deleteComponent = useCallback((id: string) => {
        const toRemove = new Set([id, ...collectDescendants(id)]);
        const newComponents = components.filter(c => !toRemove.has(c.id));
        pushHistory(newComponents);
        if (selectedComponent && toRemove.has(selectedComponent)) {
            setSelectedComponent(null);
        }
    }, [components, collectDescendants, pushHistory, selectedComponent]);

    // Update component position and optionally size
    const updateComponentPosition = useCallback((
        id: string,
        x: number,
        y: number,
        width?: number,
        height?: number
    ) => {
        const newComponents = components.map(c =>
            c.id === id
                ? {
                    ...c,
                    position: { ...c.position, x, y },
                    size: width !== undefined && height !== undefined
                        ? { ...c.size, width, height }
                        : c.size,
                }
                : c
        );
        // Use setComponents for intermediate updates (during drag)
        setComponents(newComponents as TemplateComponent[]);
    }, [components, setComponents]);

    // Set new parent for a component (for nesting)
    const setComponentParent = useCallback((componentId: string, newParentId: string) => {
        const component = components.find(c => c.id === componentId);
        const newParent = components.find(c => c.id === newParentId);

        if (!component || !newParent) return;
        if (componentId === newParentId) return;

        // Prevent circular nesting
        const descendants = collectDescendants(componentId);
        if (descendants.includes(newParentId)) return;

        const newNestLevel = (newParent.nestLevel || 0) + 1;

        const newComponents = components.map(c =>
            c.id === componentId
                ? { ...c, parentId: newParentId, nestLevel: newNestLevel }
                : c
        );
        pushHistory(newComponents);
    }, [components, collectDescendants, pushHistory]);

    // Duplicate a component
    const duplicateComponent = useCallback((id: string) => {
        const component = components.find(c => c.id === id);
        if (!component) return;

        const newComponent: TemplateComponent = {
            ...component,
            id: uuidv4(),
            position: {
                x: (component.position?.x || 0) + 20,
                y: (component.position?.y || 0) + 20,
            },
        };

        const newComponents = [...components, newComponent];
        pushHistory(newComponents);
        setSelectedComponent(newComponent.id);
    }, [components, pushHistory]);

    // Move component up in order
    const moveComponentUp = useCallback((id: string) => {
        const index = components.findIndex(c => c.id === id);
        if (index <= 0) return;

        const newComponents = [...components];
        [newComponents[index - 1], newComponents[index]] = [newComponents[index], newComponents[index - 1]];
        pushHistory(newComponents);
    }, [components, pushHistory]);

    // Move component down in order
    const moveComponentDown = useCallback((id: string) => {
        const index = components.findIndex(c => c.id === id);
        if (index === -1 || index >= components.length - 1) return;

        const newComponents = [...components];
        [newComponents[index], newComponents[index + 1]] = [newComponents[index + 1], newComponents[index]];
        pushHistory(newComponents);
    }, [components, pushHistory]);

    // Reorder component (for DnD)
    const reorderComponent = useCallback((activeId: string, overId: string) => {
        const oldIndex = components.findIndex(c => c.id === activeId);
        const newIndex = components.findIndex(c => c.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newComponents = [...components];
            const [movedItem] = newComponents.splice(oldIndex, 1);
            newComponents.splice(newIndex, 0, movedItem);
            pushHistory(newComponents);
        }
    }, [components, pushHistory]);

    // Save template to localStorage
    const saveTemplate = useCallback(() => {
        try {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(components));
        } catch {
            // Ignore storage errors
        }
    }, [components]);

    // Load template from localStorage
    const loadTemplate = useCallback(() => {
        try {
            const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as TemplateComponent[];
                if (Array.isArray(parsed)) {
                    resetHistory(parsed);
                    setSelectedComponent(null);
                }
            }
        } catch {
            // Ignore parse errors
        }
    }, [resetHistory]);

    // Delete template from localStorage
    const deleteTemplate = useCallback(() => {
        try {
            localStorage.removeItem(TEMPLATE_STORAGE_KEY);
        } catch {
            // Ignore storage errors
        }
    }, []);

    // Start a new empty template
    const startNewTemplate = useCallback(() => {
        resetHistory([]);
        setSelectedComponent(null);
    }, [resetHistory]);

    // Create a sample template for demo
    const createSampleTemplate = useCallback(() => {
        const sampleComponents: TemplateComponent[] = [];

        // 1. Header Section
        const headerSection = createComponent('Section', undefined, { x: 0, y: 0 });
        headerSection.style = { ...headerSection.style, backgroundColor: '#1e293b', padding: '24px' };
        sampleComponents.push(headerSection);

        // Row inside Header
        const headerRow = createComponent('Row', headerSection.id);
        sampleComponents.push(headerRow);

        // Column for Logo/Title
        const headerCol = createComponent('Column', headerRow.id);
        headerCol.style = { ...headerCol.style, alignItems: 'center' };
        sampleComponents.push(headerCol);

        // Logo Text
        const logoText = createComponent('Text', headerCol.id);
        logoText.props = { children: '📧 MAIL BUILDER', variant: 'h2' };
        logoText.style = { ...logoText.style, textColor: '#ffffff', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' };
        sampleComponents.push(logoText);

        // Subtitle
        const subtitle = createComponent('Text', headerCol.id);
        subtitle.props = { children: 'Professional Email Templates' };
        subtitle.style = { ...subtitle.style, textColor: '#94a3b8', fontSize: '14px', textAlign: 'center' };
        sampleComponents.push(subtitle);

        // 2. Main Content Section
        const mainSection = createComponent('Section', undefined, { x: 0, y: 0 });
        mainSection.style = { ...mainSection.style, backgroundColor: '#ffffff', padding: '32px' };
        sampleComponents.push(mainSection);

        // Main Row
        const mainRow = createComponent('Row', mainSection.id);
        sampleComponents.push(mainRow);

        // Main Column
        const mainCol = createComponent('Column', mainRow.id);
        sampleComponents.push(mainCol);

        // Welcome Text
        const welcomeText = createComponent('Text', mainCol.id);
        welcomeText.props = { children: 'Welcome to the new Drag & Drop Builder!' };
        welcomeText.style = { ...welcomeText.style, fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' };
        sampleComponents.push(welcomeText);

        // Body Text
        const bodyText = createComponent('Text', mainCol.id);
        bodyText.props = { children: 'You can now nest components! Try dragging a Row into this Section, then adding Columns and Buttons.' };
        bodyText.style = { ...bodyText.style, lineHeight: '1.6', marginBottom: '24px' };
        sampleComponents.push(bodyText);

        // Button
        const button = createComponent('Button', mainCol.id);
        button.props = { children: 'Get Started', href: '#' };
        button.style = { ...button.style, backgroundColor: '#3b82f6', width: 'auto' };
        sampleComponents.push(button);

        // 3. Footer Section
        const footerSection = createComponent('Section', undefined, { x: 0, y: 0 });
        footerSection.style = { ...footerSection.style, backgroundColor: '#f1f5f9', padding: '24px' };
        sampleComponents.push(footerSection);

        // Footer Row
        const footerRow = createComponent('Row', footerSection.id);
        sampleComponents.push(footerRow);

        // Footer Column
        const footerCol = createComponent('Column', footerRow.id);
        sampleComponents.push(footerCol);

        // Footer Text
        const footerText = createComponent('Text', footerCol.id);
        footerText.props = { children: '© 2024 Email Builder Inc. All rights reserved.' };
        footerText.style = { ...footerText.style, fontSize: '12px', textColor: '#64748b', textAlign: 'center' };
        sampleComponents.push(footerText);

        resetHistory(sampleComponents);
        setSelectedComponent(null);
    }, [createComponent, resetHistory]);

    return {
        components,
        selectedComponent,
        setSelectedComponent,
        addComponent,
        updateComponent,
        deleteComponent,
        updateComponentPosition,
        setComponentParent,
        duplicateComponent,
        moveComponentUp,
        moveComponentDown,
        reorderComponent,
        saveTemplate,
        loadTemplate,
        deleteTemplate,
        startNewTemplate,
        createSampleTemplate,
        undo,
        redo,
        canUndo,
        canRedo,
    };
}

export default useTemplateBuilder;
