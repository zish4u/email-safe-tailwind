/**
 * Email-safe validation utilities
 * Ensures templates are compatible with major email clients
 */

import { EMAIL_CLIENT_DIMENSIONS, SAFE_AREA_BOUNDARIES, EMAIL_WARNINGS, PreviewMode } from '../types';

export interface ValidationResult {
    isValid: boolean;
    warnings: string[];
    errors: string[];
    suggestions: string[];
}

export interface DimensionCheck {
    width: number;
    height: number;
    exceedsSafeArea: boolean;
    exceedsMaxWidth: boolean;
    belowMinWidth: boolean;
}

/**
 * Validates if dimensions are safe for email clients
 */
export function validateEmailDimensions(
    width: number,
    height: number,
    previewMode: PreviewMode
): ValidationResult {
    const dimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];

    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Width validation
    if (width > dimensions.maxWidth) {
        errors.push(EMAIL_WARNINGS.maxWidth);
        suggestions.push(`Reduce width to ${dimensions.safeWidth}px or less for optimal compatibility`);
    } else if (width > safeArea.width) {
        warnings.push(EMAIL_WARNINGS.padding);
        suggestions.push(`Consider reducing width to ${safeArea.width}px to stay within safe area`);
    }

    if (width < dimensions.minWidth) {
        warnings.push(EMAIL_WARNINGS.minWidth);
        suggestions.push(`Increase width to at least ${dimensions.minWidth}px for better readability`);
    }

    // Height validation (less critical but still important)
    if (height > 2000) {
        warnings.push('Email height exceeds 2000px - may be truncated in some clients');
        suggestions.push('Consider breaking long content into multiple sections');
    }

    return {
        isValid: errors.length === 0,
        warnings,
        errors,
        suggestions
    };
}

/**
 * Checks if a component position is within safe area
 */
export function checkSafeAreaBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    previewMode: PreviewMode
): DimensionCheck {
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];
    const dimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];

    return {
        width,
        height,
        exceedsSafeArea: x < safeArea.left ||
            (x + width) > (safeArea.left + safeArea.width) ||
            y < safeArea.top ||
            (y + height) > (safeArea.top + safeArea.height),
        exceedsMaxWidth: width > dimensions.maxWidth,
        belowMinWidth: width < dimensions.minWidth
    };
}

/**
 * Gets optimal positioning within safe area
 */
export function getOptimalPosition(
    width: number,
    height: number,
    previewMode: PreviewMode,
    preferredX?: number,
    preferredY?: number
): { x: number; y: number } {
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];

    let x = preferredX || safeArea.left;
    let y = preferredY || safeArea.top;

    // Ensure component fits within safe area
    if (x < safeArea.left) x = safeArea.left;
    if (y < safeArea.top) y = safeArea.top;

    if (x + width > safeArea.left + safeArea.width) {
        x = safeArea.left + safeArea.width - width;
    }

    if (y + height > safeArea.top + safeArea.height) {
        y = safeArea.top + safeArea.height - height;
    }

    // Ensure we don't go negative
    x = Math.max(safeArea.left, x);
    y = Math.max(safeArea.top, y);

    return { x, y };
}

/**
 * Validates component for email safety
 */
export function validateComponentForEmail(
    component: any,
    previewMode: PreviewMode
): ValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check component dimensions
    if (component.size?.width) {
        const dimensionCheck = checkSafeAreaBounds(
            component.position?.x || 0,
            component.position?.y || 0,
            component.size.width,
            component.size.height || 100,
            previewMode
        );

        if (dimensionCheck.exceedsMaxWidth) {
            errors.push(EMAIL_WARNINGS.maxWidth);
        }
        if (dimensionCheck.exceedsSafeArea) {
            warnings.push(EMAIL_WARNINGS.overflow);
        }
        if (dimensionCheck.belowMinWidth) {
            warnings.push(EMAIL_WARNINGS.minWidth);
        }
    }

    // Check for potentially problematic styles
    const style = component.style || {};

    if (style.position === 'fixed' || style.position === 'sticky') {
        warnings.push('Fixed/sticky positioning may not work in all email clients');
        suggestions.push('Use relative positioning instead for better compatibility');
    }

    if (style.float) {
        warnings.push('Float property has limited support in email clients');
        suggestions.push('Use flexbox or table layouts instead');
    }

    if (style.zIndex && parseInt(String(style.zIndex)) > 1000) {
        warnings.push('High z-index values may cause stacking issues in email clients');
        suggestions.push('Keep z-index values below 1000');
    }

    return {
        isValid: errors.length === 0,
        warnings,
        errors,
        suggestions
    };
}

/**
 * Gets email client compatibility info
 */
export function getEmailClientInfo(previewMode: PreviewMode) {
    const dimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];

    return {
        safeWidth: safeArea.width,
        maxWidth: dimensions.maxWidth,
        minWidth: dimensions.minWidth,
        recommendedWidth: dimensions.safeWidth,
        padding: dimensions.padding,
        compatibleClients: [
            'Gmail',
            'Outlook',
            'Apple Mail',
            'Yahoo Mail',
            'Thunderbird'
        ],
        unsupportedFeatures: [
            'position: fixed',
            'float: left/right',
            'CSS Grid',
            'Flexbox (limited)',
            'background-attachment: fixed'
        ]
    };
}
