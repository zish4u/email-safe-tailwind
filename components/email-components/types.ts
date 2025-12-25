// Common props for email components
export interface BaseComponentProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
    children: React.ReactNode;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    target?: '_blank' | '_self';
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
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small';
    color?: string;
    align?: 'left' | 'center' | 'right';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

// Image component props
export interface ImageProps extends BaseComponentProps {
    src: string;
    alt: string;
    width?: number | string;
    height?: number | string;
    fluid?: boolean;
    borderRadius?: boolean;
}

// Divider component props
export interface DividerProps extends BaseComponentProps {
    color?: string;
    thickness?: 'thin' | 'medium' | 'thick';
    spacing?: 'sm' | 'md' | 'lg';
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
