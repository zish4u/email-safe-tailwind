import React from 'react';
import { SpacerProps } from './types';

export const Spacer: React.FC<SpacerProps> = ({
    height,
    width = '100%',
    showInEditor = true,
    editorColor = '#f0f0f0',
    className = '',
    style = {},
    id,
}) => {
    const spacerStyles: React.CSSProperties = {
        height: `${height}px`,
        width: typeof width === 'number' ? `${width}px` : width,
        backgroundColor: showInEditor ? editorColor : 'transparent',
        border: showInEditor ? `1px dashed ${editorColor}` : 'none',
        ...style,
    };

    const combinedClasses = `
        block
        ${showInEditor ? 'spacer-visible' : 'spacer-invisible'}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    // For email compatibility, use a table-based approach
    return (
        <table
            width={typeof width === 'number' ? width : '100%'}
            border={0}
            cellSpacing={0}
            cellPadding={0}
            style={{
                width: typeof width === 'number' ? `${width}px` : width,
                height: `${height}px`,
                lineHeight: `${height}px`,
                fontSize: '1px',
            }}
            className={combinedClasses}
            id={id}
        >
            <tr>
                <td
                    style={{
                        height: `${height}px`,
                        lineHeight: `${height}px`,
                        fontSize: '1px',
                        backgroundColor: showInEditor ? editorColor : 'transparent',
                        border: showInEditor ? `1px dashed ${editorColor}` : 'none',
                        ...style,
                    }}
                    data-spacer-height={height}
                    data-spacer-width={width}
                    data-show-in-editor={showInEditor}
                    data-editor-color={editorColor}
                >
                    &nbsp;
                </td>
            </tr>
        </table>
    );
};
