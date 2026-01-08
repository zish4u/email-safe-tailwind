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
    isVisible?: boolean;
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
    width?: string;
    height?: string;
    flexDirection?: string;
    position?: 'relative' | 'absolute' | 'static' | 'fixed';
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
}

// Component types supported by the builder
export type ComponentType =
    | 'Section'
    | 'Row'
    | 'Column'
    | 'Group'
    | 'Text'
    | 'Image'
    | 'Button'
    | 'Divider'
    | 'Spacer'
    | 'SocialLinks'
    | 'Logo';

// Component metadata for UI display
export interface ComponentDetail {
    icon: string;
    description: string;
}

export const COMPONENT_DETAILS: Record<ComponentType, ComponentDetail> = {
    // Section: { icon: '📦', description: 'Container for content' },
    // Column: { icon: '📐', description: 'Vertical layout column' },
    Section: { icon: '📦', description: 'Horizontal layout row' },
    Row: { icon: '↔️', description: 'Flexible grid layout' },
    Column: { icon: '📐', description: 'Flexible grid layout' },
    Group: { icon: '🔲', description: 'Flexible grid layout' },
    Text: { icon: '📝', description: 'Text content block' },
    Image: { icon: '🖼️', description: 'Image with alt text' },
    Divider: { icon: '➖', description: 'Horizontal divider line' },
    Button: { icon: '🔘', description: 'Clickable button' },
    SocialLinks: { icon: '🔗', description: 'Social media links' },
    Logo: { icon: '🏢', description: 'Company logo' },
    Spacer: { icon: '↕️', description: 'Vertical space' },
};

// Component categories for the library sidebar
export const COMPONENT_CATEGORIES: Record<string, ComponentType[]> = {
    Layout: ['Section', 'Row', 'Column', 'Group'],
    Content: ['Button', 'Text', 'Image', 'Divider', 'Spacer'],
};

// Container components that can accept children
export const CONTAINER_TYPES: ComponentType[] = ['Section', 'Row', 'Column', 'Group'];

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

// Row and layout constants
export const GRID_SIZE = 8;
export const SAFE_AREA_PADDING = 16;
export const MAX_NEST_LEVEL = 5;

// Default component sizes (compact for email)
export const DEFAULT_COMPONENT_SIZES: Record<ComponentType, { width: number; height: number }> = {
    Section: { width: 150, height: 200 },
    Row: { width: 400, height: 150 },
    Column: { width: 400, height: 80 },
    Group: { width: 80, height: 30 },
    Button: { width: 120, height: 40 },
    Text: { width: 200, height: 40 },
    Image: { width: 200, height: 150 },
    Divider: { width: 400, height: 2 },
    Spacer: { width: 400, height: 10 },
    SocialLinks: { width: 300, height: 50 },
    Logo: { width: 100, height: 50 },
};

// Email-safe canvas dimensions with safe area boundaries
export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

// Standard email client dimensions (safe for Gmail, Outlook, etc.)
export const EMAIL_CLIENT_DIMENSIONS = {
    // Desktop email clients (Gmail, Outlook, Apple Mail)
    desktop: {
        maxWidth: 600,  // Safe maximum width for most email clients
        minWidth: 320,  // Minimum readable width
        safeWidth: 580, // Optimal safe width with padding
        padding: 10,    // Safe area padding on each side
    },
    // Tablet email clients
    tablet: {
        maxWidth: 600,  // Same as desktop for consistency
        minWidth: 320,
        safeWidth: 560,
        padding: 20,
    },
    // Mobile email clients
    mobile: {
        maxWidth: 414,  // iPhone Plus width
        minWidth: 320,  // iPhone SE width
        safeWidth: 374, // Safe width with padding
        padding: 20,
    },
};

// Canvas display sizes (for the builder UI)
export const CANVAS_SIZES: Record<PreviewMode, { width: number; height: number }> = {
    desktop: { width: 640, height: 800 },  // Canvas with visible safe area
    tablet: { width: 640, height: 800 },   // Same canvas size, different safe area
    mobile: { width: 454, height: 800 },   // Smaller canvas for mobile
};

// Safe area boundaries for content placement
export const SAFE_AREA_BOUNDARIES: Record<PreviewMode, {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}> = {
    desktop: {
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
        width: 580,
        height: 760,
    },
    tablet: {
        left: 40,
        right: 40,
        top: 20,
        bottom: 20,
        width: 560,
        height: 760,
    },
    mobile: {
        left: 40,
        right: 40,
        top: 20,
        bottom: 20,
        width: 374,
        height: 760,
    },
};

// Email client compatibility warnings (strict enforcement)
export const EMAIL_WARNINGS = {
    maxWidth: 'Content exceeds 600px - will break in some email clients',
    minWidth: 'Content below 320px - difficult to read on mobile',
    padding: 'Content too close to edges - will be cut off in email clients',
    overflow: 'Content extends beyond safe area - WILL CAUSE UI BREAKS',
    strictExceed: 'Component exceeds safe area - RESIZED AUTOMATICALLY',
};

// Strict safe area enforcement rules
export const SAFE_AREA_RULES = {
    enforceWidth: true,        // Strictly enforce max width
    enforcePosition: true,     // Keep components within safe area
    autoResize: true,         // Auto-resize oversized components
    preventOverflow: true,    // Prevent any overflow beyond safe area
    snapToSafe: true,         // Snap components to safe area when dropped
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
