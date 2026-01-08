/**
 * Canvas - Email Preview Area
 * 
 * Center canvas where email template is built and previewed.
 */

'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useBuilderStore } from '../store';
import CanvasComponent from './CanvasComponent';

export default function Canvas() {
    const components = useBuilderStore((state) => state.components);
    const canvasSettings = useBuilderStore((state) => state.canvasSettings);

    const { setNodeRef } = useDroppable({
        id: 'canvas-root',
        data: { type: 'canvas', parentId: null },
    });

    // Calculate canvas width based on preview mode
    const getCanvasWidth = () => {
        switch (canvasSettings.previewMode) {
            case 'mobile':
                return 375;
            case 'tablet':
                return 768;
            case 'desktop':
            default:
                return 600; // Standard email width
        }
    };

    const canvasWidth = getCanvasWidth();
    const scale = canvasSettings.zoom / 100;

    return (
        <div className="h-full w-full bg-[#0f0f1e] overflow-auto">
            <div className="min-h-full flex items-start justify-center p-8">
                {/* Canvas Container */}
                <div
                    style={{
                        width: `${canvasWidth}px`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                    }}
                    className="transition-transform duration-200"
                >
                    {/* Grid Background */}
                    {canvasSettings.showGrid && (
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `
                  linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                `,
                                backgroundSize: `${canvasSettings.gridSize}px ${canvasSettings.gridSize}px`,
                            }}
                        />
                    )}

                    {/* Email Canvas */}
                    <div
                        ref={setNodeRef}
                        className="relative bg-white shadow-2xl shadow-black/20 min-h-[400px]"
                        style={{ width: `${canvasWidth}px` }}
                    >
                        {/* Canvas Header - Visual Only */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

                        {/* Canvas Content */}
                        {components.length === 0 ? (
                            <div className="flex items-center justify-center min-h-[400px] text-gray-400">
                                <div className="text-center">
                                    <svg
                                        className="w-16 h-16 mx-auto mb-4 opacity-20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium mb-1">Empty Canvas</p>
                                    <p className="text-xs">Drag components here to start building</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-0">
                                {components.map((component) => (
                                    <CanvasComponent key={component.id} component={component} />
                                ))}
                            </div>
                        )}

                        {/* Canvas Width Indicator */}
                        <div className="absolute -top-6 left-0 right-0 flex items-center justify-center">
                            <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-mono">
                                {canvasWidth}px
                            </div>
                        </div>
                    </div>

                    {/* Preview Mode Label */}
                    <div className="mt-4 text-center">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg text-xs text-gray-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="3" />
                            </svg>
                            {canvasSettings.previewMode.charAt(0).toUpperCase() + canvasSettings.previewMode.slice(1)} Preview
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
