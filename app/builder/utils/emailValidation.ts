/**
 * Email-safe validation utilities
 * Ensures templates are compatible with major email clients
 */

import { EMAIL_CLIENT_DIMENSIONS, SAFE_AREA_BOUNDARIES, EMAIL_WARNINGS, SAFE_AREA_RULES, PreviewMode } from '../types';

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
 * STRICTLY validates if dimensions are safe for email clients
 * Enforces safe area boundaries without exceptions
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

    // STRICT WIDTH ENFORCEMENT
    if (width > safeArea.width) {
        errors.push(EMAIL_WARNINGS.strictExceed);
        errors.push(`Maximum allowed width: ${safeArea.width}px (safe area)`);
        suggestions.push(`Component will be auto-resized to ${safeArea.width}px`);
    }

    if (width > dimensions.maxWidth) {
        errors.push(EMAIL_WARNINGS.maxWidth);
        suggestions.push(`Email client maximum: ${dimensions.maxWidth}px`);
    }

    if (width < dimensions.minWidth) {
        warnings.push(EMAIL_WARNINGS.minWidth);
        suggestions.push(`Minimum recommended: ${dimensions.minWidth}px`);
    }

    // Height validation
    if (height > 2000) {
        warnings.push('Email height exceeds 2000px - may be truncated');
        suggestions.push('Break long content into multiple sections');
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
 * STRICTLY enforces safe area boundaries - resizes components if needed
 * No exceptions allowed for email client compatibility
 */
export function enforceSafeAreaBoundaries(
    component: any,
    previewMode: PreviewMode
): any {
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];
    const dimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];

    const updatedComponent = { ...component };

    // STRICT WIDTH ENFORCEMENT
    if (updatedComponent.size?.width > safeArea.width) {
        updatedComponent.size = {
            ...updatedComponent.size,
            width: safeArea.width
        };
    }

    // STRICT POSITION ENFORCEMENT
    if (updatedComponent.position) {
        const optimalPos = getOptimalPosition(
            updatedComponent.size?.width || 100,
            updatedComponent.size?.height || 100,
            previewMode,
            updatedComponent.position.x,
            updatedComponent.position.y
        );
        updatedComponent.position = optimalPos;
    }

    return updatedComponent;
}

/**
 * Gets maximum allowed dimensions for safe area compliance
 */
export function getMaximumSafeDimensions(
    previewMode: PreviewMode
): { width: number; height: number; maxWidth: number } {
    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];
    const dimensions = EMAIL_CLIENT_DIMENSIONS[previewMode];

    return {
        width: safeArea.width,
        height: safeArea.height,
        maxWidth: dimensions.maxWidth
    };
}

/**
 * Validates and auto-corrects component to ensure safe area compliance
 */
export function ensureSafeAreaCompliance(
    component: any,
    previewMode: PreviewMode
): { component: any; wasModified: boolean; corrections: string[] } {
    const corrections: string[] = [];
    let wasModified = false;

    const safeArea = SAFE_AREA_BOUNDARIES[previewMode];
    const updatedComponent = { ...component };

    // Check and enforce width limits
    if (updatedComponent.size?.width > safeArea.width) {
        updatedComponent.size.width = safeArea.width;
        corrections.push(`Width resized to ${safeArea.width}px (safe area limit)`);
        wasModified = true;
    }

    // Check and enforce position within safe area
    if (updatedComponent.position) {
        const { x, y } = updatedComponent.position;
        const componentWidth = updatedComponent.size?.width || 100;
        const componentHeight = updatedComponent.size?.height || 100;

        if (x < safeArea.left) {
            updatedComponent.position.x = safeArea.left;
            corrections.push(`X position adjusted to safe area`);
            wasModified = true;
        }

        if (y < safeArea.top) {
            updatedComponent.position.y = safeArea.top;
            corrections.push(`Y position adjusted to safe area`);
            wasModified = true;
        }

        if (x + componentWidth > safeArea.left + safeArea.width) {
            updatedComponent.position.x = safeArea.left + safeArea.width - componentWidth;
            corrections.push(`X position adjusted to fit within safe area`);
            wasModified = true;
        }
    }

    return {
        component: updatedComponent,
        wasModified,
        corrections
    };
}
