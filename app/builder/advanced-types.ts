// =====================================================
// Advanced Email Builder Types - Module, Grid, Group, Elements Architecture
// =====================================================

// ==================== COMPONENT TYPE DEFINITION ====================

// Export our own ComponentType for the new architecture
export type ComponentType =
    | 'Module'
    | 'Grid'
    | 'GridItem'
    | 'Group'
    | 'Text'
    | 'Image'
    | 'Button'
    | 'Divider'
    | 'Spacer';

// ==================== CORE COMPONENT TYPES ====================

/**
 * Module - A vertical section of the email (top-level building block)
 * Acts as a parent wrapper for each email section
 */
export interface ModuleComponent {
    id: string;
    type: 'Module';
    props: ModuleProps;
    children?: EmailComponent[];
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface ModuleProps {
    // Layout properties
    fullWidth?: boolean;
    maxWidth?: number;
    backgroundColor?: string;
    backgroundImage?: BackgroundImageProps;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: BoxShadowProps;

    // Container properties
    containerWidth?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

/**
 * Grid - Multi-column layout container
 * Contains one or more GridItems (columns)
 */
export interface GridComponent {
    id: string;
    type: 'Grid';
    props: GridProps;
    children: EmailComponent[];
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface GridProps {
    // Grid layout
    columns: number;
    columnSpacing?: number;
    rowSpacing?: number;
    equalHeight?: boolean;

    // Styling
    backgroundColor?: string;
    backgroundImage?: BackgroundImageProps;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: BoxShadowProps;

    // Responsive behavior
    collapseOnMobile?: boolean;
    mobileDirection?: 'vertical' | 'horizontal';
}

/**
 * GridItem - Individual column within a Grid
 * Can contain Elements, Groups, or nested Grids
 */
export interface GridItemComponent {
    id: string;
    type: 'GridItem';
    props: GridItemProps;
    children?: EmailComponent[];
    columnIndex: number;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface GridItemProps {
    // Column properties
    width?: number | string; // px or percentage
    minWidth?: number;
    maxWidth?: number;
    flex?: number;

    // Styling
    backgroundColor?: string;
    backgroundImage?: BackgroundImageProps;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: BoxShadowProps;

    // Alignment
    verticalAlign?: 'top' | 'middle' | 'bottom';
    textAlign?: 'left' | 'center' | 'right';
}

/**
 * Group - Logical grouping wrapper for elements or layouts
 * Can be nested within Module, GridItem, or another Group
 */
export interface GroupComponent {
    id: string;
    type: 'Group';
    props: GroupProps;
    children?: EmailComponent[];
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface GroupProps {
    // Group properties
    displayName?: string;
    locked?: boolean;

    // Layout
    direction?: 'vertical' | 'horizontal';
    spacing?: number;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

    // Styling
    backgroundColor?: string;
    backgroundImage?: BackgroundImageProps;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: BoxShadowProps;
}

// ==================== ELEMENT COMPONENTS ====================

/**
 * Base interface for all elements
 */
export interface BaseElementProps {
    // Common styling
    backgroundColor?: string;
    backgroundImage?: BackgroundImageProps;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: BoxShadowProps;

    // Positioning
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    height?: number | string;
    minHeight?: number;
    maxHeight?: number;

    // Alignment
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

/**
 * Text Element
 */
export interface TextElement {
    id: string;
    type: 'Text';
    props: TextProps;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface TextProps extends BaseElementProps {
    // Content
    content: string;
    placeholder?: string;

    // Typography
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textDecoration?: 'none' | 'underline' | 'line-through';

    // Advanced typography
    fontStyle?: 'normal' | 'italic';
    textShadow?: string;
}

/**
 * Image Element
 */
export interface ImageElement {
    id: string;
    type: 'Image';
    props: ImageProps;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface ImageProps extends BaseElementProps {
    // Image properties
    src: string;
    alt: string;
    title?: string;

    // Image behavior
    width?: number | string;
    height?: number | string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    borderRadius?: string;

    // Link behavior
    link?: string;
    linkTarget?: '_blank' | '_self';

    // Fallback
    fallbackColor?: string;
}

/**
 * Button Element
 */
export interface ButtonElement {
    id: string;
    type: 'Button';
    props: ButtonProps;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface ButtonProps extends BaseElementProps {
    // Content
    text: string;

    // Button styling
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    textColor?: string;
    hoverTextColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: string;

    // Button dimensions
    width?: 'auto' | number | string;
    height?: 'auto' | number;
    paddingX?: number;
    paddingY?: number;
    fullWidth?: boolean;

    // Typography
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: string;
    textAlign?: 'center';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

    // Button behavior
    link?: string;
    linkTarget?: '_blank' | '_self';
    disabled?: boolean;
}

/**
 * Divider Element
 */
export interface DividerElement {
    id: string;
    type: 'Divider';
    props: DividerProps;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface DividerProps extends BaseElementProps {
    // Divider appearance
    height?: number;
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted' | 'double';

    // Layout
    width?: 'auto' | number | string;
    align?: 'left' | 'center' | 'right';

    // Text label (optional)
    text?: string;
    textColor?: string;
    textBackgroundColor?: string;
    textPadding?: number;
}

/**
 * Spacer Element
 */
export interface SpacerElement {
    id: string;
    type: 'Spacer';
    props: SpacerProps;
    position?: { x: number; y: number; width?: number; height?: number; };
    constraints?: {
        aspectRatio?: number;
        lockAspectRatio?: boolean;
        resizable?: boolean;
        movable?: boolean;
    };
}

export interface SpacerProps extends BaseElementProps {
    // Spacer dimensions
    height: number;
    width?: number | string;

    // Visual indicators (for editor only)
    showInEditor?: boolean;
    editorColor?: string;
}

// ==================== UNION TYPES ====================

export type ElementComponent =
    | TextElement
    | ImageElement
    | ButtonElement
    | DividerElement
    | SpacerElement;

export type LayoutComponent =
    | ModuleComponent
    | GridComponent
    | GridItemComponent
    | GroupComponent;

export type EmailComponent =
    | LayoutComponent
    | ElementComponent;

// ==================== SUPPORTING TYPE DEFINITIONS ====================

/**
 * Spacing properties for consistent margin/padding
 */
export interface SpacingProps {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    horizontal?: number; // sets left & right
    vertical?: number;   // sets top & bottom
    all?: number;        // sets all sides
}

/**
 * Border properties
 */
export interface BorderProps {
    width?: number;
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge';
    side?: 'top' | 'right' | 'bottom' | 'left' | 'all';
}

/**
 * Box shadow properties
 */
export interface BoxShadowProps {
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
    color?: string;
    inset?: boolean;
}

/**
 * Background image properties
 */
export interface BackgroundImageProps {
    url: string;
    position?: 'top' | 'center' | 'bottom' | 'left' | 'right' | string;
    repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    size?: 'cover' | 'contain' | 'auto' | string;
    overlay?: {
        color: string;
        opacity: number;
    };
}

// ==================== COMPONENT HIERARCHY RULES ====================

/**
 * Defines what can be placed where in the component hierarchy
 */
export const HIERARCHY_RULES = {
    // Module can contain
    Module: ['Grid', 'Group', 'Text', 'Image', 'Button', 'Divider', 'Spacer'] as ComponentType[],

    // Grid can contain
    Grid: ['GridItem'] as ComponentType[],

    // GridItem can contain
    GridItem: ['Grid', 'Group', 'Text', 'Image', 'Button', 'Divider', 'Spacer'] as ComponentType[],

    // Group can contain
    Group: ['Grid', 'Group', 'Text', 'Image', 'Button', 'Divider', 'Spacer'] as ComponentType[],
} as const;

/**
 * Check if a component type can be placed in a parent
 */
export function canPlaceInParent(childType: ComponentType, parentType: ComponentType): boolean {
    const allowedChildren = HIERARCHY_RULES[parentType as keyof typeof HIERARCHY_RULES];
    return allowedChildren?.includes(childType) || false;
}

// ==================== EMAIL-SAFE FONT FAMILIES ====================

export const EMAIL_SAFE_FONTS = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif',
    'Trebuchet MS, sans-serif',
    'Courier New, monospace',
] as const;

// ==================== DEFAULT PROPS ====================

export const DEFAULT_MODULE_PROPS: ModuleProps = {
    fullWidth: true,
    maxWidth: 600,
    backgroundColor: '#ffffff',
    padding: { all: 20 },
};

export const DEFAULT_GRID_PROPS: GridProps = {
    columns: 2,
    columnSpacing: 20,
    equalHeight: false,
    collapseOnMobile: true,
    mobileDirection: 'vertical',
};

export const DEFAULT_GRID_ITEM_PROPS: GridItemProps = {
    padding: { all: 10 },
    verticalAlign: 'top',
};

export const DEFAULT_GROUP_PROPS: GroupProps = {
    spacing: 10,
    align: 'start'
};

export const DEFAULT_TEXT_PROPS: TextProps = {
    content: 'Your text here',
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 1.5,
    color: '#333333',
    textAlign: 'left',
};

export const DEFAULT_IMAGE_PROPS: ImageProps = {
    src: 'https://via.placeholder.com/300x200',
    alt: 'Image',
    width: '100%',
    height: 'auto',
};

export const DEFAULT_BUTTON_PROPS: ButtonProps = {
    text: 'Click Me',
    backgroundColor: '#007bff',
    textColor: '#ffffff',
    borderRadius: '4px',
    paddingX: 20,
    paddingY: 12,
    fullWidth: false,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
};

export const DEFAULT_DIVIDER_PROPS: DividerProps = {
    height: 1,
    color: '#e0e0e0',
    style: 'solid',
    width: '100%',
    align: 'center',
};

export const DEFAULT_SPACER_PROPS: SpacerProps = {
    height: 20,
    width: '100%',
    showInEditor: true,
    editorColor: '#f0f0f0',
};
