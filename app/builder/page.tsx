"use client"
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { ComponentEditor } from '@/components/builder/ComponentEditor';
import * as EmailComponents from '@/components/email-components';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    MeasuringStrategy,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    DragMoveEvent,
    useDroppable,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';


// Enhanced component interface with better type safety
interface TemplateComponent {
    id: string;
    type: string;
    props: Record<string, any>;
    children?: TemplateComponent[];
    position?: {
        x: number;
        y: number;
        width?: number;
        height?: number;
    };
    size?: {
        width: number;
        height: number;
        minWidth?: number;
        minHeight?: number;
        maxWidth?: number;
        maxHeight?: number;
    };
    style?: {
        backgroundColor?: string;
        textColor?: string;
        fontSize?: string;
        fontFamily?: string;
        fontWeight?: string;
        padding?: string;
        margin?: string;
        marginBottom?: string;
        gap?: string;
        border?: string;
        borderColor?: string;
        borderRadius?: string;
        borderBottom?: string;
        boxShadow?: string;
        opacity?: number;
        zIndex?: number;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        lineHeight?: string;
        letterSpacing?: string;
        display?: string;
        alignItems?: string;
        justifyContent?: string;
    };
    parentId?: string;
    nestLevel?: number;
    isLocked?: boolean;
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

// Component details for display
const COMPONENT_DETAILS = {
    Section: { icon: '📦', description: 'Container for content' },
    Column: { icon: '📐', description: 'Vertical layout column' },
    Row: { icon: '↔️', description: 'Horizontal layout row' },
    Grid: { icon: '🔲', description: 'Flexible grid layout' },
    Text: { icon: '📝', description: 'Text content block' },
    Image: { icon: '🖼️', description: 'Image with alt text' },
    Card: { icon: '🃏', description: 'Card with content' },
    Divider: { icon: '➖', description: 'Horizontal divider line' },
    Button: { icon: '🔘', description: 'Clickable button' },
    SocialLinks: { icon: '🔗', description: 'Social media links' },
    Menu: { icon: '🍔', description: 'Navigation menu' },
    Logo: { icon: '🏢', description: 'Company logo' },
    Header: { icon: '📄', description: 'Email header' },
    Footer: { icon: '📌', description: 'Email footer' },
    Spacer: { icon: '↕️', description: 'Vertical space' },
    Wrapper: { icon: '📎', description: 'Content wrapper' },
    Conditional: { icon: '🎯', description: 'Conditional content' },
} as const;

// Enhanced component categories
const ENHANCED_COMPONENT_CATEGORIES = {
    Layout: ['Section', 'Column', 'Row', 'Grid'],
    Content: ['Text', 'Image', 'Card', 'Divider'],
    Interactive: ['Button', 'SocialLinks', 'Menu'],
    Branding: ['Logo', 'Header', 'Footer'],
    Advanced: ['Spacer', 'Wrapper', 'Conditional'],
};

// Nest level colors with better contrast
const NEST_COLORS = [
    'rgba(248, 250, 252, 0.9)', // slate-50
    'rgba(241, 245, 249, 0.9)', // slate-100
    'rgba(226, 232, 240, 0.9)', // slate-200
    'rgba(203, 213, 225, 0.9)', // slate-300
    'rgba(148, 163, 184, 0.9)', // slate-400
    'rgba(100, 116, 139, 0.9)', // slate-500
    'rgba(71, 85, 105, 0.9)',   // slate-600
    'rgba(51, 65, 85, 0.9)',    // slate-700
    'rgba(30, 41, 59, 0.9)',    // slate-800
    'rgba(15, 23, 42, 0.9)',    // slate-900
];

// Grid constants
const GRID_SIZE = 8;
const SAFE_AREA_PADDING = 16;

// Default component sizes (reduced)
const DEFAULT_COMPONENT_SIZES = {
    Button: { width: 120, height: 40 },
    Text: { width: 200, height: 40 },
    Section: { width: 400, height: 150 },
    Image: { width: 200, height: 150 },
    Header: { width: 400, height: 80 },
    Footer: { width: 400, height: 60 },
    Card: { width: 200, height: 120 },
    Divider: { width: 400, height: 2 },
    Column: { width: 150, height: 200 },
    Row: { width: 400, height: 80 },
    Grid: { width: 400, height: 150 },
    Logo: { width: 80, height: 30 },
    Spacer: { width: 400, height: 10 },
    Wrapper: { width: 400, height: 100 },
    Conditional: { width: 400, height: 80 },
    SocialLinks: { width: 200, height: 30 },
    Menu: { width: 400, height: 40 },
};

// Enhanced canvas sizes (increased by 100-200px)
const CANVAS_SIZES = {
    desktop: { width: 700, height: 700 },
    tablet: { width: 550, height: 550 },
    mobile: { width: 400, height: 400 },
};

const TEMPLATE_STORAGE_KEY = 'email-safe-tailwind:builder-template:v1';

// Sortable Component Item
function SortableComponentItem({
    component,
    isSelected,
    onSelect,
    onDelete
}: {
    component: TemplateComponent;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative p-2 mb-1 rounded-lg border transition-all duration-200 cursor-move
        ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
        ${isDragging ? 'opacity-50 scale-105 shadow-lg' : ''}
      `}
            onClick={() => onSelect(component.id)}
            {...attributes}
            {...listeners}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div>
                        <div className="font-medium text-xs">{component.type}</div>
                        <div className="text-xs text-gray-500">
                            ID: {component.id.slice(0, 6)}...
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(component.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-0.5 text-xs"
                    title="Delete"
                >
                    ×
                </button>
            </div>
            {component.nestLevel && component.nestLevel > 0 && (
                <div className="absolute top-0.5 right-0.5 text-[10px] bg-gray-100 text-gray-600 px-1 rounded">
                    L{component.nestLevel}
                </div>
            )}
        </div>
    );
}

export default function EnhancedTemplateBuilder() {
    const [dragGuides, setDragGuides] = useState<{ x: number; y: number } | null>(null);
    // Performance-optimized state management with proper memoization
    const [components, setComponents] = useState<TemplateComponent[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [activeComponent, setActiveComponent] = useState<TemplateComponent | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [outputHtml, setOutputHtml] = useState('');
    const [editingComponent, setEditingComponent] = useState<TemplateComponent | null>(null);
    const [liveEditMode, setLiveEditMode] = useState(true);
    const [inlineEditing, setInlineEditing] = useState<string | null>(null);

    // Canvas state with performance optimizations
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [canvasScale, setCanvasScale] = useState(1);
    const [showGrid, setShowGrid] = useState(true);
    const [snapToGrid, setSnapToGrid] = useState(true);

    // Nesting and history state
    const [maxNestLevel] = useState(5);
    const [history, setHistory] = useState<TemplateComponent[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const flashActionMessage = useCallback((message: string) => {
        setActionMessage(message);
        window.setTimeout(() => {
            setActionMessage(null);
        }, 1200);
    }, []);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (!saved) return;
            const parsed = JSON.parse(saved) as TemplateComponent[];
            if (!Array.isArray(parsed)) return;
            setComponents(parsed);
            setHistory([parsed]);
            setHistoryIndex(0);
        } catch {
            // ignore
        }
    }, []);

    const saveTemplate = useCallback(() => {
        try {
            localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(components));
            flashActionMessage('Saved');
        } catch {
            // ignore
        }
    }, [components, flashActionMessage]);

    const loadTemplate = useCallback(() => {
        try {
            const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
            if (!saved) return;
            const parsed = JSON.parse(saved) as TemplateComponent[];
            if (!Array.isArray(parsed)) return;
            setComponents(parsed);
            setHistory([parsed]);
            setHistoryIndex(0);
            setSelectedComponent(null);
            setEditingComponent(null);
            flashActionMessage('Loaded');
        } catch {
            // ignore
        }
    }, [flashActionMessage]);

    const deleteTemplate = useCallback(() => {
        try {
            localStorage.removeItem(TEMPLATE_STORAGE_KEY);
            flashActionMessage('Template deleted');
        } catch {
            // ignore
        }
    }, [flashActionMessage]);

    const startNewTemplate = useCallback(() => {
        setComponents([]);
        setHistory([[]]);
        setHistoryIndex(0);
        setSelectedComponent(null);
        setEditingComponent(null);
        flashActionMessage('New template started');
    }, [flashActionMessage]);

    // Mouse interaction state with proper typing
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        componentX: 0,
        componentY: 0
    });
    const [resizeDirection, setResizeDirection] = useState<string>('');

    // Performance refs for DOM manipulation
    const canvasRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const resizeAnimationRef = useRef<number | null>(null);

    // Enhanced DND sensors with performance optimizations
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1, // Reduced for better responsiveness
            },
        })
    );

    // Get default component size
    const getDefaultComponentSize = (componentType: string): { width: number; height: number } => {
        return DEFAULT_COMPONENT_SIZES[componentType as keyof typeof DEFAULT_COMPONENT_SIZES] || { width: 150, height: 100 };
    };

    // Get canvas boundaries
    const getCanvasBoundaries = useCallback(() => {
        if (!canvasRef.current) {
            return {
                width: CANVAS_SIZES[previewMode].width,
                height: CANVAS_SIZES[previewMode].height,
                left: 0,
                top: 0,
            };
        }

        const rect = canvasRef.current.getBoundingClientRect();
        // IMPORTANT: rect.{width,height} are affected by CSS transform scale().
        // We store/move components in *logical* canvas units (unscaled), so use CANVAS_SIZES.
        return {
            width: CANVAS_SIZES[previewMode].width,
            height: CANVAS_SIZES[previewMode].height,
            left: rect.left,
            top: rect.top,
        };
    }, [previewMode]);

    // Save to history on change
    const saveToHistory = useCallback((newComponents: TemplateComponent[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newComponents);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    // Undo/Redo functions
    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setComponents(history[historyIndex - 1]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setComponents(history[historyIndex + 1]);
        }
    };

    // Enhanced component creation with better defaults and proper text centering
    const createComponent = useCallback((
        componentType: string,
        parentId?: string,
        position?: { x: number; y: number }
    ): TemplateComponent => {
        // Default configurations with proper text centering for placeholder content
        const defaultConfigs: Record<string, Partial<TemplateComponent>> = {
            Button: {
                props: {
                    children: 'Click Me',
                    variant: 'primary',
                    size: 'md',
                    href: '#'
                },
                size: DEFAULT_COMPONENT_SIZES.Button,
                style: {
                    backgroundColor: '#ffffff',
                    textColor: '#3b82f6',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                },
                constraints: { aspectRatio: 3, lockAspectRatio: false }
            },
            Text: {
                props: {
                    children: 'Your text here',
                    variant: 'p',
                    align: 'center'
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
                props: { children: 'Section content', padding: 'md' },
                size: DEFAULT_COMPONENT_SIZES.Section,
                style: {
                    backgroundColor: '#f0f9ff',
                    padding: '32px',
                    borderRadius: '12px',
                    border: '2px solid #bae6fd',
                    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.1)'
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
                    subtitle: 'Welcome',
                    logo: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=LOGO'
                },
                size: DEFAULT_COMPONENT_SIZES.Header,
                style: {
                    backgroundColor: '#1e293b',
                    textColor: '#ffffff',
                    padding: '24px',
                    textAlign: 'center',
                    border: '2px solid #334155',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                }
            },
            Footer: {
                props: {
                    company: 'Your Company',
                    address: '123 Main St',
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
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)'
                }
            },
            Card: {
                props: { children: 'Card content' },
                size: DEFAULT_COMPONENT_SIZES.Card,
                style: {
                    backgroundColor: '#fef3c7',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #f59e0b',
                    boxShadow: '0 4px 6px rgba(245, 158, 11, 0.15)',
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
                    backgroundColor: '#cbd5e1',
                    margin: '12px 0',
                    height: '2px',
                    borderRadius: '1px'
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
                    border: '2px solid #86efac',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.15)'
                }
            }
        };

        const nestLevel = parentId
            ? (components.find(c => c.id === parentId)?.nestLevel || 0) + 1
            : 0;

        const config: any = defaultConfigs[componentType] || {
            props: {},
            size: getDefaultComponentSize(componentType),
            style: {}
        };

        return {
            id: uuidv4(),
            type: componentType,
            props: config.props,
            children: [],
            position: position || { x: 10, y: 10 + components.length * 15 },
            size: config.size as any,
            style: {
                backgroundColor: NEST_COLORS[nestLevel % NEST_COLORS.length],
                textColor: '#000000',
                fontSize: '12px', // Reduced default
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                padding: '4px', // Reduced default padding
                margin: '2px', // Reduced default margin
                border: '1px solid #e5e7eb',
                borderRadius: '3px',
                opacity: 1,
                zIndex: nestLevel,
                ...config.style,
            },
            parentId,
            nestLevel,
            constraints: config.constraints,
        };
    }, [components]);

    // Create sample template
    const createSampleTemplate = useCallback(() => {
        // Clear existing components first
        setComponents([]);
        setHistory([[]]);
        setHistoryIndex(0);

        const sampleComponents: TemplateComponent[] = [];

        // Header with branding
        const header = createComponent('Header', undefined, { x: 10, y: 10 });
        header.props = {
            title: 'TechCorp Solutions',
            subtitle: 'Innovating Tomorrow, Today',
            logo: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=LOGO'
        };
        header.style = {
            ...header.style,
            backgroundColor: '#1e293b',
            textColor: '#ffffff',
            padding: '24px',
            textAlign: 'center'
        };
        header.size = { width: 580, height: 100 };
        sampleComponents.push(header);

        // Hero section with image and text side-by-side
        const heroSection = createComponent('Section', undefined, { x: 10, y: 130 });
        heroSection.style = {
            ...heroSection.style,
            backgroundColor: '#f8fafc',
            padding: '32px'
        };
        heroSection.size = { width: 580, height: 250 };
        sampleComponents.push(heroSection);

        // Hero row for side-by-side layout
        const heroRow = createComponent('Row', heroSection.id, { x: 0, y: 0 });
        heroRow.style = {
            ...heroRow.style,
            gap: '24px'
        };
        heroRow.size = { width: 516, height: 186 }; // Account for padding
        sampleComponents.push(heroRow);

        // Hero image
        const heroImage = createComponent('Image', heroRow.id, { x: 0, y: 0 });
        heroImage.props = {
            src: 'https://via.placeholder.com/300x200/3b82f6/ffffff?text=Product+Demo',
            alt: 'Product Demo'
        };
        heroImage.size = { width: 240, height: 160 };
        sampleComponents.push(heroImage);

        // Hero text content
        const heroText = createComponent('Text', heroRow.id, { x: 0, y: 0 });
        heroText.props = {
            children: 'Transform your business with our cutting-edge solutions. Experience the power of innovation and take your organization to new heights with our comprehensive suite of tools and services.'
        };
        heroText.style = {
            ...heroText.style,
            fontSize: '16px',
            textColor: '#334155',
            textAlign: 'left',
            lineHeight: '1.6'
        };
        heroText.size = { width: 240, height: 160 };
        sampleComponents.push(heroText);

        // Features section
        const featuresSection = createComponent('Section', undefined, { x: 10, y: 400 });
        featuresSection.style = {
            ...featuresSection.style,
            backgroundColor: '#ffffff',
            padding: '32px'
        };
        featuresSection.size = { width: 580, height: 300 };
        sampleComponents.push(featuresSection);

        // Features title
        const featuresTitle = createComponent('Text', featuresSection.id, { x: 0, y: 0 });
        featuresTitle.props = {
            children: 'Why Choose Us?'
        };
        featuresTitle.style = {
            ...featuresTitle.style,
            fontSize: '24px',
            fontWeight: 'bold',
            textColor: '#1e293b',
            textAlign: 'center',
            marginBottom: '24px'
        };
        featuresTitle.size = { width: 516, height: 40 };
        sampleComponents.push(featuresTitle);

        // Features row
        const featuresRow = createComponent('Row', featuresSection.id, { x: 0, y: 50 });
        featuresRow.style = {
            ...featuresRow.style,
            gap: '16px'
        };
        featuresRow.size = { width: 516, height: 200 };
        sampleComponents.push(featuresRow);

        // Feature cards
        const features = [
            { title: 'Fast Performance', desc: 'Lightning-fast processing', color: '#10b981' },
            { title: 'Secure Platform', desc: 'Enterprise-grade security', color: '#3b82f6' },
            { title: '24/7 Support', desc: 'Always here to help', color: '#f59e0b' }
        ];

        features.forEach((feature, index) => {
            const card = createComponent('Card', featuresRow.id, { x: 0, y: 0 });
            card.style = {
                ...card.style,
                backgroundColor: feature.color + '10',
                border: `2px solid ${feature.color}20`,
                borderRadius: '8px',
                padding: '20px'
            };
            card.size = { width: 160, height: 180 };
            sampleComponents.push(card);

            const cardTitle = createComponent('Text', card.id, { x: 0, y: 0 });
            cardTitle.props = {
                children: feature.title
            };
            cardTitle.style = {
                ...cardTitle.style,
                fontSize: '18px',
                fontWeight: 'bold',
                textColor: feature.color,
                textAlign: 'center',
                marginBottom: '8px'
            };
            cardTitle.size = { width: 120, height: 30 };
            sampleComponents.push(cardTitle);

            const cardDesc = createComponent('Text', card.id, { x: 0, y: 40 });
            cardDesc.props = {
                children: feature.desc
            };
            cardDesc.style = {
                ...cardDesc.style,
                fontSize: '14px',
                textColor: '#64748b',
                textAlign: 'center'
            };
            cardDesc.size = { width: 120, height: 40 };
            sampleComponents.push(cardDesc);
        });

        // CTA section
        const ctaSection = createComponent('Section', undefined, { x: 10, y: 720 });
        ctaSection.style = {
            ...ctaSection.style,
            backgroundColor: '#3b82f6',
            padding: '32px',
            textAlign: 'center'
        };
        ctaSection.size = { width: 580, height: 150 };
        sampleComponents.push(ctaSection);

        const ctaText = createComponent('Text', ctaSection.id, { x: 0, y: 0 });
        ctaText.props = {
            children: 'Ready to get started?'
        };
        ctaText.style = {
            ...ctaText.style,
            fontSize: '20px',
            fontWeight: 'bold',
            textColor: '#ffffff',
            textAlign: 'center',
            marginBottom: '16px'
        };
        ctaText.size = { width: 516, height: 30 };
        sampleComponents.push(ctaText);

        const ctaButton = createComponent('Button', ctaSection.id, { x: 0, y: 50 });
        ctaButton.props = {
            children: 'Start Free Trial',
            href: '#'
        };
        ctaButton.style = {
            ...ctaButton.style,
            backgroundColor: '#ffffff',
            textColor: '#3b82f6',
            borderRadius: '6px',
            padding: '12px 24px'
        };
        ctaButton.size = { width: 150, height: 50 };
        sampleComponents.push(ctaButton);

        // Footer
        const footer = createComponent('Footer', undefined, { x: 10, y: 890 });
        footer.props = {
            company: 'TechCorp Solutions',
            address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
            unsubscribeLink: '#unsubscribe'
        };
        footer.style = {
            ...footer.style,
            backgroundColor: '#1e293b',
            textColor: '#94a3b8',
            padding: '24px',
            textAlign: 'center'
        };
        footer.size = { width: 580, height: 120 };
        sampleComponents.push(footer);

        // Set all components at once
        setComponents(sampleComponents);
        setHistory([sampleComponents]);
        setHistoryIndex(0);
        setSelectedComponent(null);
        setEditingComponent(null);
        flashActionMessage('Sample template created');
    }, [createComponent, flashActionMessage]);

    // Enhanced add component with smart positioning
    const addComponent = useCallback((
        componentType: string,
        parentId?: string,
        position?: { x: number; y: number }
    ) => {
        const newComponent = createComponent(componentType, parentId, position);
        const newComponents = [newComponent];

        // If creating a Card, add nested Text components like the sample template
        if (componentType === 'Card') {
            const cardTitle = createComponent('Text', newComponent.id, { x: 0, y: 0 });
            cardTitle.props = {
                children: 'Card Title'
            };
            cardTitle.style = {
                ...cardTitle.style,
                fontSize: '18px',
                fontWeight: 'bold',
                textColor: '#f59e0b',
                textAlign: 'center',
                marginBottom: '8px'
            };
            cardTitle.size = { width: 120, height: 30 };
            newComponents.push(cardTitle);

            const cardDesc = createComponent('Text', newComponent.id, { x: 0, y: 40 });
            cardDesc.props = {
                children: 'Card description text goes here'
            };
            cardDesc.style = {
                ...cardDesc.style,
                fontSize: '14px',
                textColor: '#64748b',
                textAlign: 'center'
            };
            cardDesc.size = { width: 120, height: 40 };
            newComponents.push(cardDesc);
        }

        setComponents(prev => {
            const updated = [...prev, ...newComponents];
            saveToHistory(updated);
            return updated;
        });

        setSelectedComponent(newComponent.id);
    }, [createComponent, saveToHistory]);

    // Enhanced update component with placeholder text fix
    const updateComponent = useCallback((id: string, updates: Partial<TemplateComponent>) => {
        setComponents(prev => {
            const updated = prev.map(comp => {
                if (comp.id === id) {
                    // Ensure placeholder text updates properly
                    const updatedProps = updates.props || {};
                    const mergedProps = { ...comp.props, ...updatedProps };

                    // Return merged component
                    return {
                        ...comp,
                        ...updates,
                        props: mergedProps
                    };
                }
                return comp;
            });
            saveToHistory(updated);
            return updated;
        });
    }, [saveToHistory]);

    // Enhanced delete with children cleanup
    const deleteComponent = useCallback((id: string) => {
        setComponents(prev => {
            const component = prev.find(c => c.id === id);
            if (!component) return prev;

            // Remove all descendants via parentId (more reliable than maintaining nested arrays)
            const collectDescendants = (rootId: string): string[] => {
                const directChildren = prev.filter(c => c.parentId === rootId);
                return [
                    rootId,
                    ...directChildren.flatMap(child => collectDescendants(child.id))
                ];
            };

            const idsToRemove = collectDescendants(id);
            const updated = prev.filter(c => !idsToRemove.includes(c.id));

            saveToHistory(updated);
            return updated;
        });

        if (selectedComponent === id) {
            setSelectedComponent(null);
        }
    }, [saveToHistory, selectedComponent]);

    const setComponentParent = useCallback((childId: string, parentId?: string) => {
        setComponents(prev => {
            const child = prev.find(c => c.id === childId);
            if (!child) return prev;

            const nextParentId = parentId || undefined;
            if (child.parentId === nextParentId) return prev;

            const findNestLevel = (pid?: string): number => {
                if (!pid) return 0;
                const p = prev.find(c => c.id === pid);
                if (!p) return 0;
                return (p.nestLevel || 0) + 1;
            };

            const updated = prev.map(c => {
                if (c.id === childId) {
                    return {
                        ...c,
                        parentId: nextParentId,
                        nestLevel: findNestLevel(nextParentId),
                    };
                }
                return c;
            });

            // Update descendants' nest levels for consistency
            const byId = new Map(updated.map(c => [c.id, c] as const));
            const updateSubtree = (rootId: string) => {
                const root = byId.get(rootId);
                if (!root) return;
                const children = updated.filter(c => c.parentId === rootId);
                children.forEach(ch => {
                    byId.set(ch.id, { ...ch, nestLevel: (root.nestLevel || 0) + 1 });
                    updateSubtree(ch.id);
                });
            };
            updateSubtree(childId);

            const finalList = Array.from(byId.values());
            saveToHistory(finalList);
            return finalList;
        });
    }, [saveToHistory]);

    // Enhanced position update with safe area boundary
    const updateComponentPosition = useCallback((
        id: string,
        x: number,
        y: number,
        width?: number,
        height?: number
    ) => {
        setComponents(prev => {
            const component = prev.find(c => c.id === id);
            if (!component) return prev;

            // Apply grid snapping
            let snappedX = x;
            let snappedY = y;

            if (snapToGrid) {
                snappedX = Math.round(x / GRID_SIZE) * GRID_SIZE;
                snappedY = Math.round(y / GRID_SIZE) * GRID_SIZE;
            }

            // Get canvas boundaries
            const canvasBoundaries = getCanvasBoundaries();
            const compWidth = width || component.size?.width || 150;
            const compHeight = height || component.size?.height || 100;

            // Safe area constraints
            snappedX = Math.max(SAFE_AREA_PADDING,
                Math.min(snappedX, canvasBoundaries.width - compWidth - SAFE_AREA_PADDING));
            snappedY = Math.max(SAFE_AREA_PADDING,
                Math.min(snappedY, canvasBoundaries.height - compHeight - SAFE_AREA_PADDING));

            const updated = prev.map(comp =>
                comp.id === id
                    ? {
                        ...comp,
                        position: {
                            ...comp.position,
                            x: snappedX,
                            y: snappedY
                        },
                        ...(width !== undefined && height !== undefined
                            ? { size: { ...comp.size, width, height } }
                            : {}
                        )
                    }
                    : comp
            );

            saveToHistory(updated);
            return updated;
        });
    }, [getCanvasBoundaries, saveToHistory, snapToGrid]);

    // Mouse drag handlers for direct manipulation
    const handleComponentMouseDown = useCallback((e: React.MouseEvent, componentId: string) => {
        e.stopPropagation();
        const component = components.find(c => c.id === componentId);
        if (!component) return;

        setSelectedComponent(componentId);

        // Calculate drag offset
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const pointerX = (e.clientX - canvasRect.left) / canvasScale;
        const pointerY = (e.clientY - canvasRect.top) / canvasScale;
        setDragOffset({
            x: pointerX - (component.position?.x || 0),
            y: pointerY - (component.position?.y || 0),
        });
        setIsDragging(true);
    }, [components, canvasScale]);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent, componentId: string, direction: string) => {
        e.stopPropagation();
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
            componentY: component.position?.y || 0
        });
    }, [components]);

    // Handle canvas mouse move
    const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging && !isResizing) return;

        if (isDragging && selectedComponent) {
            const component = components.find(c => c.id === selectedComponent);
            if (!component) return;

            const canvasRect = canvasRef.current?.getBoundingClientRect();
            if (!canvasRect) return;

            // Calculate new position
            const pointerX = (e.clientX - canvasRect.left) / canvasScale;
            const pointerY = (e.clientY - canvasRect.top) / canvasScale;
            const x = pointerX - dragOffset.x;
            const y = pointerY - dragOffset.y;

            const w = component.size?.width || 150;
            const h = component.size?.height || 100;
            setDragGuides({ x: x + w / 2, y: y + h / 2 });

            // Update position with boundary checking
            updateComponentPosition(selectedComponent, x, y);
        }

        if (isResizing && selectedComponent && resizeDirection) {
            const component = components.find(c => c.id === selectedComponent);
            if (!component) return;

            const deltaX = (e.clientX - resizeStart.x) / canvasScale;
            const deltaY = (e.clientY - resizeStart.y) / canvasScale;

            let newWidth = resizeStart.width;
            let newHeight = resizeStart.height;
            let newX = resizeStart.componentX;
            let newY = resizeStart.componentY;

            const minWidth = component.size?.minWidth || 40;
            const minHeight = component.size?.minHeight || 20;
            const maxWidth = component.size?.maxWidth || 600;
            const maxHeight = component.size?.maxHeight || 600;

            // Handle resizing based on direction
            switch (resizeDirection) {
                case 'nw': // top-left
                    newWidth = Math.max(minWidth, resizeStart.width - deltaX);
                    newHeight = Math.max(minHeight, resizeStart.height - deltaY);
                    newX = resizeStart.componentX + (resizeStart.width - newWidth);
                    newY = resizeStart.componentY + (resizeStart.height - newHeight);
                    break;
                case 'ne': // top-right
                    newWidth = Math.max(minWidth, resizeStart.width + deltaX);
                    newHeight = Math.max(minHeight, resizeStart.height - deltaY);
                    newY = resizeStart.componentY + (resizeStart.height - newHeight);
                    break;
                case 'sw': // bottom-left
                    newWidth = Math.max(minWidth, resizeStart.width - deltaX);
                    newHeight = Math.max(minHeight, resizeStart.height + deltaY);
                    newX = resizeStart.componentX + (resizeStart.width - newWidth);
                    break;
                case 'se': // bottom-right
                    newWidth = Math.max(minWidth, resizeStart.width + deltaX);
                    newHeight = Math.max(minHeight, resizeStart.height + deltaY);
                    break;
                case 'n': // top
                    newHeight = Math.max(minHeight, resizeStart.height - deltaY);
                    newY = resizeStart.componentY + (resizeStart.height - newHeight);
                    break;
                case 's': // bottom
                    newHeight = Math.max(minHeight, resizeStart.height + deltaY);
                    break;
                case 'w': // left
                    newWidth = Math.max(minWidth, resizeStart.width - deltaX);
                    newX = resizeStart.componentX + (resizeStart.width - newWidth);
                    break;
                case 'e': // right
                    newWidth = Math.max(minWidth, resizeStart.width + deltaX);
                    break;
            }

            // Apply constraints if aspect ratio is locked
            if (component.constraints?.lockAspectRatio && component.constraints.aspectRatio) {
                const aspectRatio = component.constraints.aspectRatio;
                if (resizeDirection.includes('e') || resizeDirection.includes('w')) {
                    newHeight = newWidth / aspectRatio;
                } else if (resizeDirection.includes('n') || resizeDirection.includes('s')) {
                    newWidth = newHeight * aspectRatio;
                }
            }

            // Apply boundaries
            const canvasBoundaries = getCanvasBoundaries();

            newWidth = Math.min(maxWidth, Math.max(minWidth, newWidth));
            newHeight = Math.min(maxHeight, Math.max(minHeight, newHeight));

            // Ensure component stays within safe area
            newX = Math.max(SAFE_AREA_PADDING, Math.min(newX, canvasBoundaries.width - newWidth - SAFE_AREA_PADDING));
            newY = Math.max(SAFE_AREA_PADDING, Math.min(newY, canvasBoundaries.height - newHeight - SAFE_AREA_PADDING));

            // Update component
            updateComponentPosition(selectedComponent, newX, newY, newWidth, newHeight);
        }
    }, [isDragging, isResizing, selectedComponent, components, dragOffset, resizeDirection, resizeStart, getCanvasBoundaries, updateComponentPosition, canvasScale]);

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        setResizeDirection('');
        setDragGuides(null);
    }, []);

    // DND Handlers
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;

        // Check if dragging from component library
        if (typeof active.id === 'string' && active.id.startsWith('library-')) {
            const componentType = active.id.replace('library-', '');
            const newComponent = createComponent(componentType);
            setActiveComponent(newComponent);
        } else {
            // Dragging existing component
            const component = components.find(c => c.id === active.id);
            if (component) {
                setActiveComponent(component);
            }
        }
    }, [components, createComponent]);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveComponent(null);
            return;
        }

        // Get canvas boundaries
        const canvasBoundaries = getCanvasBoundaries();
        if (!canvasBoundaries) {
            setActiveComponent(null);
            return;
        }

        // Get drop coordinates from the event
        const activatorEvent = event.activatorEvent as MouseEvent;
        if (!activatorEvent) {
            setActiveComponent(null);
            return;
        }

        // Calculate drop position relative to canvas
        const dropX = (activatorEvent.clientX - canvasBoundaries.left) / canvasScale;
        const dropY = (activatorEvent.clientY - canvasBoundaries.top) / canvasScale;

        const overComponent = typeof over.id === 'string'
            ? components.find(c => c.id === over.id)
            : undefined;
        const overIsContainer = !!overComponent && ['Section', 'Card', 'Row'].includes(overComponent.type);

        if (typeof active.id === 'string' && active.id.startsWith('library-')) {
            // Adding new component from library
            const componentType = active.id.replace('library-', '');

            // Get default size
            const compSize = getDefaultComponentSize(componentType);

            // Apply safe area constraints
            const adjustedX = Math.max(SAFE_AREA_PADDING,
                Math.min(dropX, canvasBoundaries.width - compSize.width - SAFE_AREA_PADDING));
            const adjustedY = Math.max(SAFE_AREA_PADDING,
                Math.min(dropY, canvasBoundaries.height - compSize.height - SAFE_AREA_PADDING));

            // Apply grid snapping
            let finalX = adjustedX;
            let finalY = adjustedY;

            if (snapToGrid) {
                finalX = Math.round(adjustedX / GRID_SIZE) * GRID_SIZE;
                finalY = Math.round(adjustedY / GRID_SIZE) * GRID_SIZE;
            }

            addComponent(componentType, overIsContainer ? (over.id as string) : undefined, { x: finalX, y: finalY });
        } else if (over.id === 'canvas') {
            // Moving existing component
            const component = components.find(c => c.id === active.id);
            if (component) {
                // If it was nested, detatch it when dropped back onto the canvas
                if (component.parentId) {
                    setComponentParent(component.id, undefined);
                }
                // Apply safe area constraints
                const compWidth = component.size?.width || 150;
                const compHeight = component.size?.height || 100;

                const adjustedX = Math.max(SAFE_AREA_PADDING,
                    Math.min(dropX, canvasBoundaries.width - compWidth - SAFE_AREA_PADDING));
                const adjustedY = Math.max(SAFE_AREA_PADDING,
                    Math.min(dropY, canvasBoundaries.height - compHeight - SAFE_AREA_PADDING));

                // Apply grid snapping
                let finalX = adjustedX;
                let finalY = adjustedY;

                if (snapToGrid) {
                    finalX = Math.round(adjustedX / GRID_SIZE) * GRID_SIZE;
                    finalY = Math.round(adjustedY / GRID_SIZE) * GRID_SIZE;
                }

                updateComponentPosition(active.id as string, finalX, finalY);
            }
        } else if (overIsContainer && typeof active.id === 'string') {
            // Nest existing component into a container
            setComponentParent(active.id as string, over.id as string);
        }

        setActiveComponent(null);
    }, [addComponent, components, getCanvasBoundaries, snapToGrid, updateComponentPosition, canvasScale, setComponentParent]);

    // Email-safe HTML generation (table based for Gmail/Outlook)
    const generateHtml = useCallback(() => {
        const buildComponentTree = (flat: TemplateComponent[]) => {
            const map = new Map<string, TemplateComponent>();
            flat.forEach(c => map.set(c.id, { ...c, children: [] }));
            map.forEach(node => {
                if (node.parentId && map.has(node.parentId)) {
                    map.get(node.parentId)!.children!.push(node);
                }
            });
            return Array.from(map.values()).filter(n => !n.parentId || !map.has(n.parentId));
        };

        const css = (v: any, fallback: string) => {
            if (typeof v === 'number') return `${v}px`;
            if (typeof v === 'string' && v.trim().length > 0) return v;
            return fallback;
        };

        const esc = (value: any) => {
            const s = String(value ?? '');
            return s
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        const textAlign = (style: any) => {
            const ta = style?.textAlign || 'left';
            return ta === 'center' || ta === 'right' || ta === 'justify' ? ta : 'left';
        };

        // Group root-level components by horizontal position for side-by-side layout
        const groupComponentsIntoRows = (components: TemplateComponent[]): TemplateComponent[][] => {
            if (components.length === 0) return [];

            // Sort components by Y position, then by X position
            const sorted = [...components].sort((a, b) => {
                const yDiff = (a.position?.y || 0) - (b.position?.y || 0);
                if (Math.abs(yDiff) < 20) { // If Y positions are close, sort by X
                    return (a.position?.x || 0) - (b.position?.x || 0);
                }
                return yDiff;
            });

            const rows: TemplateComponent[][] = [];
            let currentRow: TemplateComponent[] = [sorted[0]];
            let lastY = sorted[0].position?.y || 0;

            for (let i = 1; i < sorted.length; i++) {
                const comp = sorted[i];
                const compY = comp.position?.y || 0;

                // If Y position is significantly different, start a new row
                if (Math.abs(compY - lastY) > 40) {
                    rows.push(currentRow);
                    currentRow = [comp];
                    lastY = compY;
                } else {
                    currentRow.push(comp);
                }
            }

            if (currentRow.length > 0) {
                rows.push(currentRow);
            }

            return rows;
        };

        const renderNode = (component: TemplateComponent): string => {
            const style = component.style || {};
            const size = component.size || getDefaultComponentSize(component.type);
            const childrenHtml = (component.children || []).map(renderNode).join('');

            switch (component.type) {
                case 'Section':
                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td style="background-color:${style.backgroundColor || '#ffffff'};padding:${css(style.padding, '16px')};border-radius:${css(style.borderRadius, '0')};border:${style.border || '0'};box-sizing:border-box;">
                            ${childrenHtml || esc(component.props.children || '')}
                          </td>
                        </tr>
                      </table>
                    `;

                case 'Row': {
                    const cols = component.children || [];
                    const gap = css(style.gap, '8px');
                    const colWidth = cols.length > 0 ? `${Math.floor(100 / cols.length)}%` : '100%';
                    const colsHtml = cols.map((child, idx) => {
                        const rightPad = idx === cols.length - 1 ? '0' : gap;
                        return `
                          <td valign="top" width="${colWidth}" style="padding-right:${rightPad};box-sizing:border-box;">
                            ${renderNode(child)}
                          </td>
                        `;
                    }).join('');
                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          ${colsHtml}
                        </tr>
                      </table>
                    `;
                }

                case 'Column':
                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td valign="top" style="box-sizing:border-box;">
                            ${childrenHtml || esc(component.props.children || '')}
                          </td>
                        </tr>
                      </table>
                    `;

                case 'Card': {
                    const bg = style.backgroundColor || '#ffffff';
                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:separate;border-spacing:0;background-color:${bg};border:${style.border || '1px solid #e5e7eb'};border-radius:${css(style.borderRadius, '8px')};">
                        <tr>
                          <td style="padding:${css(style.padding, '16px')};text-align:${textAlign(style)};box-sizing:border-box;">
                            ${childrenHtml || esc(component.props.children || '')}
                          </td>
                        </tr>
                      </table>
                    `;
                }

                case 'Text':
                    return `
                      <div style="color:${style.textColor || '#111827'};font-size:${style.fontSize || '14px'};font-family:${style.fontFamily || 'Arial, sans-serif'};font-weight:${style.fontWeight || 'normal'};text-align:${textAlign(style)};line-height:${style.lineHeight || '1.5'};padding:${css(style.padding, '0')};margin:${css(style.margin, '0')};">
                        ${component.props.children || ''}
                      </div>
                    `;

                case 'Button': {
                    const align = textAlign(style);
                    const href = String(component.props?.href || '#');
                    const label = component.props?.children || '';
                    const bg = style.backgroundColor || '#3b82f6';
                    const fg = style.textColor || '#ffffff';
                    const pad = css(style.padding, '12px 16px');

                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td align="${align}" style="padding:${css(style.margin, '8px 0')};">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                              <tr>
                                <td bgcolor="${bg}" style="border-radius:${css(style.borderRadius, '6px')};">
                                  <a href="${href}" target="_blank" style="display:inline-block;padding:${pad};color:${fg};text-decoration:none;font-family:${style.fontFamily || 'Arial, sans-serif'};font-size:${style.fontSize || '14px'};font-weight:${style.fontWeight || '600'};">
                                    ${label}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    `;
                }

                case 'Image': {
                    const src = String(component.props?.src || '');
                    const alt = esc(component.props?.alt || '');
                    const maxW = size.width ? `${size.width}px` : '600px';
                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                        <tr>
                          <td style="padding:${css(style.margin, '8px 0')};">
                            <img src="${src}" alt="${alt}" style="display:block;width:100%;max-width:${maxW};height:auto;border:0;outline:none;text-decoration:none;border-radius:${css(style.borderRadius, '0')};" />
                          </td>
                        </tr>
                      </table>
                    `;
                }

                case 'SocialLinks': {
                    const links = Array.isArray(component.props?.links) ? component.props.links : [];
                    const align = component.props?.align || style.textAlign || 'left';
                    const tableAlign = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left';
                    const iconSize = component.props?.size === 'lg' ? 24 : component.props?.size === 'sm' ? 16 : 20;

                    const getFallbackDomain = (platform: string) => {
                        const p = platform.trim().toLowerCase();
                        if (p === 'x' || p === 'twitter') return 'x.com';
                        if (p === 'linkedin') return 'linkedin.com';
                        if (p === 'facebook') return 'facebook.com';
                        if (p === 'instagram') return 'instagram.com';
                        if (p === 'youtube') return 'youtube.com';
                        if (p === 'github') return 'github.com';
                        return '';
                    };

                    const getDomainFromUrl = (url: string) => {
                        try {
                            const u = new URL(url);
                            return u.hostname;
                        } catch {
                            return '';
                        }
                    };

                    const getIconUrl = (platform: string, url: string) => {
                        const domain = getDomainFromUrl(url) || getFallbackDomain(platform);
                        if (!domain) return '';
                        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
                    };

                    const linkHtml = links.map((link: any, idx: number) => {
                        const platform = String(link?.platform || 'Link');
                        const url = String(link?.url || '#');
                        const icon = link?.icon || getIconUrl(platform, url);
                        const pr = idx === links.length - 1 ? '0' : '8px';
                        if (icon) {
                            return `
                              <td style="padding-right:${pr};">
                                <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="${icon}" alt="${platform}" width="${iconSize}" height="${iconSize}" style="display:block;border-radius:9999px;border:0;outline:none;text-decoration:none;" />
                                </a>
                              </td>
                            `;
                        }

                        return `
                          <td style="padding-right:${pr};font-family:Arial,sans-serif;font-size:12px;">
                            <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;color:${style.textColor || '#2563eb'};">
                              ${platform}
                            </a>
                          </td>
                        `;
                    }).join('');

                    return `
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="${tableAlign}" style="border-collapse:collapse;">
                        <tr>
                          ${linkHtml}
                        </tr>
                      </table>
                    `;
                }

                case 'Header': {
                    const title = String(component.props?.title || '');
                    const subtitle = String(component.props?.subtitle || '');
                    const logo = String(component.props?.logo || '');
                    const bg = style.backgroundColor || component.props?.backgroundColor || '#ffffff';
                    const fg = style.textColor || component.props?.textColor || '#111827';

                    return `
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:${bg};">
                        <tr>
                          <td style="padding:${css(style.padding, '16px')};text-align:${textAlign(style)};">
                            ${logo ? `<div style=\"margin-bottom:8px;\"><img src=\"${logo}\" alt=\"\" style=\"display:inline-block;max-width:120px;height:auto;border:0;\" /></div>` : ''}
                            ${title ? `<div style=\"font-size:20px;font-weight:700;color:${fg};font-family:${style.fontFamily || 'Arial, sans-serif'};\">${esc(title)}</div>` : ''}
                            ${subtitle ? `<div style=\"font-size:14px;color:${fg};opacity:0.85;font-family:${style.fontFamily || 'Arial, sans-serif'};margin-top:4px;\">${esc(subtitle)}</div>` : ''}
                          </td>
                        </tr>
                      </table>
                    `;
                }

                case 'Footer': {
                    const company = String(component.props?.company || '');
                    const address = String(component.props?.address || '');
                    const unsubscribeLink = String(component.props?.unsubscribeLink || '');
                    const bg = style.backgroundColor || component.props?.backgroundColor || '#f8f9fa';
                    const fg = style.textColor || component.props?.textColor || '#6b7280';

                    return `
                      <div style="background-color:${bg};color:${fg};padding:${css(style.padding, '16px')};text-align:${textAlign(style)};font-family:${style.fontFamily || 'Arial, sans-serif'};font-size:${style.fontSize || '12px'};box-sizing:border-box;">
                        ${company ? `<div style=\"font-weight:600;font-size:14px;margin-bottom:4px;\">${esc(company)}</div>` : ''}
                        ${address ? `<div style=\"font-size:12px;opacity:0.85;margin-bottom:8px;\">${esc(address)}</div>` : ''}
                        ${unsubscribeLink ? `<div style=\"font-size:11px;opacity:0.75;\"><a href=\"${unsubscribeLink}\" style=\"color:${fg};text-decoration:underline;\">Unsubscribe</a></div>` : ''}
                        <div style="font-size:11px;opacity:0.6;margin-top:10px;padding-top:10px;border-top:1px solid ${fg}30;">&copy; ${new Date().getFullYear()} ${esc(company || 'Company')}. All rights reserved.</div>
                      </div>
                    `;
                }

                default:
                    return `<div>${esc(component.type)} Component</div>`;
            }
        };

        const tree = buildComponentTree(components);

        // Render root-level components with side-by-side layout support
        const renderRootComponents = (rootComponents: TemplateComponent[]): string => {
            if (rootComponents.length === 0) return '';

            // Group components by horizontal position for side-by-side layout
            const rows = groupComponentsIntoRows(rootComponents);

            return rows.map(row => {
                // If only one component in the row, render it normally
                if (row.length === 1) {
                    return renderNode(row[0]);
                }

                // Multiple components side-by-side - create a horizontal table
                const colWidth = `${Math.floor(100 / row.length)}%`;
                const colsHtml = row.map((comp, idx) => {
                    const rightPad = idx === row.length - 1 ? '0' : '8px';
                    return `
                      <td valign="top" width="${colWidth}" style="padding-right:${rightPad};box-sizing:border-box;">
                        ${renderNode(comp)}
                      </td>
                    `;
                }).join('');

                return `
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;">
                    <tr>
                      ${colsHtml}
                    </tr>
                  </table>
                `;
            }).join('');
        };

        const contentHtml = renderRootComponents(tree);

        const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <title>Email Template</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;background-color:#f3f4f6;">
          <tr>
            <td align="center" style="padding:16px 10px;">
              <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;">
                <tr>
                  <td style="padding:0;">
                    ${contentHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

        setOutputHtml(fullHtml);
        setShowPreview(true);
        flashActionMessage('HTML generated');
    }, [components, flashActionMessage]);

    // Performance-optimized resize handle rendering
    const renderResizeHandles = useCallback((component: TemplateComponent) => {
        const handles: React.ReactElement[] = [];
        // Define handle positions for 8-point resize
        const positions = [
            { direction: 'nw', cursor: 'nw-resize', left: -4, top: -4 },
            { direction: 'n', cursor: 'n-resize', left: '50%', top: -4, transform: 'translateX(-50%)' },
            { direction: 'ne', cursor: 'ne-resize', right: -4, top: -4 },
            { direction: 'e', cursor: 'e-resize', right: -4, top: '50%', transform: 'translateY(-50%)' },
            { direction: 'se', cursor: 'se-resize', right: -4, bottom: -4 },
            { direction: 's', cursor: 's-resize', left: '50%', bottom: -4, transform: 'translateX(-50%)' },
            { direction: 'sw', cursor: 'sw-resize', left: -4, bottom: -4 },
            { direction: 'w', cursor: 'w-resize', left: -4, top: '50%', transform: 'translateY(-50%)' },
        ];

        // Generate resize handles with consistent styling
        positions.forEach(pos => {
            const handleStyle: React.CSSProperties = {
                ...(pos.left === '50%' ? { left: pos.left } : { left: pos.left }),
                ...(pos.top === '50%' ? { top: pos.top } : { top: pos.top }),
                ...(pos.right && { right: pos.right }),
                ...(pos.bottom && { bottom: pos.bottom }),
                ...(pos.transform && { transform: pos.transform }),
                zIndex: 1000,
            };

            handles.push(
                <div
                    key={pos.direction}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white rounded-full cursor-${pos.cursor} hover:scale-150 transition-transform`}
                    style={handleStyle}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, pos.direction)}
                />
            );
        });

        return handles;
    }, [handleResizeMouseDown]);

    // Droppable container component for nesting
    const DroppableContainer = ({ id, children, isContainer }: { id: string; children: React.ReactNode; isContainer: boolean }) => {
        const { setNodeRef, isOver } = useDroppable({
            id,
            disabled: !isContainer
        });

        return (
            <div
                ref={setNodeRef}
                className={`relative w-full h-full ${isOver && isContainer ? 'bg-blue-50 border-2 border-blue-400 border-dashed' : ''}`}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
                {isOver && isContainer && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                            Drop here
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Enhanced component rendering
    const renderComponent = useCallback((component: TemplateComponent) => {
        const Component = (EmailComponents as any)[component.type] as React.ComponentType<any>;
        const isSelected = selectedComponent === component.id;
        const nestLevel = component.nestLevel || 0;
        const isContainer = ['Section', 'Card', 'Row'].includes(component.type);

        const safeProps = component.type === 'SocialLinks'
            ? {
                ...component.props,
                links: Array.isArray((component.props as any)?.links) ? (component.props as any).links : [],
            }
            : component.type === 'Footer' || component.type === 'Header'
                ? {
                    ...component.props,
                    textColor: component.style?.textColor ?? (component.props as any)?.textColor,
                    backgroundColor: component.style?.backgroundColor ?? (component.props as any)?.backgroundColor,
                }
                : component.props;

        // Enhanced component styling with proper centering
        const isTextComponent = component.type === 'Text';
        const textAlign = (component.style?.textAlign || 'left') as string;
        const textAlignItems = textAlign === 'center'
            ? 'center'
            : textAlign === 'right'
                ? 'flex-end'
                : 'flex-start';
        const textVerticalJustify = (component.style?.justifyContent || 'center') as React.CSSProperties['justifyContent'];

        const componentStyle: React.CSSProperties = {
            position: 'absolute',
            left: component.position?.x || 0,
            top: component.position?.y || 0,
            width: component.size?.width || 150,
            height: component.size?.height || 100,
            backgroundColor: component.style?.backgroundColor || (component.type === 'Card' ? '#fef3c7' : component.type === 'Section' ? '#f0f9ff' : component.type === 'SocialLinks' ? '#f0fdf4' : NEST_COLORS[nestLevel % NEST_COLORS.length]),
            color: component.style?.textColor || '#000000',
            fontSize: component.style?.fontSize || '12px',
            fontFamily: component.style?.fontFamily || 'Arial, sans-serif',
            fontWeight: component.style?.fontWeight || 'normal',
            padding: component.style?.padding || '4px',
            margin: component.style?.margin || '2px',
            border: isSelected
                ? '2px solid #3b82f6'
                : component.type === 'Card'
                    ? component.style?.border || '2px solid #f59e0b'
                    : component.type === 'Section'
                        ? component.style?.border || '2px solid #bae6fd'
                        : component.type === 'SocialLinks'
                            ? component.style?.border || '2px solid #86efac'
                            : '1px solid transparent',
            borderRadius: component.style?.borderRadius || '3px',
            opacity: component.style?.opacity || 1,
            zIndex: component.style?.zIndex || nestLevel,
            cursor: isDragging && isSelected ? 'grabbing' : 'grab',
            boxShadow: isSelected ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
            transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
            overflow: 'hidden',
            textAlign: component.style?.textAlign as any || 'left',
            lineHeight: component.style?.lineHeight || '1.4',
            letterSpacing: component.style?.letterSpacing || 'normal',
            display: component.style?.display || 'flex',
            alignItems: isTextComponent ? (textAlignItems as any) : (component.style?.alignItems || 'center'),
            justifyContent: isTextComponent ? (textVerticalJustify as any) : (component.style?.justifyContent || 'center'),
        };

        const innerStyle: React.CSSProperties = {
            ...componentStyle,
            position: 'relative',
            left: 'auto',
            top: 'auto',
            width: '100%',
            height: '100%',
            border: 'none',
            boxShadow: 'none',
            cursor: 'inherit',
        };

        return (
            <div
                key={component.id}
                style={componentStyle}
                className={isSelected ? 'group' : 'group hover:outline-1 hover:outline-gray-300'}
                onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
                onDoubleClick={() => {
                    if (component.type === 'Text' || component.type === 'Button') {
                        setInlineEditing(component.id);
                    }
                }}
                data-component-id={component.id}
                data-accepts-children={isContainer}
            >
                {/* Nest level indicator */}
                {nestLevel > 0 && (
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] px-1 py-0.5 rounded-br">
                        L{nestLevel}
                    </div>
                )}

                {/* Component controls - DELETE BUTTON IN TOP-RIGHT OUTER BOUNDARY */}
                <div className="absolute -top-2 -right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {/* Smaller delete button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(component.id);
                        }}
                        className="w-6 h-6 bg-red-500 text-white border border-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-sm transition-all"
                        title="Delete"
                    >
                        ×
                    </button>
                    {/* Settings button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingComponent(component);
                        }}
                        className="w-6 h-6 bg-gray-700 text-white border border-white rounded-full flex items-center justify-center text-xs hover:bg-gray-600 shadow-sm transition-all"
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>

                {/* Inline editing - FIXED placeholder text update */}
                {inlineEditing === component.id && (
                    <input
                        type="text"
                        defaultValue={component.props.children || ''}
                        onBlur={(e) => {
                            updateComponent(component.id, {
                                props: { ...component.props, children: e.target.value }
                            });
                            setInlineEditing(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                updateComponent(component.id, {
                                    props: { ...component.props, children: (e.target as HTMLInputElement).value }
                                });
                                setInlineEditing(null);
                            }
                        }}
                        className="absolute inset-0 w-full h-full bg-white border-2 border-blue-500 outline-none px-2 text-sm"
                        autoFocus
                    />
                )}

                {/* Enhanced component content with proper flexbox centering */}
                {!inlineEditing && Component && (
                    <DroppableContainer id={component.id} isContainer={isContainer}>
                        <div
                            className="w-full h-full flex"
                            style={{
                                display: 'flex',
                                alignItems: isTextComponent ? (textAlignItems as any) : 'center',
                                justifyContent: isTextComponent ? (textVerticalJustify as any) : 'center'
                            }}
                        >
                            <Component {...safeProps} style={innerStyle} />
                        </div>
                    </DroppableContainer>
                )}

                {/* Resize handles for selected components */}
                {isSelected && !isDragging && renderResizeHandles(component)}

                {/* Container indicator for nesting */}
                {isContainer && (
                    <div className="absolute inset-0 pointer-events-none border border-dashed border-transparent group-hover:border-blue-300 transition-colors rounded" />
                )}
            </div>
        );
    }, [selectedComponent, isDragging, isResizing, handleComponentMouseDown, deleteComponent, updateComponent, renderResizeHandles]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
        >
            <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-950 text-gray-100">
                {actionMessage && (
                    <div className="fixed top-4 right-4 z-1000 bg-gray-900/90 border border-gray-700 text-gray-100 px-3 py-2 rounded-lg shadow-lg text-sm">
                        {actionMessage}
                    </div>
                )}
                <Navigation />

                <div className="p-4">
                    {/* Header with controls */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-emerald-400">
                                    Email Template Builder
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Drag & drop components to create responsive email templates
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Undo/Redo */}
                                <div className="flex gap-1">
                                    <button
                                        onClick={undo}
                                        disabled={historyIndex === 0}
                                        className="px-2 py-1.5 bg-gray-800 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        ↩
                                    </button>
                                    <button
                                        onClick={redo}
                                        disabled={historyIndex === history.length - 1}
                                        className="px-2 py-1.5 bg-gray-800 rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        ↪
                                    </button>
                                </div>

                                {/* Export buttons */}
                                <button
                                    onClick={generateHtml}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-medium transition-all"
                                >
                                    Generate HTML
                                </button>

                                <button
                                    onClick={saveTemplate}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-all"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={loadTemplate}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm font-medium transition-all"
                                >
                                    Load
                                </button>

                                <button
                                    onClick={deleteTemplate}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition-all"
                                >
                                    Delete
                                </button>

                                <button
                                    onClick={createSampleTemplate}
                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-sm font-medium transition-all"
                                >
                                    Sample
                                </button>

                                <button
                                    onClick={startNewTemplate}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-all"
                                >
                                    New
                                </button>
                            </div>
                        </div>

                        {/* Canvas controls */}
                        <div className="flex items-center gap-3 mt-3 p-2 bg-gray-800/50 rounded-lg text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Preview:</span>
                                {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => {
                                            const prevMode = previewMode;
                                            setPreviewMode(mode);
                                            setCanvasScale(mode === 'desktop' ? 1 : mode === 'tablet' ? 0.8 : 0.6);

                                            // Scale existing components so layout remains responsive across modes
                                            const from = CANVAS_SIZES[prevMode];
                                            const to = CANVAS_SIZES[mode];
                                            const ratioX = to.width / from.width;
                                            const ratioY = to.height / from.height;
                                            setComponents((prev) => prev.map((c) => {
                                                const nextX = Math.round(((c.position?.x || 0) * ratioX) / GRID_SIZE) * GRID_SIZE;
                                                const nextY = Math.round(((c.position?.y || 0) * ratioY) / GRID_SIZE) * GRID_SIZE;
                                                const nextW = Math.max(20, Math.round(((c.size?.width || 150) * ratioX) / GRID_SIZE) * GRID_SIZE);
                                                const nextH = Math.max(20, Math.round(((c.size?.height || 100) * ratioY) / GRID_SIZE) * GRID_SIZE);

                                                const boundedX = Math.max(
                                                    SAFE_AREA_PADDING,
                                                    Math.min(nextX, to.width - nextW - SAFE_AREA_PADDING)
                                                );
                                                const boundedY = Math.max(
                                                    SAFE_AREA_PADDING,
                                                    Math.min(nextY, to.height - nextH - SAFE_AREA_PADDING)
                                                );

                                                return {
                                                    ...c,
                                                    position: { x: boundedX, y: boundedY },
                                                    size: { ...c.size, width: nextW, height: nextH },
                                                };
                                            }));
                                        }}
                                        className={`px-2 py-1 rounded ${previewMode === mode
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-1 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={showGrid}
                                        onChange={(e) => setShowGrid(e.target.checked)}
                                        className="rounded w-4 h-4"
                                    />
                                    Grid
                                </label>

                                <label className="flex items-center gap-1 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={snapToGrid}
                                        onChange={(e) => setSnapToGrid(e.target.checked)}
                                        className="rounded w-4 h-4"
                                    />
                                    Snap
                                </label>

                                <label className="flex items-center gap-1 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={liveEditMode}
                                        onChange={(e) => setLiveEditMode(e.target.checked)}
                                        className="rounded w-4 h-4"
                                    />
                                    Live Edit
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Component Library */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-3">
                                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                                    <span>📚</span> Component Library
                                </h2>

                                <div className="space-y-4">
                                    {Object.entries(ENHANCED_COMPONENT_CATEGORIES).map(([category, items]) => (
                                        <div key={category} className="space-y-1">
                                            <h3 className="text-xs font-medium text-gray-400 px-1">{category}</h3>
                                            <div className="grid grid-cols-2 gap-1">
                                                {items.map((componentType) => {
                                                    const details = COMPONENT_DETAILS[componentType as keyof typeof COMPONENT_DETAILS] || { icon: '📦', description: 'Component' };
                                                    return (
                                                        <div
                                                            key={`library-${componentType}`}
                                                            draggable
                                                            onDragStart={(e) => {
                                                                e.dataTransfer.setData('text/plain', `library-${componentType}`);
                                                                e.dataTransfer.effectAllowed = 'copy';
                                                            }}
                                                            className="bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded p-2 cursor-move transition-all hover:scale-[1.02] active:scale-[0.98] select-none"
                                                            title={details.description}
                                                        >
                                                            <div className="flex flex-col items-center gap-1 text-center">
                                                                <span className="text-lg">{details.icon}</span>
                                                                <span className="text-xs font-medium">{componentType}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Component Tree */}
                                <div className="mt-4">
                                    <h3 className="text-xs font-medium text-gray-400 mb-1">Component Tree</h3>
                                    <div className="space-y-1 max-h-48 overflow-y-auto text-sm">
                                        <SortableContext
                                            items={components.map(c => c.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {components.map((component) => (
                                                <SortableComponentItem
                                                    key={component.id}
                                                    component={component}
                                                    isSelected={selectedComponent === component.id}
                                                    onSelect={setSelectedComponent}
                                                    onDelete={deleteComponent}
                                                />
                                            ))}
                                        </SortableContext>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Builder Canvas */}
                        <div className="lg:col-span-2">
                            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-x-auto">
                                <div className="bg-gray-800/50 px-3 py-2 border-b border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                            </div>
                                            <span className="text-sm font-medium">Canvas</span>
                                            <span className="text-xs text-gray-400">
                                                {components.length} components
                                            </span>
                                            {(isDragging || isResizing) && (
                                                <span className="text-xs text-blue-400 animate-pulse">
                                                    {isDragging ? 'Dragging...' : 'Resizing...'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            {CANVAS_SIZES[previewMode].width}px width
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="p-3 bg-linear-to-br from-gray-900 to-gray-800"
                                    onMouseMove={handleCanvasMouseMove}
                                    onMouseUp={handleCanvasMouseUp}
                                    onMouseLeave={handleCanvasMouseUp}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'copy';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const componentType = e.dataTransfer.getData('text/plain');
                                        if (componentType.startsWith('library-')) {
                                            const canvasRect = canvasRef.current?.getBoundingClientRect();
                                            if (!canvasRect) return;

                                            const dropX = e.clientX - canvasRect.left;
                                            const dropY = e.clientY - canvasRect.top;

                                            const actualComponentType = componentType.replace('library-', '');

                                            // Get default size
                                            const compSize = getDefaultComponentSize(actualComponentType);

                                            // Apply safe area constraints
                                            const adjustedX = Math.max(SAFE_AREA_PADDING,
                                                Math.min(dropX, canvasRect.width - compSize.width - SAFE_AREA_PADDING));
                                            const adjustedY = Math.max(SAFE_AREA_PADDING,
                                                Math.min(dropY, canvasRect.height - compSize.height - SAFE_AREA_PADDING));

                                            // Apply grid snapping
                                            let finalX = adjustedX;
                                            let finalY = adjustedY;

                                            if (snapToGrid) {
                                                finalX = Math.round(adjustedX / GRID_SIZE) * GRID_SIZE;
                                                finalY = Math.round(adjustedY / GRID_SIZE) * GRID_SIZE;
                                            }

                                            addComponent(actualComponentType, undefined, { x: finalX, y: finalY });
                                        }
                                    }}
                                >
                                    <div
                                        ref={canvasRef}
                                        id="canvas"
                                        className="relative mx-auto bg-white rounded-lg shadow-xl overflow-hidden"
                                        style={{
                                            width: `${CANVAS_SIZES[previewMode].width}px`,
                                            height: `${CANVAS_SIZES[previewMode].height}px`,
                                            transform: `scale(${canvasScale})`,
                                            transformOrigin: 'top center',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {dragGuides && (isDragging || isResizing) && (
                                            <>
                                                <div
                                                    className="absolute top-0 bottom-0 w-px bg-blue-400/60 pointer-events-none"
                                                    style={{ left: dragGuides.x }}
                                                />
                                                <div
                                                    className="absolute left-0 right-0 h-px bg-blue-400/60 pointer-events-none"
                                                    style={{ top: dragGuides.y }}
                                                />
                                            </>
                                        )}
                                        {/* Grid background */}
                                        {showGrid && (
                                            <div
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    backgroundImage: `
                            linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
                            linear-gradient(#e5e7eb 1px, transparent 1px)
                          `,
                                                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                                                    opacity: 0.55,
                                                }}
                                            />
                                        )}

                                        {/* Safe area boundary */}
                                        <div
                                            className="absolute inset-0 border border-dashed border-green-300 pointer-events-none"
                                            style={{
                                                top: SAFE_AREA_PADDING,
                                                left: SAFE_AREA_PADDING,
                                                right: SAFE_AREA_PADDING,
                                                bottom: SAFE_AREA_PADDING,
                                                opacity: 0.5
                                            }}
                                        >
                                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-[10px] text-green-600 bg-white px-1">
                                                Safe Area
                                            </div>
                                        </div>

                                        {/* Components */}
                                        {components.map(renderComponent)}

                                        {/* Empty state */}
                                        {components.length === 0 && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <div className="text-4xl mb-2 opacity-50">📧</div>
                                                <p className="text-sm mb-1">Empty Canvas</p>
                                                <p className="text-xs">Drag components from the library to get started</p>
                                                <div className="text-[10px] mt-2 text-gray-500 text-center">
                                                    <p>• Drag components from the left panel</p>
                                                    <p>• Drag to move components</p>
                                                    <p>• Click corners/edges to resize</p>
                                                    <p>• Double-click text to edit inline</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Properties Panel */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-3">
                                {selectedComponent ? (
                                    <div>
                                        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                                            <span>⚙️</span> Properties
                                        </h2>

                                        {(() => {
                                            const component = components.find(c => c.id === selectedComponent);
                                            if (!component) return null;

                                            return (
                                                <div className="space-y-3">
                                                    {/* Basic info */}
                                                    <div className="p-2 bg-gray-700/30 rounded">
                                                        <div className="text-sm font-medium mb-0.5">
                                                            {component.type}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            ID: {component.id.slice(0, 6)}...
                                                        </div>
                                                        {component.nestLevel && (
                                                            <div className="text-xs text-gray-400 mt-0.5">
                                                                Level: {component.nestLevel}
                                                            </div>
                                                        )}
                                                        {component.parentId && (
                                                            <div className="text-xs text-green-400 mt-0.5">
                                                                Nested
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Position & Size */}
                                                    <div className="space-y-2">
                                                        <h3 className="text-xs font-medium text-gray-400">Position & Size</h3>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">X</label>
                                                                <input
                                                                    type="number"
                                                                    value={component.position?.x || 0}
                                                                    onChange={(e) => updateComponentPosition(
                                                                        component.id,
                                                                        parseInt(e.target.value) || 0,
                                                                        component.position?.y || 0
                                                                    )}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Y</label>
                                                                <input
                                                                    type="number"
                                                                    value={component.position?.y || 0}
                                                                    onChange={(e) => updateComponentPosition(
                                                                        component.id,
                                                                        component.position?.x || 0,
                                                                        parseInt(e.target.value) || 0
                                                                    )}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Width</label>
                                                                <input
                                                                    type="number"
                                                                    value={component.size?.width || 150}
                                                                    onChange={(e) => updateComponentPosition(
                                                                        component.id,
                                                                        component.position?.x || 0,
                                                                        component.position?.y || 0,
                                                                        parseInt(e.target.value) || 0,
                                                                        component.size?.height
                                                                    )}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Height</label>
                                                                <input
                                                                    type="number"
                                                                    value={component.size?.height || 100}
                                                                    onChange={(e) => updateComponentPosition(
                                                                        component.id,
                                                                        component.position?.x || 0,
                                                                        component.position?.y || 0,
                                                                        component.size?.width,
                                                                        parseInt(e.target.value) || 0
                                                                    )}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Style Controls */}
                                                    <div className="space-y-2">
                                                        <h3 className="text-xs font-medium text-gray-400">Style</h3>

                                                        <div>
                                                            <label className="text-xs text-gray-400">Background Color</label>
                                                            <input
                                                                type="color"
                                                                value={component.style?.backgroundColor || '#ffffff'}
                                                                onChange={(e) => updateComponent(component.id, {
                                                                    style: { ...component.style, backgroundColor: e.target.value }
                                                                })}
                                                                className="w-full h-7 rounded cursor-pointer"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-xs text-gray-400">Text Color</label>
                                                            <input
                                                                type="color"
                                                                value={component.style?.textColor || '#000000'}
                                                                onChange={(e) => updateComponent(component.id, {
                                                                    style: { ...component.style, textColor: e.target.value }
                                                                })}
                                                                className="w-full h-7 rounded cursor-pointer"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-xs text-gray-400">Font Size</label>
                                                            <select
                                                                value={component.style?.fontSize || '14px'}
                                                                onChange={(e) => updateComponent(component.id, {
                                                                    style: { ...component.style, fontSize: e.target.value }
                                                                })}
                                                                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                            >
                                                                {['12px', '14px', '16px', '18px', '20px'].map(size => (
                                                                    <option key={size} value={size}>{size}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">Padding</label>
                                                                <input
                                                                    type="text"
                                                                    value={component.style?.padding || '4px'}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        style: { ...component.style, padding: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="4px"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Margin</label>
                                                                <input
                                                                    type="text"
                                                                    value={component.style?.margin || '2px'}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        style: { ...component.style, margin: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="2px"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content / component-specific props */}
                                                    {['Text', 'Button', 'Card', 'Section', 'Header'].includes(component.type) && (
                                                        <div>
                                                            <label className="text-xs text-gray-400">Content</label>
                                                            <input
                                                                type="text"
                                                                value={(component.props.children as any) ?? ''}
                                                                onChange={(e) => updateComponent(component.id, {
                                                                    props: { ...component.props, children: e.target.value }
                                                                })}
                                                                className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                placeholder="Enter text..."
                                                            />
                                                        </div>
                                                    )}

                                                    {component.type === 'Footer' && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">Company</label>
                                                                <input
                                                                    type="text"
                                                                    value={(component.props.company as any) ?? ''}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        props: { ...component.props, company: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="Your Company"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Address</label>
                                                                <input
                                                                    type="text"
                                                                    value={(component.props.address as any) ?? ''}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        props: { ...component.props, address: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="123 Main St"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Unsubscribe Link</label>
                                                                <input
                                                                    type="text"
                                                                    value={(component.props.unsubscribeLink as any) ?? ''}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        props: { ...component.props, unsubscribeLink: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {component.type === 'Text' && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">Horizontal Align</label>
                                                                <select
                                                                    value={component.style?.textAlign || 'left'}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        style: { ...component.style, textAlign: e.target.value as any }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                >
                                                                    {['left', 'center', 'right', 'justify'].map(a => (
                                                                        <option key={a} value={a}>{a}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <label className="text-xs text-gray-400">Vertical Align</label>
                                                                <select
                                                                    value={component.style?.justifyContent || 'center'}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        style: { ...component.style, justifyContent: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                >
                                                                    <option value="flex-start">top</option>
                                                                    <option value="center">middle</option>
                                                                    <option value="flex-end">bottom</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {component.type === 'Image' && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">Image URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={(component.props.src as any) ?? ''}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        props: { ...component.props, src: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-400">Alt text</label>
                                                                <input
                                                                    type="text"
                                                                    value={(component.props.alt as any) ?? ''}
                                                                    onChange={(e) => updateComponent(component.id, {
                                                                        props: { ...component.props, alt: e.target.value }
                                                                    })}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                                                                    placeholder="Description"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {component.type === 'SocialLinks' && (
                                                        <div className="space-y-2">
                                                            <div>
                                                                <label className="text-xs text-gray-400">Links (JSON)</label>
                                                                <textarea
                                                                    value={JSON.stringify((component.props as any).links ?? [], null, 2)}
                                                                    onChange={(e) => {
                                                                        try {
                                                                            const parsed = JSON.parse(e.target.value);
                                                                            updateComponent(component.id, {
                                                                                props: {
                                                                                    ...component.props,
                                                                                    links: Array.isArray(parsed) ? parsed : []
                                                                                }
                                                                            });
                                                                        } catch {
                                                                            // ignore parse errors while typing
                                                                        }
                                                                    }}
                                                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs font-mono"
                                                                    rows={5}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="pt-3 border-t border-gray-700">
                                                        <button
                                                            onClick={() => setEditingComponent(component)}
                                                            className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-all mb-1"
                                                        >
                                                            Advanced Editor
                                                        </button>
                                                        <button
                                                            onClick={() => deleteComponent(component.id)}
                                                            className="w-full px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm font-medium transition-all"
                                                        >
                                                            Delete Component
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400">
                                        <div className="text-3xl mb-2 opacity-50">📋</div>
                                        <p className="text-sm">Select a component to edit properties</p>
                                        <p className="text-xs mt-1 text-gray-500">
                                            Click on any component in the canvas
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* HTML Preview */}
                    {showPreview && outputHtml && (
                        <div className="mt-4">
                            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-base font-semibold">HTML Output</h3>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(outputHtml);
                                            flashActionMessage('Copied');
                                        }}
                                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                                    >
                                        Copy HTML
                                    </button>
                                </div>
                                <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-xs text-emerald-400 max-h-64 overflow-y-auto">
                                    <code>{outputHtml}</code>
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Component Editor Modal */}
                {editingComponent && (
                    <ComponentEditor
                        component={editingComponent}
                        onUpdate={(updates) => updateComponent(editingComponent.id, updates)}
                        onClose={() => setEditingComponent(null)}
                    />
                )}

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeComponent && (
                        <div
                            className="bg-blue-500/20 border-2 border-blue-500 rounded p-2 opacity-80"
                            style={{
                                width: activeComponent.size?.width || 150,
                                height: activeComponent.size?.height || 100,
                            }}
                        >
                            <div className="text-center text-blue-500 text-sm font-medium">
                                {activeComponent.type}
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
