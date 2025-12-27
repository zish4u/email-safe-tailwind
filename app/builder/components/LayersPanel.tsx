"use client";
import React, { useState } from 'react';
import { TemplateComponent } from '../types';

interface LayersPanelProps {
    components: TemplateComponent[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onToggleVisibility: (id: string) => void;
}

// Helper to build tree from flat list (duplicated logic to avoid circular deps if needed, 
// but ideally should be shared. Let's assume we pass flat components and build tree here or passed tree)
// For now, let's build tree locally.
function buildTree(components: TemplateComponent[]): TemplateComponent[] {
    const map = new Map<string, TemplateComponent>();
    const roots: TemplateComponent[] = [];

    // Clone to avoid mutating original objects in the map strictly
    components.forEach(c => {
        map.set(c.id, { ...c, children: [] });
    });

    components.forEach(c => {
        const node = map.get(c.id);
        if (c.parentId && map.has(c.parentId)) {
            map.get(c.parentId)!.children!.push(node!);
        } else {
            roots.push(node!);
        }
    });

    return roots;
}

export const LayersPanel = ({ components, selectedId, onSelect, onToggleVisibility }: LayersPanelProps) => {
    const tree = buildTree(components);

    return (
        <div className="h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-400 mb-2 px-1">Layers</h3>
            <div className="flex-1 overflow-auto space-y-0.5">
                {tree.map(node => (
                    <LayerItem
                        key={node.id}
                        node={node}
                        depth={0}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onToggleVisibility={onToggleVisibility}
                    />
                ))}
                {tree.length === 0 && (
                    <div className="text-xs text-gray-500 italic p-2 text-center">No components</div>
                )}
            </div>
        </div>
    );
};

const LayerItem = ({
    node,
    depth,
    selectedId,
    onSelect,
    onToggleVisibility
}: {
    node: TemplateComponent,
    depth: number,
    selectedId: string | null,
    onSelect: (id: string) => void,
    onToggleVisibility: (id: string) => void
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedId === node.id;

    return (
        <div>
            <div
                className={`
                    flex items-center gap-2 px-2 py-1.5 cursor-pointer text-xs rounded
                    ${isSelected ? 'bg-blue-600/20 text-blue-200' : 'hover:bg-gray-800 text-gray-300'}
                `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(node.id);
                }}
            >
                {/* Expand Toggle */}
                <button
                    className={`w-4 h-4 flex items-center justify-center text-gray-500 hover:text-white transition-colors ${!hasChildren ? 'invisible' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>

                {/* Icon based on type */}
                <span className="opacity-70">{getIconForType(node.type)}</span>

                {/* Label */}
                <span className="flex-1 truncate select-none">
                    {node.type}
                    {node.type === 'Text' && <span className="text-gray-500 ml-1">"{String(node.props.children || '').slice(0, 10)}..."</span>}
                </span>

                {/* Visibility Toggle */}
                <button
                    className={`p-1 rounded hover:bg-gray-700 ${node.isVisible === false ? 'text-gray-600' : 'text-gray-400'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(node.id);
                    }}
                    title={node.isVisible === false ? "Show" : "Hide"}
                >
                    {node.isVisible === false ? '🚫' : '👁️'}
                </button>
            </div>

            {/* Children */}
            {isExpanded && hasChildren && (
                <div>
                    {node.children!.map(child => (
                        <LayerItem
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onToggleVisibility={onToggleVisibility}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

function getIconForType(type: string) {
    switch (type) {
        case 'Section': return '📦';
        case 'Row': return '↔️';
        case 'Column': return '📐';
        case 'Group': return '🔲';
        case 'Text': return '📝';
        case 'Button': return '🔘';
        case 'Image': return '🖼️';
        case 'Divider': return '➖';
        default: return '🔹';
    }
}
