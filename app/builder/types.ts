// =====================================================
// Email Builder Types & Constants
// =====================================================

/**
 * Core component interface for template builder
 */
export interface TemplateComponent {
    id: string;
    type: ComponentType;
    props: Record<string, unknown>;
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
    style?: ComponentStyle;
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

export interface ComponentStyle {
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
}

// Component types supported by the builder
export type ComponentType =
    | 'Section'
    | 'Column'
    | 'Row'
    | 'Grid'
    | 'Text'
    | 'Image'
    | 'Card'
    | 'Divider'
    | 'Button'
    | 'SocialLinks'
    | 'Menu'
    | 'Logo'
    | 'Header'
    | 'Footer'
    | 'Spacer'
    | 'Wrapper'
    | 'Conditional';

// Component metadata for UI display
export interface ComponentDetail {
    icon: string;
    description: string;
}

export const COMPONENT_DETAILS: Record<ComponentType, ComponentDetail> = {
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
    Header: { icon: '📄', description: 'Email header section' },
    Footer: { icon: '📌', description: 'Email footer with unsubscribe' },
    Spacer: { icon: '↕️', description: 'Vertical space' },
    Wrapper: { icon: '📎', description: 'Content wrapper' },
    Conditional: { icon: '🎯', description: 'Conditional content' },
};

// Component categories for the library sidebar
export const COMPONENT_CATEGORIES: Record<string, ComponentType[]> = {
    Layout: ['Section', 'Column', 'Row', 'Grid'],
    Content: ['Text', 'Image', 'Card', 'Divider'],
    Interactive: ['Button', 'SocialLinks', 'Menu'],
    Branding: ['Logo', 'Header', 'Footer'],
    Advanced: ['Spacer', 'Wrapper', 'Conditional'],
};

// Container components that can accept children
export const CONTAINER_TYPES: ComponentType[] = ['Section', 'Card', 'Row', 'Column', 'Wrapper'];

// Nest level colors with good contrast for visual hierarchy
export const NEST_COLORS = [
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

// Grid and layout constants
export const GRID_SIZE = 8;
export const SAFE_AREA_PADDING = 16;
export const MAX_NEST_LEVEL = 5;

// Default component sizes (compact for email)
export const DEFAULT_COMPONENT_SIZES: Record<ComponentType, { width: number; height: number }> = {
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

// Canvas sizes for different preview modes
export type PreviewMode = 'desktop' | 'mobile';

export const CANVAS_SIZES: Record<PreviewMode, { width: number; height: number }> = {
    desktop: { width: 600, height: 800 }, // Standard email width for desktop
    mobile: { width: 375, height: 667 }, // Standard mobile dimensions
};

// Zoom levels for canvas (independent of device dimensions)
export const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
export const DEFAULT_ZOOM = 1;

// LocalStorage key for template persistence
export const TEMPLATE_STORAGE_KEY = 'email-safe-tailwind:builder-template:v1';

// Helper to get default component size
export function getDefaultComponentSize(componentType: string): { width: number; height: number } {
    return DEFAULT_COMPONENT_SIZES[componentType as ComponentType] || { width: 150, height: 100 };
}

// Check if a component type is a container
export function isContainerType(type: string): boolean {
    return CONTAINER_TYPES.includes(type as ComponentType);
}
