/**
 * Component Library - Left Panel
 * 
 * Displays draggable components organized by category.
 */

'use client';

import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import { componentDefinitions, getComponentsByCategory } from '../utils/componentDefinitions';
import type { ComponentDefinition } from '../types';

/**
 * Draggable component card
 */
function DraggableComponent({ definition }: { definition: ComponentDefinition }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `library-${definition.type}`,
        data: {
            type: 'library',
            componentType: definition.type,
        },
    });

    // Get the icon component
    const IconComponent = (Icons as any)[definition.icon] || Icons.Box;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
        group relative p-3 rounded-lg border border-gray-700 bg-gray-800/50
        hover:bg-gray-800 hover:border-purple-500/50 transition-all cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
            title={definition.description}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all">
                    <IconComponent className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{definition.name}</p>
                    <p className="text-xs text-gray-500 truncate">{definition.category}</p>
                </div>
            </div>

            {/* Drag indicator */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icons.GripVertical className="w-4 h-4 text-gray-500" />
            </div>
        </div>
    );
}

/**
 * Collapsible category section
 */
function CategorySection({
    title,
    icon: Icon,
    components
}: {
    title: string;
    icon: any;
    components: ComponentDefinition[];
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors group"
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                        {title}
                    </span>
                    <span className="text-xs text-gray-500">({components.length})</span>
                </div>
                <Icons.ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {isExpanded && (
                <div className="p-3 space-y-2">
                    {components.map((component) => (
                        <DraggableComponent key={component.type} definition={component} />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Component Library Panel
 */
export default function ComponentLibrary() {
    const [searchQuery, setSearchQuery] = useState('');

    const layoutComponents = getComponentsByCategory('layout');
    const contentComponents = getComponentsByCategory('content');
    const advancedComponents = getComponentsByCategory('advanced');

    // Filter components based on search
    const filterComponents = (components: ComponentDefinition[]) => {
        if (!searchQuery) return components;
        return components.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-gray-300 mb-3">Components</h2>

                {/* Search */}
                <div className="relative">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto">
                <CategorySection
                    title="Layout"
                    icon={Icons.LayoutGrid}
                    components={filterComponents(layoutComponents)}
                />
                <CategorySection
                    title="Content"
                    icon={Icons.FileText}
                    components={filterComponents(contentComponents)}
                />
                <CategorySection
                    title="Advanced"
                    icon={Icons.Sparkles}
                    components={filterComponents(advancedComponents)}
                />
            </div>

            {/* Footer tip */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/30">
                <div className="flex items-start gap-2">
                    <Icons.Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">
                        Drag components to the canvas to start building your email template.
                    </p>
                </div>
            </div>
        </div>
    );
}
