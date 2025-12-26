// Common props for email components
export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

// Module component props - Top-level email section
export interface ModuleProps extends BaseComponentProps {
    children: React.ReactNode;
    fullWidth?: boolean;
    maxWidth?: number;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
    containerWidth?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Grid component props - Multi-column layout container
export interface GridProps extends BaseComponentProps {
    children: React.ReactNode;
    columns: number;
    columnSpacing?: number;
    rowSpacing?: number;
    equalHeight?: boolean;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
    collapseOnMobile?: boolean;
    mobileDirection?: 'vertical' | 'horizontal';
}

// GridItem component props - Individual column within a Grid
export interface GridItemProps extends BaseComponentProps {
    children: React.ReactNode;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    flex?: number;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
    verticalAlign?: 'top' | 'middle' | 'bottom';
    textAlign?: 'left' | 'center' | 'right';
}

// Group component props - Logical grouping wrapper
export interface GroupProps extends BaseComponentProps {
    children: React.ReactNode;
    displayName?: string;
    locked?: boolean;
    direction?: 'vertical' | 'horizontal';
    spacing?: number;
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
}

// Spacer component props - Visual spacing element
export interface SpacerProps extends BaseComponentProps {
    height: number;
    width?: number | string;
    showInEditor?: boolean;
    editorColor?: string;
}

// Supporting type definitions
export interface SpacingProps {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
    horizontal?: number;
    vertical?: number;
    all?: number;
}

export interface BorderProps {
    width?: number;
    color?: string;
    style?: 'solid' | 'dashed' | 'dotted' | 'double';
    side?: 'top' | 'right' | 'bottom' | 'left' | 'all';
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
    text?: string;
    children?: React.ReactNode;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    target?: '_blank' | '_self';
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    textColor?: string;
    hoverTextColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: string;
    width?: 'auto' | number | string;
    height?: 'auto' | number;
    paddingX?: number;
    paddingY?: number;
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: string;
    textAlign?: 'center';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    link?: string;
    linkTarget?: '_blank' | '_self';
    disabled?: boolean;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    boxShadow?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Card component props
export interface CardProps extends BaseComponentProps {
    children: React.ReactNode;
    padding?: 'sm' | 'md' | 'lg';
    backgroundColor?: string;
    borderRadius?: boolean;
}

// Header component props
export interface HeaderProps extends BaseComponentProps {
    logo?: string;
    title?: string;
    subtitle?: string;
    backgroundColor?: string;
    textColor?: string;
}

// Footer component props
export interface FooterProps extends BaseComponentProps {
    company?: string;
    address?: string;
    unsubscribeLink?: string;
    socialLinks?: Array<{
        platform: string;
        url: string;
        icon?: string;
    }>;
    backgroundColor?: string;
    textColor?: string;
}

// Section component props
export interface SectionProps extends BaseComponentProps {
    children: React.ReactNode;
    backgroundColor?: string;
    padding?: 'sm' | 'md' | 'lg';
    maxWidth?: string;
}

// Text component props
export interface TextProps extends BaseComponentProps {
    children?: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
    color?: string;
    align?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    fontFamily?: string;
    fontSize?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textDecoration?: 'none' | 'underline' | 'line-through';
    fontStyle?: 'normal' | 'italic';
    textShadow?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
    width?: number | string;
    minWidth?: number;
    maxWidth?: number;
    height?: number | string;
    minHeight?: number;
    maxHeight?: number;
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Image component props
export interface ImageProps extends BaseComponentProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    borderRadius?: string | boolean;
    link?: string;
    linkTarget?: '_blank' | '_self';
    fallbackColor?: string;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    boxShadow?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    align?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

// Divider component props
export interface DividerProps extends BaseComponentProps {
    height?: number;
    color?: string;
    dividerStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
    width?: 'auto' | number | string;
    align?: 'left' | 'center' | 'right';
    text?: string;
    textColor?: string;
    textBackgroundColor?: string;
    textPadding?: number;
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: SpacingProps;
    margin?: SpacingProps;
    border?: BorderProps;
    borderRadius?: string;
    boxShadow?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    verticalAlign?: 'top' | 'middle' | 'bottom';
}

// SocialLinks component props
export interface SocialLinksProps extends BaseComponentProps {
    links: Array<{
        platform: string;
        url: string;
        icon?: string;
    }>;
    size?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'center' | 'right';
}

// Logo component props
export interface LogoProps extends BaseComponentProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    link?: string;
}
