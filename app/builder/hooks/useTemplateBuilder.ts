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
    Header: {
        props: {
            title: 'Email Header',
            subtitle: 'Welcome to our newsletter',
            logo: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=LOGO'
        },
        size: DEFAULT_COMPONENT_SIZES.Header,
        style: {
            backgroundColor: '#1e293b',
            textColor: '#ffffff',
            padding: '24px',
            textAlign: 'center',
            border: '2px solid #334155',
        }
    },
    Footer: {
        props: {
            company: 'Your Company',
            address: '123 Main St, City, Country',
            unsubscribeLink: 'https://example.com/unsubscribe'
        },
        size: DEFAULT_COMPONENT_SIZES.Footer,
        style: {
            backgroundColor: '#1e293b',
            textColor: '#94a3b8',
            padding: '24px',
            fontSize: '12px',
            textAlign: 'center',
            border: '2px solid #334155',
        }
    },
    Card: {
        props: { children: 'Card content' },
        size: DEFAULT_COMPONENT_SIZES.Card,
        style: {
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
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
        }
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

        // Header
        const header = createComponent('Header', undefined, { x: 16, y: 16 });
        header.props = {
            title: 'Welcome to Our Newsletter',
            subtitle: 'Your weekly dose of awesome content',
            logo: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=LOGO'
        };
        header.size = { width: 568, height: 100 };
        sampleComponents.push(header);

        // Main section
        const mainSection = createComponent('Section', undefined, { x: 16, y: 130 });
        mainSection.size = { width: 568, height: 200 };
        mainSection.style = { ...mainSection.style, backgroundColor: '#ffffff' };
        sampleComponents.push(mainSection);

        // Text content
        const text = createComponent('Text', undefined, { x: 16, y: 350 });
        text.props = {
            children: 'Thank you for subscribing to our newsletter! We\'re excited to share the latest updates with you.'
        };
        text.size = { width: 568, height: 60 };
        sampleComponents.push(text);

        // CTA Button
        const button = createComponent('Button', undefined, { x: 200, y: 430 });
        button.props = { children: 'Learn More', href: '#' };
        button.size = { width: 160, height: 48 };
        sampleComponents.push(button);

        // Divider
        const divider = createComponent('Divider', undefined, { x: 16, y: 500 });
        divider.size = { width: 568, height: 2 };
        sampleComponents.push(divider);

        // Social links
        const social = createComponent('SocialLinks', undefined, { x: 170, y: 520 });
        social.size = { width: 260, height: 40 };
        sampleComponents.push(social);

        // Footer
        const footer = createComponent('Footer', undefined, { x: 16, y: 580 });
        footer.props = {
            company: 'Your Company Inc.',
            address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
            unsubscribeLink: '#unsubscribe'
        };
        footer.size = { width: 568, height: 100 };
        sampleComponents.push(footer);

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
