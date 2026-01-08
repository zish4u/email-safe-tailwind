/**
 * Component Factory - Default Component Creators
 * 
 * Factory functions to create component instances with sensible defaults.
 */

import type {
    ComponentNode,
    ComponentType,
    TextComponentProps,
    ImageComponentProps,
    ButtonComponentProps,
    SectionComponentProps,
    ColumnComponentProps,
    SpacerComponentProps,
    DividerComponentProps,
    SocialLinksComponentProps,
    VideoComponentProps,
    HtmlComponentProps,
    CustomCodeComponentProps,
} from '../types';

/**
 * Generate a unique component ID (client-safe, no SSR hydration issues)
 */
let idCounter = 0;
const generateId = (): string => {
    if (typeof window !== 'undefined') {
        // Client-side: use timestamp + random
        return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    // Server-side: use counter to ensure consistency
    return `comp-ssr-${++idCounter}`;
};

/**
 * Create a Text component
 */
export const createTextComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'text',
    name: 'Text',
    props: {
        content: 'Your text here...',
        tag: 'p',
    } as TextComponentProps,
    styles: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333333',
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    ...overrides,
});

/**
 * Create an Image component
 */
export const createImageComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'image',
    name: 'Image',
    props: {
        src: 'https://via.placeholder.com/600x400',
        alt: 'Image description',
        width: '100%',
    } as ImageComponentProps,
    styles: {
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    ...overrides,
});

/**
 * Create a Button component
 */
export const createButtonComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'button',
    name: 'Button',
    props: {
        text: 'Click Here',
        href: 'https://example.com',
        target: '_blank',
    } as ButtonComponentProps,
    styles: {
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
    ...overrides,
});

/**
 * Create a Section component (container)
 */
export const createSectionComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'section',
    name: 'Section',
    children: [],
    props: {
        maxWidth: '600px',
        align: 'center',
    } as SectionComponentProps,
    styles: {
        backgroundColor: '#ffffff',
        paddingTop: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
    },
    ...overrides,
});

/**
 * Create a Column component (for multi-column layouts)
 */
export const createColumnComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'column',
    name: 'Column',
    children: [],
    props: {
        width: '50%',
    } as ColumnComponentProps,
    styles: {
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
    },
    ...overrides,
});

/**
 * Create a Spacer component
 */
export const createSpacerComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'spacer',
    name: 'Spacer',
    props: {
        height: '20px',
    } as SpacerComponentProps,
    styles: {},
    ...overrides,
});

/**
 * Create a Divider component
 */
export const createDividerComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'divider',
    name: 'Divider',
    props: {
        thickness: '1px',
        style: 'solid',
    } as DividerComponentProps,
    styles: {
        borderColor: '#dddddd',
        marginTop: '10px',
        marginBottom: '10px',
    },
    ...overrides,
});

/**
 * Create a Social Links component
 */
export const createSocialLinksComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'social-links',
    name: 'Social Links',
    props: {
        links: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
        ],
        iconSize: '32px',
    } as SocialLinksComponentProps,
    styles: {
        paddingTop: '10px',
        paddingBottom: '10px',
        textAlign: 'center',
    },
    ...overrides,
});

/**
 * Create a Video component (thumbnail with play button)
 */
export const createVideoComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'video',
    name: 'Video',
    props: {
        thumbnailUrl: 'https://via.placeholder.com/600x400',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        alt: 'Video thumbnail',
    } as VideoComponentProps,
    styles: {
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    ...overrides,
});

/**
 * Create an HTML component
 */
export const createHtmlComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'html',
    name: 'HTML Block',
    props: {
        html: '<p>Your custom HTML here...</p>',
    } as HtmlComponentProps,
    styles: {},
    ...overrides,
});

/**
 * Create a Custom Code component
 */
export const createCustomCodeComponent = (overrides?: Partial<ComponentNode>): ComponentNode => ({
    id: generateId(),
    type: 'custom-code',
    name: 'Custom Code',
    props: {
        code: '<!-- Your custom code here -->',
    } as CustomCodeComponentProps,
    styles: {},
    ...overrides,
});

/**
 * Component factory map
 */
export const componentFactory: Record<ComponentType, (overrides?: Partial<ComponentNode>) => ComponentNode> = {
    text: createTextComponent,
    image: createImageComponent,
    button: createButtonComponent,
    section: createSectionComponent,
    column: createColumnComponent,
    spacer: createSpacerComponent,
    divider: createDividerComponent,
    'social-links': createSocialLinksComponent,
    video: createVideoComponent,
    html: createHtmlComponent,
    'custom-code': createCustomCodeComponent,
};

/**
 * Create a component by type
 */
export const createComponentByType = (
    type: ComponentType,
    overrides?: Partial<ComponentNode>
): ComponentNode => {
    const factory = componentFactory[type];
    if (!factory) {
        throw new Error(`Unknown component type: ${type}`);
    }
    return factory(overrides);
};
