"use client";
import React, { memo } from 'react';
import { LayersPanel } from './LayersPanel';
import { TemplateComponent, ComponentType, COMPONENT_DETAILS, COMPONENT_CATEGORIES } from '../types';

interface ComponentLibraryProps {
    onDragStart: (componentType: string) => void;
    components?: TemplateComponent[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    onToggleVisibility?: (id: string) => void;
}

/**
 * Component Library Sidebar
 * Displays categorized draggable components
 */
export const ComponentLibrary = memo(function ComponentLibrary({
    onDragStart,
    components = [],
    selectedId = null,
    onSelect = () => { },
    onToggleVisibility = () => { }
}: ComponentLibraryProps) {
    const [activeTab, setActiveTab] = React.useState<'components' | 'layers'>('components');

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 h-full flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-700/50">
                <button
                    onClick={() => setActiveTab('components')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'components' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Components
                </button>
                <button
                    onClick={() => setActiveTab('layers')}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'layers' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    Layers
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                {activeTab === 'components' ? (
                    <>
                        <div className="space-y-5">
                            {Object.entries(COMPONENT_CATEGORIES).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                        {category}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {items.map((componentType) => {
                                            const details = COMPONENT_DETAILS[componentType as ComponentType];
                                            return (
                                                <ComponentItem
                                                    key={componentType}
                                                    type={componentType}
                                                    icon={details?.icon || '📦'}
                                                    description={details?.description || 'Component'}
                                                    onDragStart={onDragStart}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-6 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <h4 className="text-xs font-semibold text-gray-400 mb-2">💡 Tips</h4>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Drag components to canvas</li>
                                <li>• Double-click text to edit</li>
                                <li>• Use handles to resize</li>
                                <li>• Ctrl+Z to undo</li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <LayersPanel
                        components={components}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onToggleVisibility={onToggleVisibility}
                    />
                )}
            </div>
        </div>
    );
});

// Individual component item
interface ComponentItemProps {
    type: string;
    icon: string;
    description: string;
    onDragStart: (type: string) => void;
}

const ComponentItem = memo(function ComponentItem({
    type,
    icon,
    description,
    onDragStart,
}: ComponentItemProps) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', `library-${type}`);
                e.dataTransfer.effectAllowed = 'copy';
                onDragStart(type);
            }}
            className="group bg-gray-700/30 hover:bg-gray-700/60 border border-gray-600/50 hover:border-blue-500/50 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] select-none"
            title={description}
        >
            <div className="flex flex-col items-center gap-1.5 text-center">
                <span className="text-2xl group-hover:scale-110 transition-transform">
                    {icon}
                </span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                    {type}
                </span>
            </div>
        </div>
    );
});

export default ComponentLibrary;
