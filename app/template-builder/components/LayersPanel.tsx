/**
 * Layers Panel - Bottom Panel
 * 
 * Hierarchical tree view of all components with drag-to-reorder functionality.
 */

'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useBuilderStore } from '../store';
import type { ComponentNode } from '../types';

export default function LayersPanel() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const components = useBuilderStore((state) => state.components);
    const selectedId = useBuilderStore((state) => state.selectedId);
    const selectComponent = useBuilderStore((state) => state.selectComponent);

    if (isCollapsed) {
        return (
            <div className="h-10 bg-[#1a1a2e] border-t border-gray-800 flex items-center px-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                    <Icons.ChevronUp className="w-4 h-4" />
                    <span className="font-medium">Show Layers</span>
                </button>
            </div>
        );
    }

    return (
        <div className="h-64 bg-[#1a1a2e] border-t border-gray-800 flex flex-col">
            {/* Header */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <Icons.Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-gray-300">Layers</span>
                    <span className="text-xs text-gray-500">({countComponents(components)})</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                    title="Collapse"
                >
                    <Icons.ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Layers Tree */}
            <div className="flex-1 overflow-y-auto p-2">
                {components.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No components yet
                    </div>
                ) : (
                    <div className="space-y-1">
                        {components.map((component) => (
                            <LayerItem
                                key={component.id}
                                component={component}
                                level={0}
                                selectedId={selectedId}
                                onSelect={selectComponent}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Layer Item Component
 */
function LayerItem({
    component,
    level,
    selectedId,
    onSelect,
}: {
    component: ComponentNode;
    level: number;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const deleteComponent = useBuilderStore((state) => state.deleteComponent);
    const updateComponent = useBuilderStore((state) => state.updateComponent);

    const hasChildren = component.children && component.children.length > 0;
    const isSelected = selectedId === component.id;

    const getIcon = () => {
        const iconMap: Record<string, any> = {
            section: Icons.LayoutGrid,
            column: Icons.Columns,
            text: Icons.Type,
            image: Icons.Image,
            button: Icons.RectangleHorizontal,
            spacer: Icons.Space,
            divider: Icons.Minus,
            video: Icons.Video,
            'social-links': Icons.Share2,
            html: Icons.Code2,
            'custom-code': Icons.FileCode,
        };
        return iconMap[component.type] || Icons.Box;
    };

    const Icon = getIcon();

    return (
        <>
            <div
                onClick={() => onSelect(component.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-all ${isSelected
                        ? 'bg-purple-500/20 border border-purple-500/50'
                        : 'hover:bg-gray-800/50 border border-transparent'
                    }`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
            >
                {/* Expand/Collapse */}
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="w-4 h-4 flex items-center justify-center hover:bg-gray-700 rounded transition-colors"
                    >
                        <Icons.ChevronRight
                            className={`w-3 h-3 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''
                                }`}
                        />
                    </button>
                ) : (
                    <div className="w-4" />
                )}

                {/* Icon */}
                <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-gray-500'}`} />

                {/* Name */}
                <span
                    className={`flex-1 text-sm truncate ${isSelected ? 'text-white font-medium' : 'text-gray-300'
                        }`}
                >
                    {component.name}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateComponent(component.id, { hidden: !component.hidden });
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title={component.hidden ? 'Show' : 'Hide'}
                    >
                        {component.hidden ? (
                            <Icons.EyeOff className="w-3 h-3 text-gray-500" />
                        ) : (
                            <Icons.Eye className="w-3 h-3 text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            updateComponent(component.id, { locked: !component.locked });
                        }}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title={component.locked ? 'Unlock' : 'Lock'}
                    >
                        {component.locked ? (
                            <Icons.Lock className="w-3 h-3 text-gray-500" />
                        ) : (
                            <Icons.LockOpen className="w-3 h-3 text-gray-400" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteComponent(component.id);
                        }}
                        className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-colors"
                        title="Delete"
                    >
                        <Icons.Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div>
                    {component.children!.map((child) => (
                        <LayerItem
                            key={child.id}
                            component={child}
                            level={level + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

/**
 * Count total components recursively
 */
function countComponents(components: ComponentNode[]): number {
    let count = components.length;
    components.forEach((component) => {
        if (component.children) {
            count += countComponents(component.children);
        }
    });
    return count;
}
