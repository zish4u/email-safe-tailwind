// Email-safe component library exports

// Layout Components
export { Module } from './Module';
export { Grid } from './Grid';
export { GridItem } from './GridItem';
export { Group } from './Group';

// Element Components
export { Button } from './Button';
export { Text } from './Text';
export { Image } from './Image';
export { Divider } from './Divider';
export { Spacer } from './Spacer';

// Legacy Components (for backward compatibility)
export { Card } from './Card';
export { Header } from './Header';
export { Footer } from './Footer';
export { Section } from './Section';
export { SocialLinks } from './SocialLinks';
export { Logo } from './Logo';

// Component types
export type {
    ModuleProps,
    GridProps,
    GridItemProps,
    GroupProps,
    SpacerProps,
    ButtonProps,
    TextProps,
    ImageProps,
    DividerProps,
    // Legacy types
    CardProps,
    HeaderProps,
    FooterProps,
    SectionProps,
    SocialLinksProps,
    LogoProps
} from './types.ts';

// Supporting types
export type { SpacingProps, BorderProps } from './types.ts';
