/**
 * Properties Panel - Right Panel
 * 
 * Component properties and style editor.
 */

'use client';

import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useBuilderStore } from '../store';
import StyleControls from './StyleControls';

export default function PropertiesPanel() {
    const selectedId = useBuilderStore((state) => state.selectedId);
    const components = useBuilderStore((state) => state.components); // Subscribe to changes
    const getComponentById = useBuilderStore((state) => state.getComponentById);
    const updateProps = useBuilderStore((state) => state.updateProps);
    const updateStyles = useBuilderStore((state) => state.updateStyles);

    const [activeTab, setActiveTab] = useState<'properties' | 'styles'>('properties');

    const selectedComponent = selectedId ? getComponentById(selectedId) : null;

    if (!selectedComponent) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                    <Icons.Settings className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">No Component Selected</h3>
                <p className="text-xs text-gray-500">
                    Select a component on the canvas to edit its properties
                </p>
            </div>
        );
    }

    const tabs = [
        { id: 'properties' as const, label: 'Properties', icon: Icons.Settings },
        { id: 'styles' as const, label: 'Styles', icon: Icons.Palette },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Icons.Box className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-200 truncate">
                            {selectedComponent.name}
                        </h3>
                        <p className="text-xs text-gray-500">{selectedComponent.type}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-all ${activeTab === tab.id
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'properties' ? (
                    <PropertiesContent component={selectedComponent} updateProps={updateProps} />
                ) : (
                    <StyleControls component={selectedComponent} updateStyles={updateStyles} />
                )}
            </div>
        </div>
    );
}

/**
 * Properties Content
 */
