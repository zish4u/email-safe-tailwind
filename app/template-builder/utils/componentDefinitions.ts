/**
 * Component Definitions - Library Configuration
 * 
 * Defines all available components in the component library with metadata.
 */

import type { ComponentDefinition, ComponentType } from '../types';

export const componentDefinitions: ComponentDefinition[] = [
    // ========================================
    // Layout Components
    // ========================================
    {
        type: 'section',
        name: 'Section',
        icon: 'LayoutGrid',
        category: 'layout',
        description: 'Container section with background and padding',
        defaultProps: { maxWidth: '600px', align: 'center' },
        defaultStyles: {
            backgroundColor: '#ffffff',
            paddingTop: '20px',
            paddingRight: '20px',
            paddingBottom: '20px',
            paddingLeft: '20px',
        },
        canHaveChildren: true,
    },
    {
        type: 'column',
        name: 'Column',
        icon: 'Columns',
        category: 'layout',
        description: 'Column for multi-column layouts',
        defaultProps: { width: '50%' },
        defaultStyles: {
            paddingTop: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
            paddingLeft: '10px',
        },
        canHaveChildren: true,
        allowedParents: ['section'],
    },
    {
        type: 'spacer',
        name: 'Spacer',
        icon: 'Space',
        category: 'layout',
        description: 'Vertical spacing element',
        defaultProps: { height: '20px' },
        defaultStyles: {},
        canHaveChildren: false,
    },
    {
        type: 'divider',
        name: 'Divider',
        icon: 'Minus',
        category: 'layout',
        description: 'Horizontal dividing line',
        defaultProps: { thickness: '1px', style: 'solid' },
        defaultStyles: {
            borderColor: '#dddddd',
            marginTop: '10px',
            marginBottom: '10px',
        },
        canHaveChildren: false,
    },

    // ========================================
    // Content Components
    // ========================================
    {
        type: 'text',
        name: 'Text',
        icon: 'Type',
        category: 'content',
        description: 'Text content with rich formatting',
        defaultProps: { content: 'Your text here...', tag: 'p' },
        defaultStyles: {
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            lineHeight: '1.5',
            color: '#333333',
            paddingTop: '10px',
            paddingBottom: '10px',
        },
        canHaveChildren: false,
    },
    {
        type: 'image',
        name: 'Image',
        icon: 'Image',
        category: 'content',
        description: 'Responsive image with optional link',
        defaultProps: {
            src: 'https://via.placeholder.com/600x400',
            alt: 'Image description',
            width: '100%',
        },
        defaultStyles: {
            paddingTop: '10px',
            paddingBottom: '10px',
        },
        canHaveChildren: false,
    },
    {
        type: 'button',
        name: 'Button',
        icon: 'RectangleHorizontal',
        category: 'content',
        description: 'Call-to-action button',
        defaultProps: {
            text: 'Click Here',
            href: 'https://example.com',
            target: '_blank',
        },
        defaultStyles: {
            backgroundColor: '#007bff',
            color: '#ffffff',
            paddingTop: '12px',
            paddingRight: '24px',
            paddingBottom: '12px',
            paddingLeft: '24px',
            borderRadius: '4px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontWeight: '600',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
        },
        canHaveChildren: false,
    },
    {
        type: 'video',
        name: 'Video',
        icon: 'Video',
        category: 'content',
        description: 'Video thumbnail with play button',
        defaultProps: {
            thumbnailUrl: 'https://via.placeholder.com/600x400',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            alt: 'Video thumbnail',
        },
        defaultStyles: {
            paddingTop: '10px',
            paddingBottom: '10px',
        },
        canHaveChildren: false,
    },

    // ========================================
    // Advanced Components
    // ========================================
    {
        type: 'social-links',
        name: 'Social Links',
        icon: 'Share2',
        category: 'advanced',
        description: 'Social media icon links',
        defaultProps: {
            links: [
                { platform: 'facebook', url: 'https://facebook.com' },
                { platform: 'twitter', url: 'https://twitter.com' },
                { platform: 'instagram', url: 'https://instagram.com' },
            ],
            iconSize: '32px',
        },
        defaultStyles: {
            paddingTop: '10px',
            paddingBottom: '10px',
            textAlign: 'center',
        },
        canHaveChildren: false,
    },
    {
        type: 'html',
        name: 'HTML',
        icon: 'Code2',
        category: 'advanced',
        description: 'Custom HTML block',
        defaultProps: { html: '<p>Your custom HTML here...</p>' },
        defaultStyles: {},
        canHaveChildren: false,
    },
    {
        type: 'custom-code',
        name: 'Custom Code',
        icon: 'FileCode',
        category: 'advanced',
        description: 'Custom code snippet',
        defaultProps: { code: '<!-- Your custom code here -->' },
        defaultStyles: {},
        canHaveChildren: false,
    },
];

/**
 * Get component definition by type
 */
export const getComponentDefinition = (type: ComponentType): ComponentDefinition | undefined => {
    return componentDefinitions.find((def) => def.type === type);
};

/**
 * Get components by category
 */
export const getComponentsByCategory = (category: 'layout' | 'content' | 'advanced'): ComponentDefinition[] => {
    return componentDefinitions.filter((def) => def.category === category);
};
