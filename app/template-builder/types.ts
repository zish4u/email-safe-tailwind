/**
 * Email Template Builder - Type Definitions
 * 
 * Comprehensive TypeScript types for the email template builder system.
 * All components are designed to be email-safe (table-based layouts, inline styles).
 */

// ============================================================================
// Component Types
// ============================================================================

export type ComponentType =
    // Layout Components
    | 'section'
    | 'column'
    | 'spacer'
    | 'divider'
    // Content Components
    | 'text'
    | 'image'
    | 'button'
    | 'video'
    // Advanced Components
    | 'social-links'
    | 'html'
    | 'custom-code';

// ============================================================================
// Base Interfaces
// ============================================================================

export interface ComponentNode {
    id: string;
    type: ComponentType;
    name: string;
    children?: ComponentNode[];
    props: ComponentProps;
    styles: StyleProperties;
    locked?: boolean;
    hidden?: boolean;
}

export interface ComponentProps {
    [key: string]: any;
}

export interface StyleProperties {
    // Spacing
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;

    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string | number;
    lineHeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    textDecoration?: string;

    // Background
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;

    // Border
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;

    // Layout
    width?: string;
    height?: string;
    maxWidth?: string;
    display?: string;

    // Other
    [key: string]: any;
}

// ============================================================================
// Component-Specific Props
// ============================================================================

export interface TextComponentProps extends ComponentProps {
    content: string;
    tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export interface ImageComponentProps extends ComponentProps {
    src: string;
    alt: string;
    width?: string;
    height?: string;
    href?: string; // Optional link
}

export interface ButtonComponentProps extends ComponentProps {
    text: string;
    href: string;
    target?: '_blank' | '_self';
}

export interface VideoComponentProps extends ComponentProps {
    thumbnailUrl: string;
    videoUrl: string;
    alt: string;
}

export interface SocialLinksComponentProps extends ComponentProps {
    links: {
        platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
        url: string;
    }[];
    iconSize?: string;
}

export interface SectionComponentProps extends ComponentProps {
    maxWidth?: string;
    align?: 'left' | 'center' | 'right';
}

export interface ColumnComponentProps extends ComponentProps {
    width?: string; // Percentage or pixels
    colSpan?: number; // 1-12
}

export interface SpacerComponentProps extends ComponentProps {
    height: string;
}

export interface DividerComponentProps extends ComponentProps {
    thickness?: string;
    style?: 'solid' | 'dashed' | 'dotted';
}

export interface HtmlComponentProps extends ComponentProps {
    html: string;
}

export interface CustomCodeComponentProps extends ComponentProps {
    code: string;
}

// ============================================================================
// Canvas Settings
// ============================================================================

export type PreviewMode = 'desktop' | 'tablet' | 'mobile';
export type ZoomLevel = 50 | 75 | 100 | 150 | 200;

export interface CanvasSettings {
    zoom: ZoomLevel;
    previewMode: PreviewMode;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
}

// ============================================================================
// History & State
// ============================================================================

export interface HistoryState {
    components: ComponentNode[];
    timestamp: number;
}

export interface BuilderState {
    // Component tree
    components: ComponentNode[];

    // Selection
    selectedId: string | null;
    hoveredId: string | null;

    // History
    history: HistoryState[];
    historyIndex: number;

    // Canvas settings
    canvasSettings: CanvasSettings;

    // UI state
    showComponentLibrary: boolean;
    showPropertiesPanel: boolean;
    showLayersPanel: boolean;

    // Actions
    addComponent: (component: ComponentNode, parentId?: string, index?: number) => void;
    updateComponent: (id: string, updates: Partial<ComponentNode>) => void;
    deleteComponent: (id: string) => void;
    moveComponent: (id: string, newParentId: string | null, index: number) => void;
    duplicateComponent: (id: string) => void;

    selectComponent: (id: string | null) => void;
    setHoveredComponent: (id: string | null) => void;

    updateStyles: (id: string, styles: Partial<StyleProperties>) => void;
    updateProps: (id: string, props: Partial<ComponentProps>) => void;

    // History actions
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;

    // Canvas actions
    updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
    setZoom: (zoom: ZoomLevel) => void;
    setPreviewMode: (mode: PreviewMode) => void;
    toggleGrid: () => void;

    // UI actions
    togglePanel: (panel: 'library' | 'properties' | 'layers') => void;

    // Utility
    getComponentById: (id: string) => ComponentNode | null;
    exportToJSON: () => string;
    exportToHTML: () => string;
    importFromJSON: (json: string) => void;
    reset: () => void;
}

// ============================================================================
// Component Library
// ============================================================================

export interface ComponentDefinition {
    type: ComponentType;
    name: string;
    icon: string; // Lucide icon name
    category: 'layout' | 'content' | 'advanced';
    description: string;
    defaultProps: ComponentProps;
    defaultStyles: StyleProperties;
    canHaveChildren: boolean;
    allowedParents?: ComponentType[];
}

// ============================================================================
// Drag & Drop
// ============================================================================

export interface DragData {
    type: 'library' | 'canvas' | 'layer';
    componentType?: ComponentType;
    componentId?: string;
    component?: ComponentNode;
}

export interface DropResult {
    parentId: string | null;
    index: number;
}

// ============================================================================
// Export
// ============================================================================

export interface ExportOptions {
    minifyHTML?: boolean;
    includeComments?: boolean;
    inlineCSS?: boolean;
}