function PropertiesContent({
    component,
    updateProps
}: {
    component: any;
    updateProps: (id: string, props: any) => void;
}) {
    const handleChange = (key: string, value: any) => {
        updateProps(component.id, { [key]: value });
    };

    // Component-specific properties
    const renderPropertiesForType = () => {
        switch (component.type) {
            case 'text':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Content</label>
                            <textarea
                                value={component.props.content || ''}
                                onChange={(e) => handleChange('content', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50 resize-none"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Tag</label>
                            <select
                                value={component.props.tag || 'p'}
                                onChange={(e) => handleChange('tag', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="h1">Heading 1</option>
                                <option value="h2">Heading 2</option>
                                <option value="h3">Heading 3</option>
                                <option value="h4">Heading 4</option>
                                <option value="p">Paragraph</option>
                                <option value="span">Span</option>
                            </select>
                        </div>
                    </>
                );

            case 'column':
                return (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">
                            Column Span ({component.props.colSpan || 6}/12)
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            step="1"
                            value={component.props.colSpan || 6}
                            onChange={(e) => handleChange('colSpan', parseInt(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-gray-500 text-[10px] mt-1">
                            <span>1</span>
                            <span>3</span>
                            <span>6</span>
                            <span>9</span>
                            <span>12</span>
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Image URL</label>
                            <input
                                type="text"
                                value={component.props.src || ''}
                                onChange={(e) => handleChange('src', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Alt Text</label>
                            <input
                                type="text"
                                value={component.props.alt || ''}
                                onChange={(e) => handleChange('alt', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                                placeholder="Image description"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Link (optional)</label>
                            <input
                                type="text"
                                value={component.props.href || ''}
                                onChange={(e) => handleChange('href', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                                placeholder="https://..."
                            />
                        </div>
                    </>
                );

            case 'button':
                return (
                    <>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Button Text</label>
                            <input
                                type="text"
                                value={component.props.text || ''}
                                onChange={(e) => handleChange('text', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Link URL</label>
                            <input
                                type="text"
                                value={component.props.href || ''}
                                onChange={(e) => handleChange('href', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                                placeholder="https://..."
                            />
                        </div>
                    </>
                );

            case 'spacer':
                return (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Height</label>
                        <input
                            type="text"
                            value={component.props.height || '20px'}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            placeholder="20px"
                        />
                    </div>
                );

            case 'section':
                return (
                    // Section properties
                    <div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Max Width</label>
                            <select
                                value={component.props.maxWidth || '6xl'}
                                onChange={(e) => handleChange('maxWidth', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="sm">Small (Screen)</option>
                                <option value="md">Medium (Tablet)</option>
                                <option value="lg">Large (Desktop Link)</option>
                                <option value="xl">Extra Large</option>
                                <option value="2xl">2XL</option>
                                <option value="4xl">4XL</option>
                                <option value="6xl">6XL</option>
                                <option value="full">Full Width</option>
                            </select>
                        </div>
                    </div>
                );

            case 'social-links':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Align</label>
                            <div className="grid grid-cols-3 gap-1 bg-gray-800/50 p-1 rounded-lg">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleChange('align', align)}
                                        className={`p-1.5 rounded text-xs capitalize transition-all ${(component.props.align || 'left') === align
                                            ? 'bg-purple-500 text-white'
                                            : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Icon Size</label>
                            <select
                                value={component.props.size || 'md'}
                                onChange={(e) => handleChange('size', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>
                        <div className="border-t border-gray-800 pt-4">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Links</label>
                            <div className="space-y-2">
                                {(component.props.links || []).map((link: any, index: number) => (
                                    <div key={index} className="flex gap-2 items-center bg-gray-900/50 p-2 rounded border border-gray-800">
                                        <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-gray-700 rounded-full text-[10px] uppercase font-bold text-gray-300">
                                            {link.platform?.[0] || '?'}
                                        </div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...(component.props.links || [])];
                                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                                handleChange('links', newLinks);
                                            }}
                                            className="min-w-0 flex-1 bg-transparent text-xs text-gray-300 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                        <button
                                            onClick={() => {
                                                const newLinks = [...(component.props.links || [])].filter((_, i) => i !== index);
                                                handleChange('links', newLinks);
                                            }}
                                            className="text-gray-500 hover:text-red-400"
                                        >
                                            <Icons.X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newLinks = [...(component.props.links || []), { platform: 'facebook', url: 'https://' }];
                                        handleChange('links', newLinks);
                                    }}
                                    className="w-full py-1.5 text-xs text-purple-400 border border-dashed border-purple-500/30 rounded hover:bg-purple-500/10 transition-colors"
                                >
                                    + Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'divider':
                return (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Height</label>
                        <input
                            type="text"
                            value={component.props.height || '1px'}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200"
                        />
                    </div>
                );

            case 'section':
                return (
                    // Section properties
                    <div>
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Max Width</label>
                            <select
                                value={component.props.maxWidth || '6xl'}
                                onChange={(e) => handleChange('maxWidth', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="sm">Small (Screen)</option>
                                <option value="md">Medium (Tablet)</option>
                                <option value="lg">Large (Desktop Link)</option>
                                <option value="xl">Extra Large</option>
                                <option value="2xl">2XL</option>
                                <option value="4xl">4XL</option>
                                <option value="6xl">6XL</option>
                                <option value="full">Full Width</option>
                            </select>
                        </div>
                    </div>
                );

            case 'social-links':
                return (
                    // Social Links properties
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Align</label>
                            <div className="grid grid-cols-3 gap-1 bg-gray-800/50 p-1 rounded-lg">
                                {['left', 'center', 'right'].map((align) => (
                                    <button
                                        key={align}
                                        onClick={() => handleChange('align', align)}
                                        className={`p-1.5 rounded text-xs capitalize transition-all ${(component.props.align || 'left') === align
                                            ? 'bg-purple-500 text-white'
                                            : 'text-gray-400 hover:text-gray-200'
                                            }`}
                                    >
                                        {align}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-2">Icon Size</label>
                            <select
                                value={component.props.size || 'md'}
                                onChange={(e) => handleChange('size', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-purple-500/50"
                            >
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                            </select>
                        </div>

                        <div className="border-t border-gray-800 pt-4">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Links</label>
                            <div className="space-y-2">
                                {(component.props.links || []).map((link: any, index: number) => (
                                    <div key={index} className="flex gap-2 items-center bg-gray-900/50 p-2 rounded border border-gray-800">
                                        <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-gray-700 rounded-full text-[10px] uppercase font-bold text-gray-300">
                                            {link.platform?.[0] || '?'}
                                        </div>
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...(component.props.links || [])];
                                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                                handleChange('links', newLinks);
                                            }}
                                            className="min-w-0 flex-1 bg-transparent text-xs text-gray-300 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                        <button
                                            onClick={() => {
                                                const newLinks = [...(component.props.links || [])].filter((_, i) => i !== index);
                                                handleChange('links', newLinks);
                                            }}
                                            className="text-gray-500 hover:text-red-400"
                                        >
                                            <Icons.X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const newLinks = [...(component.props.links || []), { platform: 'facebook', url: 'https://' }];
                                        handleChange('links', newLinks);
                                    }}
                                    className="w-full py-1.5 text-xs text-purple-400 border border-dashed border-purple-500/30 rounded hover:bg-purple-500/10 transition-colors"
                                >
                                    + Add Link
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'divider': // Existing case handling fallback or defined elsewhere?
                return (
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Height</label>
                        <input
                            type="text"
                            value={component.props.height || '1px'}
                            onChange={(e) => handleChange('height', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-200"
                        />
                    </div>
                );
        }
    };

    return <>{renderPropertiesForType()}</>;
}
