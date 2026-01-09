import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import type { ComponentType } from '../types';

interface DragPreviewProps {
    type?: ComponentType;
    name?: string;
}

export function DragPreview({ type, name }: DragPreviewProps) {
    if (!type) return null;

    // Map types to icons (simplified mapping)
    const getIcon = (type: ComponentType) => {
        switch (type) {
            case 'section': return Icons.LayoutTemplate;
            case 'column': return Icons.Columns;
            case 'text': return Icons.Type;
            case 'image': return Icons.Image;
            case 'button': return Icons.MousePointerClick;
            case 'social-links': return Icons.Share2;
            case 'spacer': return Icons.Space;
            case 'divider': return Icons.Minus;
            default: return Icons.Box;
        }
    };

    const Icon = getIcon(type);

    return (
        <div className="
            flex items-center gap-3 p-3 rounded-lg border border-purple-500/50 
            bg-gray-800/90 shadow-2xl shadow-purple-500/20 backdrop-blur-sm
            w-64 opacity-90 cursor-grabbing
        ">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-200">{name || 'Component'}</p>
                <p className="text-xs text-gray-400">Drag to place</p>
            </div>
        </div>
    );
}
