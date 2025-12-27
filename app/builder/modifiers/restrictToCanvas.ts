import { Modifier } from '@dnd-kit/core';
import { getEventCoordinates } from '@dnd-kit/utilities';

export const restrictToCanvas: Modifier = ({
    transform,
    draggingNodeRect,
    containerNodeRect,
    windowRect,
}) => {
    if (!draggingNodeRect || !windowRect) {
        return transform;
    }

    const canvasElement = document.getElementById('canvas-area');
    if (!canvasElement) {
        return transform;
    }

    const canvasRect = canvasElement.getBoundingClientRect();

    // Calculate boundaries relative to the viewport
    // applied to the transform

    const value = {
        ...transform,
    };

    // Current position of the dragging node
    const currentTop = draggingNodeRect.top + transform.y;
    const currentLeft = draggingNodeRect.left + transform.x;
    const currentBottom = currentTop + draggingNodeRect.height;
    const currentRight = currentLeft + draggingNodeRect.width;

    // Constrain Y
    if (currentTop < canvasRect.top) {
        value.y += canvasRect.top - currentTop;
    } else if (currentBottom > canvasRect.bottom) {
        value.y += canvasRect.bottom - currentBottom;
    }

    // Constrain X
    if (currentLeft < canvasRect.left) {
        value.x += canvasRect.left - currentLeft;
    } else if (currentRight > canvasRect.right) {
        value.x += canvasRect.right - currentRight;
    }

    return value;
};
